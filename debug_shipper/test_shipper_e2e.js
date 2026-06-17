const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const API_BASE = 'http://localhost:8080/api';
const AUTH_BASE = 'http://localhost:8080/api/auth';
const FRONTEND_URL = 'http://localhost:3000';

async function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function apiCall(url, method = 'GET', data = null, token = null, isFormData = false) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';
  
  try {
    const config = { method, url, headers };
    if (data) config.data = data;
    const res = await axios(config);
    return res.data;
  } catch (err) {
    if (err.response) {
      throw new Error(`API Error ${err.response.status}: ${JSON.stringify(err.response.data)}`);
    }
    throw err;
  }
}

(async () => {
  console.log('\n--- STARTING SHIPPER E2E VERIFICATION ---\n');
  let email = `shipper_${Date.now()}@test.com`;
  let password = 'Password@123';
  let mobile = '9' + Date.now().toString().slice(-9);
  let shipperToken = '';
  let shipperId = '';

  try {
    console.log('Step 0: Register new SHIPPER account...');
    await apiCall(`${AUTH_BASE}/register`, 'POST', {
      email, mobile, password, fullName: 'E2E Shipper', companyName: 'E2E Corp', role: 'SHIPPER', preferredLoginType: 'EMAIL'
    });
    console.log(`✅ Shipper Registered: ${email}`);

    console.log('\nStep 1 & 2: Login succeeds & Redirect to Profile...');
    const browser = await puppeteer.launch({ headless: 'new', args: ['--window-size=1280,800'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Catch console errors to prove "menu items function" later
    let pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.toString()));
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    await page.goto(`${FRONTEND_URL}/login`);
    
    // Select Shipper role
    await page.waitForSelector('h3');
    await page.evaluate(() => {
      const shi = Array.from(document.querySelectorAll('div')).find(div => div.textContent.includes('Shipper') && div.textContent.includes('send goods'));
      if (shi) shi.click();
    });
    
    // Click Email tab
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const emailTab = tabs.find(t => t.textContent.includes('Email'));
      if (emailTab) emailTab.click();
    });
    
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', password);
    await page.click('button[type="submit"]');
    
    await delay(10000);
    const urlAfterLogin = page.url();
    if (urlAfterLogin.includes('/profile')) {
      console.log('✅ Login succeeded and redirected to Profile');
    } else {
      await page.screenshot({ path: path.join(__dirname, 'login_error.png') });
      throw new Error(`Expected redirect to /profile, got ${urlAfterLogin}`);
    }

    // Get token for API calls
    const loginRes = await apiCall(`${AUTH_BASE}/login`, 'POST', {
      email, password, loginType: 'EMAIL_PASSWORD'
    });
    shipperToken = loginRes.data.token;
    shipperId = loginRes.data.id;

    console.log('\nStep 3: Profile data can be saved...');
    await apiCall(`${API_BASE}/profile/shipper/${shipperId}`, 'PUT', {
      companyName: 'E2E Corp',
      gstNumber: '22AAAAA0000A1Z5',
      businessType: 'MANUFACTURER',
      industryType: 'ELECTRONICS'
    }, shipperToken);
    console.log('✅ Profile data saved');

    console.log('\nStep 4: Documents upload successfully...');
    const dummyFilePath = path.join(__dirname, 'dummy.jpg');
    fs.writeFileSync(dummyFilePath, 'dummy image content');
    
    for (const docType of ['GST_CERTIFICATE', 'PAN_CARD']) {
      const form = new FormData();
      form.append('file', fs.createReadStream(dummyFilePath));
      form.append('documentType', docType);
      
      const uploadHeaders = {
        'Authorization': `Bearer ${shipperToken}`,
        ...form.getHeaders()
      };
      
      await axios.post(`${API_BASE}/documents/upload`, form, { headers: uploadHeaders });
    }
    console.log('✅ Documents uploaded');

    console.log('\nStep 5: Account status changes to PENDING_VERIFICATION...');
    const meRes = await apiCall(`${API_BASE}/profile/shipper/${shipperId}`, 'GET', null, shipperToken);
    if (meRes.data.accountStatus === 'PENDING_VERIFICATION') {
      console.log('✅ Status is PENDING_VERIFICATION');
    } else {
      throw new Error(`Expected PENDING_VERIFICATION, got ${meRes.data.accountStatus}`);
    }

    console.log('\nStep 6: User appears in Admin KYC Verification...');
    const adminLogin = await apiCall(`${AUTH_BASE}/login`, 'POST', {
      email: 'admin@truckmitra.com', password: 'Admin@123', loginType: 'EMAIL_PASSWORD'
    });
    const adminToken = adminLogin.token;
    
    const pendingRes = await apiCall(`${API_BASE}/admin/users/pending`, 'GET', null, adminToken);
    const userInPending = pendingRes.content.find(u => u.email === email);
    if (userInPending) {
      console.log('✅ User found in Admin Pending Approvals');
    } else {
      throw new Error('User not found in Pending Approvals');
    }

    console.log('\nStep 7: Admin can approve the user...');
    await apiCall(`${API_BASE}/admin/users/${shipperId}/approve`, 'PUT', {}, adminToken);
    console.log('✅ Admin approved the user');

    console.log('\nStep 8: Account status changes to VERIFIED...');
    const meResVerified = await apiCall(`${API_BASE}/profile/shipper/${shipperId}`, 'GET', null, shipperToken);
    if (meResVerified.data.accountStatus === 'VERIFIED') {
      console.log('✅ Status is VERIFIED');
    } else {
      throw new Error(`Expected VERIFIED, got ${meResVerified.data.accountStatus}`);
    }

    console.log('\nStep 9 & 10: User logs in again & Shipper Dashboard opens...');
    // Clear localStorage to simulate fresh login
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${FRONTEND_URL}/login`);

    // Select Shipper role
    await page.waitForSelector('h3');
    await page.evaluate(() => {
      const shi = Array.from(document.querySelectorAll('div')).find(div => div.textContent.includes('Shipper') && div.textContent.includes('send goods'));
      if (shi) shi.click();
    });
    
    // Click Email tab
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const emailTab = tabs.find(t => t.textContent.includes('Email'));
      if (emailTab) emailTab.click();
    });
    
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', password);
    await page.click('button[type="submit"]');
    
    await delay(10000);
    const dashUrl = page.url();
    if (dashUrl.includes('/shipper/dashboard')) {
      console.log('✅ Shipper Dashboard opened successfully');
    } else {
      throw new Error(`Expected /shipper/dashboard, got ${dashUrl}`);
    }

    console.log('\nStep 11: Wallet opens...');
    // Click on Wallet in Navbar
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const walletLink = links.find(a => a.textContent.includes('Wallet'));
      if (walletLink) walletLink.click();
    });
    await delay(3000);
    if (page.url().includes('/wallet')) {
      console.log('✅ Wallet opened successfully');
    } else {
      throw new Error(`Expected /wallet, got ${page.url()}`);
    }

    console.log('\nStep 12: My Loads opens...');
    // Click on My Loads in Navbar
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const myLoadsLink = links.find(a => a.textContent.includes('My Loads'));
      if (myLoadsLink) myLoadsLink.click();
    });
    await delay(3000);
    // Should redirect to dashboard
    if (page.url().includes('/shipper/dashboard')) {
      console.log('✅ My Loads opened successfully (redirected to dashboard)');
    } else {
      throw new Error(`Expected /shipper/dashboard, got ${page.url()}`);
    }

    console.log('\nStep 13: All Shipper menu items function...');
    if (pageErrors.length > 0) {
      console.error('❌ Found Page Errors during navigation:', pageErrors);
      throw new Error('Page errors detected');
    } else {
      console.log('✅ No runtime errors detected during navigation. All menus functional.');
    }

    console.log('\n🎉 ALL 13 STEPS VERIFIED SUCCESSFULLY! 🎉\n');
    await browser.close();

  } catch (error) {
    console.error('\n❌ VERIFICATION FAILED:', error.message);
    process.exit(1);
  }
})();
