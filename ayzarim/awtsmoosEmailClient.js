/**
 * B"H
 * @module AwtsmoosEmailClient
 * a client for SENDING emails
 * @example
 * 
    const smtpClient = new AwtsmoosEmailClient('your_smtp_server_here');
    smtpClient.sendMail(
        'sender@example.com', 
        'recipient@example.com', 
        'Subject: Test email\r\n\r\nThis is a test email.'
    );

 */

const net = require('net');
const CRLF = '\r\n';

class AwtsmoosEmailClient {
  constructor(smtpServer, port = 25) {
    this.smtpServer = smtpServer;
    this.port = port;
  }

  sendMail(sender, recipient, data) {
    const client = net.createConnection(this.port, this.smtpServer, () => {
      console.log('Connected to SMTP server');
    });

    client.setEncoding('utf-8');

    let stage = 0;

    client.on('data', (data) => {
      console.log('Server: ' + data);

      switch (stage) {
        case 0:
          client.write(`EHLO localhost${CRLF}`);
          stage++;
          break;
        case 1:
          client.write(`MAIL FROM:<${sender}>${CRLF}`);
          stage++;
          break;
        case 2:
          client.write(`RCPT TO:<${recipient}>${CRLF}`);
          stage++;
          break;
        case 3:
          client.write(`DATA${CRLF}`);
          stage++;
          break;
        case 4:
          client.write(`${data}${CRLF}.${CRLF}`);
          stage++;
          break;
        case 5:
          client.write(`QUIT${CRLF}`);
          stage++;
          break;
      }
    });

    client.on('end', () => {
      console.log('Disconnected from SMTP server');
    });

    client.on('error', (err) => {
      console.log('Error:', err);
    });
  }
}
module.exports = AwtsmoosEmailClient;