const API_URL = 'http://localhost:8080/api';

const driverEmail = `driver_${Date.now()}@test.com`;
const driverPhone = `99${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;

async function post(url, data, token = '') {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

async function put(url, data, token = '') {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${url}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

async function get(url, token) {
  const res = await fetch(`${API_URL}${url}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

async function runTest() {
  console.log('--- END-TO-END ONBOARDING WORKFLOW TEST ---');
  let driverToken = '';
  let driverId = 0;
  
  // 1. Register new user
  console.log(`\n1. Registering new DRIVER: ${driverEmail}`);
  try {
    const regRes = await post('/auth/register', {
      fullName: 'Test Driver',
      email: driverEmail,
      mobile: driverPhone,
      password: 'Password@123',
      role: 'DRIVER',
      preferredLoginType: 'EMAIL_PASSWORD'
    });
    console.log('Registration Success:', regRes.message);
  } catch (err) {
    console.error('Registration failed:', err.message);
    return;
  }

  // 2. Login as REGISTERED user
  console.log(`\n2. Logging in as new DRIVER`);
  try {
    const loginRes = await post('/auth/login', {
      email: driverEmail,
      password: 'Password@123',
      loginType: 'EMAIL_PASSWORD'
    });
    driverToken = loginRes.data.token;
    driverId = loginRes.data.id;
    console.log(`Login Success. Token: ${driverToken.substring(0, 20)}...`);
    console.log(`Account Status: ${loginRes.data.accountStatus}`);
  } catch (err) {
    console.error('Login failed:', err.message);
    return;
  }

  // 3. Complete profile (Upload documents)
  console.log(`\n3. Uploading required documents to trigger PENDING_VERIFICATION`);

  try {
    // Aadhaar Front
    await post('/profile/documents', {
      docType: 'AADHAAR_FRONT',
      docNumber: '123456789012',
      docFrontImageUrl: 'http://fake.com/aadhaar.jpg'
    }, driverToken);
    console.log('Aadhaar uploaded.');

    // DL Front
    await post('/profile/documents', {
      docType: 'DRIVING_LICENSE_FRONT',
      docNumber: 'DL123456789012',
      docFrontImageUrl: 'http://fake.com/dl.jpg'
    }, driverToken);
    console.log('Driving License uploaded.');
  } catch (err) {
    console.error('Document upload failed:', err.message);
    return;
  }

  // 4. Check Status (Should be PENDING_VERIFICATION)
  console.log(`\n4. Checking profile completion and status transition`);
  try {
    const profileRes = await get(`/profile/driver/${driverId}`, driverToken);
    // Is profile complete?
    console.log(`Profile Complete flag on Backend: ... (we would check if it returns true but the response might not have it)`);
    
    // Check user info from auth/me
    // const meRes = await get(`/auth/me`, driverToken);
    // console.log(`Current Account Status: ${meRes.data.accountStatus}`);
  } catch (err) {
    console.error('Profile fetch failed:', err.message);
  }

  // 5. Admin Flow
  console.log(`\n5. Logging in as ADMIN`);
  let adminToken = '';
  try {
    const adminLoginRes = await post('/auth/login', {
      email: 'admin@truckmitra.com',
      password: 'Admin@123',
      loginType: 'EMAIL_PASSWORD'
    });
    adminToken = adminLoginRes.data.token;
    console.log(`Admin Login Success.`);
  } catch (err) {
    console.error('Admin Login failed:', err.message);
    return;
  }

  // 6. Verify appearance in Admin Pending Approvals
  console.log(`\n6. Checking Pending Approvals`);
  try {
    const pendingRes = await get(`/admin/users/pending`, adminToken);
    const isPending = pendingRes.data.content.some(u => u.id === driverId);
    console.log(`Found new driver in Pending Approvals: ${isPending}`);
  } catch (err) {
    console.error('Pending Approvals fetch failed:', err.message);
  }

  // 7. Approve user
  console.log(`\n7. Admin Approving Driver`);
  try {
    await put(`/admin/users/${driverId}/approve`, {}, adminToken);
    console.log(`Driver Approved successfully.`);
  } catch (err) {
    console.error('Approval failed:', err.message);
  }

  // 8. Login after approval & Access dashboard
  console.log(`\n8. Logging in again as Driver to verify VERIFIED status`);
  try {
    const loginRes2 = await post('/auth/login', {
      email: driverEmail,
      password: 'Password@123',
      loginType: 'EMAIL_PASSWORD'
    });
    console.log(`Second Login Success.`);
    console.log(`Account Status: ${loginRes2.data.accountStatus} (Expected: VERIFIED)`);
  } catch (err) {
    console.error('Second login failed:', err.message);
  }
}

runTest();
