// test-server.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/test',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(`❌ Connection failed: ${e.message}`);
  console.log('Make sure:');
  console.log('1. Backend server is running (npm start in server folder)');
  console.log('2. MongoDB is running');
  console.log('3. Port 5000 is not busy');
});

req.end();