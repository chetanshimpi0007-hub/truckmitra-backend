const API_URL = 'http://localhost:8080';

const USERS = [
  { role: 'Admin', mobile: '9999999999', password: 'Admin@123' },
  { role: 'Shipper', mobile: '7777777777', password: 'Shipper@123' },
  { role: 'Transporter', mobile: '6666666666', password: 'Transporter@123' },
  { role: 'Driver', mobile: '8888888888', password: 'Driver@123' }
];

async function authFetch(url, token, options = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return await res.json();
}

async function verifyUser(user) {
  try {
    console.log(`\n===========================================`);
    console.log(`VERIFYING ROLE: ${user.role}`);
    console.log(`===========================================`);

    // 1. LOGIN
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: user.mobile, password: user.password, loginType: 'EMAIL_PASSWORD' })
    });
    
    if (!loginRes.ok) throw new Error(`Login failed: ${await loginRes.text()}`);
    
    const loginData = await loginRes.json();
    const token = loginData.data.token || loginData.data.accessToken;
    // user could be loginData.data.user or loginData.data
    const profile = loginData.data.user || loginData.data;

    console.log(`✅ Login Success!`);
    console.log(`👤 Profile Rendering Data:`);
    console.log(`   - Name: ${profile.fullName || 'N/A'}`);
    console.log(`   - Avatar Fallback Ready: ${!profile.profileImageUrl ? 'YES (No image URL, will use initials)' : 'Image URL found'}`);
    console.log(`   - Role Badge: ${profile.role || 'N/A'}`);

    // 2. WALLET
    try {
      const walletData = await authFetch('/api/wallet/my', token);
      console.log(`💰 Wallet API (/api/wallet/my) Success! Balance: ₹${walletData.data.currentBalance}`);
    } catch (e) {
      console.log(`⚠️ Wallet API failed: ${e.message}`);
    }

    // 3. ROLE-SPECIFIC STATS
    if (user.role === 'Admin') {
      const analyticsData = await authFetch('/api/analytics/admin', token);
      console.log(`📊 Admin Analytics API Success!`);
      console.log(`   - Total Users: ${analyticsData.totalUsers}`);
      console.log(`   - Total Loads: ${analyticsData.totalLoads}`);
      console.log(`   - Revenue Trend: ${JSON.stringify(analyticsData.revenueTrends)}`);
      
      const pendingData = await authFetch('/api/admin/users?status=PENDING_VERIFICATION', token);
      console.log(`👥 Admin Pending Approvals API Success! Pending Count: ${pendingData.data?.length || 0}`);
    } 
    else if (user.role === 'Shipper') {
      const loadsData = await authFetch('/api/loads/shipper', token);
      const loads = loadsData || [];
      const activeLoads = loads.filter(l => !['COMPLETED', 'DELIVERED', 'CANCELLED', 'REJECTED'].includes(l.status)).length;
      console.log(`📦 Shipper Loads API Success! Total Loads: ${loads.length}, Active: ${activeLoads}`);

      const tripsData = await authFetch('/api/trips/shipper', token);
      const trips = tripsData || [];
      const completed = trips.filter(t => t.status === 'COMPLETED' || t.status === 'DELIVERED').length;
      console.log(`🚚 Shipper Trips API Success! Completed Trips: ${completed}`);
    }
    else if (user.role === 'Transporter') {
      const vehiclesData = await authFetch('/api/vehicles/me', token);
      const vehicles = vehiclesData.data || vehiclesData || [];
      console.log(`🚛 Transporter Fleet API Success! Vehicles: ${vehicles.length || 0}`);

      const driversData = await authFetch('/api/drivers/me', token);
      const drivers = driversData.data || driversData || [];
      console.log(`👷 Transporter Drivers API Success! Drivers: ${drivers.length || 0}`);

      const tripsData = await authFetch(`/api/trips/transporter/${profile.id}`, token);
      const trips = tripsData.data || tripsData || [];
      const activeTrips = trips.filter(t => t.driver && !['COMPLETED', 'CANCELLED'].includes(t.status)).length;
      console.log(`📍 Transporter Trips API Success! Active Trips: ${activeTrips}`);
    }
    else if (user.role === 'Driver') {
      const tripsData = await authFetch(`/api/trips/driver/${profile.id}`, token);
      const trips = tripsData.data || tripsData || [];
      const assigned = trips.filter(t => t.status === 'ASSIGNED').length;
      const completed = trips.filter(t => t.status === 'COMPLETED' || t.status === 'DELIVERED').length;
      console.log(`🛣️ Driver Trips API Success! Assigned: ${assigned}, Completed: ${completed}`);
    }

  } catch (err) {
    console.error(`❌ Error verifying ${user.role}:`, err.message);
  }
}

async function run() {
  for (const user of USERS) {
    await verifyUser(user);
  }
}

run();
