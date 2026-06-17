const http = require('http');

function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    
    let resData = '';
    const req = http.request(options, res => {
      res.on('data', chunk => resData += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data: resData }));
    });
    
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTest() {
  console.log('1. Registering new driver...');
  const regRes = await makeRequest('/api/auth/register', {
    role: 'DRIVER',
    fullName: 'E2E Driver',
    mobile: '9231231234',
    email: 'e2e@driver.com',
    password: 'Password123',
    preferredLoginType: 'EMAIL_PASSWORD'
  });
  console.log('Register status:', regRes.statusCode);
  console.log('Register response:', regRes.data);
  
  console.log('\n2. Logging in as new driver...');
  const loginRes = await makeRequest('/api/auth/login', {
    loginType: 'EMAIL_PASSWORD',
    mobile: '9231231234',
    password: 'Password123'
  });
  console.log('Login status:', loginRes.statusCode);
  console.log('Login response:', loginRes.data);
}

runTest().catch(console.error);
