// server/find-port.js
const net = require('net');
const exec = require('child_process').exec;

const port = 5000;

// Check if port is in use
const server = net.createServer();

server.once('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${port} is already in use!`);
    
    // Find the process (Windows)
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      if (stdout) {
        console.log("Processes using port 5000:");
        console.log(stdout);
      }
    });
    
    // For Mac/Linux use: lsof -i :${port}
  }
});

server.once('listening', () => {
  console.log(`✅ Port ${port} is available`);
  server.close();
});

server.listen(port);