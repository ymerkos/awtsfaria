/**
 * B"H
 * a script used for email testing
 */

const net = require('net');
const tls = require('tls');

const socket = net.connect(25, 'gmail-smtp-in.l.google.com', () => {
  console.log('Connected to server');
  socket.write('EHLO localhost\r\n');
});

let response = '';

socket.on('data', (data) => {
  response += data.toString();
  console.log(data.toString());

  if (response.includes('250-STARTTLS')) {
    console.log('Sending STARTTLS...');
    socket.write('STARTTLS\r\n');
    response = ''; // Clear response to wait for the new one after STARTTLS
  } else if (response.startsWith('220 ') && response.includes('Ready to start TLS')) {
    console.log('Starting TLS...');
    
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
