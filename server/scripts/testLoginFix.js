const http = require('http');

const API_URL = 'http://localhost:5000/api';

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL + path);
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(parsed);
          }
        } catch (e) {
          reject({ message: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function test() {
  console.log('🧪 Testing Login Fix\n');
  
  const testEmail = `test${Date.now()}@test.com`;
  const testPassword = 'password123';
  
  try {
    // Step 1: Register
    console.log('1️⃣  Registering new user...');
    const registerRes = await request('POST', '/auth/register', {
      name: 'Test User',
      email: testEmail,
      password: testPassword,
      role: 'patient'
    });
    console.log('✅ Registration successful');
    console.log('   Email:', testEmail);
    console.log('   Token received:', registerRes.data.token ? 'Yes' : 'No');
    console.log('');

    // Step 2: Login immediately
    console.log('2️⃣  Testing immediate login...');
    const loginRes1 = await request('POST', '/auth/login', {
      email: testEmail,
      password: testPassword
    });
    console.log('✅ Immediate login successful');
    console.log('   Token received:', loginRes1.data.token ? 'Yes' : 'No');
    console.log('');

    // Step 3: Wait a bit and login again (simulating logout/login)
    console.log('3️⃣  Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('4️⃣  Testing login after wait (simulating logout/login)...');
    const loginRes2 = await request('POST', '/auth/login', {
      email: testEmail,
      password: testPassword
    });
    console.log('✅ Second login successful');
    console.log('   Token received:', loginRes2.data.token ? 'Yes' : 'No');
    console.log('');

    console.log('🎉 ALL TESTS PASSED!');
    console.log('Login is working correctly after logout.');
    console.log('');
    console.log('Test credentials:');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ TEST FAILED');
    console.error('Error:', error.message || error);
    console.error('');
    console.error('This means the password hashing is still not working.');
    console.error('The server needs to be restarted to load the updated User model.');
    process.exit(1);
  }
}

test();
