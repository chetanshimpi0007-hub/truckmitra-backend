const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:8080';

// Create a dummy 1x1 GIF to upload
const DUMMY_IMAGE = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

async function run() {
  try {
    console.log('1. Logging in as Driver...');
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: '8888888888', password: 'Driver@123', loginType: 'EMAIL_PASSWORD' })
    });
    
    if (!loginRes.ok) throw new Error(`Login failed: ${await loginRes.text()}`);
    const loginData = await loginRes.json();
    console.log(loginData);
    const token = loginData.data?.token || loginData.data?.accessToken;
    const userId = loginData.data?.id || loginData.data?.user?.id;
    console.log(`✅ Logged in successfully. User ID: ${userId}`);

    // Create form data using the buffer
    const formData = new FormData();
    formData.append('file', new Blob([DUMMY_IMAGE], { type: 'image/gif' }), 'dummy.gif');

    console.log('\n2. Testing /api/profile/{id}/upload-image endpoint...');
    const uploadRes = await fetch(`${API_URL}/api/profile/${userId}/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    console.log(`Upload API Status: ${uploadRes.status}`);
    const uploadText = await uploadRes.text();
    console.log(`Upload API Response: ${uploadText}`);

    console.log('\n3. Testing /api/profile/documents with PROFILE_PICTURE...');
    const docRes = await fetch(`${API_URL}/api/profile/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        docType: 'PROFILE_PICTURE',
        docFrontImageUrl: 'https://dummyimage.com/200x200/000/fff'
      })
    });
    console.log(`Document API Status: ${docRes.status}`);
    console.log(`Document API Response: ${await docRes.text()}`);

    console.log('\n4. Fetching profile to verify DB update...');
    const profileRes = await fetch(`${API_URL}/api/profile/driver/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`Profile Fetch Status: ${profileRes.status}`);
    const profileData = await profileRes.json();
    console.log(`Profile Image URL in DB: ${profileData.data?.profileImageUrl || profileData.data?.user?.profileImageUrl}`);

  } catch (err) {
    console.error('❌ Error during test:', err);
  }
}

run();
