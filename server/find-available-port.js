//server/utils/find-available-port.js
import net from 'net';

const checkPort = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', () => {
      resolve(false);
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
};

const findAvailablePort = async (startPort = 5000) => {
  for (let port = startPort; port < startPort + 10; port++) {
    const isAvailable = await checkPort(port);
    if (isAvailable) {
      console.log(`✅ Port ${port} is available`);
      return port;
    }
    console.log(`❌ Port ${port} is in use`);
  }
  throw new Error('No available ports found');
};

export default findAvailablePort;