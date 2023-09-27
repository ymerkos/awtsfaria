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

let response = '';

socket.on('data', (data) => {
  response += data.toString();
  console.log(data.toString());

  // Check if the last line in the response is the end of the EHLO response
  if (response.split('\n').some(line => line.startsWith('250 '))) {
    // Check if the server is ready to start TLS
    if (response.includes('250-STARTTLS')) {
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
  }
});

socket.on('error', (err) => {
  console.error('Socket error:', err);
});

