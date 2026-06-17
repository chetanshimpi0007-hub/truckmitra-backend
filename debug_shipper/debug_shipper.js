const puppeteer = require('puppeteer');

async function apiCall(path, method = 'GET', data = null, token = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (token) options.headers['Authorization'] = `Bearer ${token}`;
  if (data) options.body = JSON.stringify(data);
  const res = await fetch(`http://localhost:8080${path}`, options);
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

(async () => {
  try {
    console.log('1. Registering Shipper...');
    const email = `shipper_${Date.now()}@test.com`;
    await apiCall('/api/auth/register', 'POST', {
      email: email,
      mobile: '9' + Date.now().toString().slice(-9),
      password: 'Password@123',
      fullName: 'Test Shipper',
      companyName: 'Test Company',
      role: 'SHIPPER',
      preferredLoginType: 'EMAIL'
    });

    console.log('2. Logging in as Admin...');
    const adminLogin = await apiCall('/api/auth/login', 'POST', {
      email: 'admin@truckmitra.com',
      password: 'Admin@123',
      loginType: 'EMAIL_PASSWORD'
    });
    const adminToken = adminLogin.data.token;

    console.log('3. Fetching User ID...');
    const pendingRes = await apiCall('/api/admin/users/pending', 'GET', null, adminToken);
    let user = pendingRes.data.content.find(u => u.email === email);
    
    if (!user) {
      console.log('User not in pending, finding in all users...');
      const allRes = await apiCall('/api/admin/users', 'GET', null, adminToken);
      user = allRes.data.content.find(u => u.email === email);
    }
    
    if (!user) throw new Error("Could not find registered shipper");

    console.log('4. Approving Shipper...');
    await apiCall(`/api/admin/users/${user.id}/approve`, 'PUT', {}, adminToken);

    console.log('5. Starting Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    console.log('6. Navigating to login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('input[type="email"]');
    
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', 'Password@123');
    await page.click('button[type="submit"]');
    
    console.log('7. Waiting for navigation...');
    await new Promise(r => setTimeout(r, 8000));
    
    console.log('Current URL:', page.url());
    
    console.log('8. Going to Shipper Dashboard directly if not already there...');
    await page.goto('http://localhost:3000/shipper/dashboard');
    await new Promise(r => setTimeout(r, 4000));
    console.log('Dashboard URL:', page.url());
    
    console.log('9. Clicking Wallet...');
    await page.goto('http://localhost:3000/wallet');
    await new Promise(r => setTimeout(r, 4000));
    console.log('Wallet URL:', page.url());

    await browser.close();
  } catch (e) {
    console.error('ERROR:', e);
  }
})();
