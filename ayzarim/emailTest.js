/**
 * B"H
 * a script used for email testing
 */

const net = require('net');
const tls = require('tls');

// Connect to the Gmail SMTP server on port 25
const socket = net.connect(25, 'gmail-smtp-in.l.google.com', () => {
  console.log('Connected to server');
  
  // Send the EHLO command
  socket.write('EHLO localhost\r\n');
});

socket.on('data', (data) => {
  console.log(data.toString());
  
  // If the server responds with 250, it is ready to start TLS
  if (data.toString().startsWith('250 ')) {
    console.log('Starting TLS...');
    
    // Upgrade the socket to a secure TLS socket
    const secureSocket = tls.connect({
      socket: socket,
      servername: 'gmail-smtp-in.l.google.com',
    }, () => {
      console.log('TLS connection established');
      secureSocket.end();
    });

    secureSocket.on('data', (data) => {
      console.log(data.toString());
    });

    secureSocket.on('error', (err) => {
      console.error('TLS error:', err);
    });
  }
});

socket.on('error', (err) => {
  console.error('Socket error:', err);
});
