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
            console.log('Connected to SMTP server, to send');
        });

        client.setEncoding('utf-8');

        let stage = 0;

        client.on('data', (data) => {
            console.log('Server: ' + data);

            // Check for error response from server
            if (data.startsWith('4') || data.startsWith('5')) {
                console.error('Error from server:', data);
                client.end();
                return;
            }

            switch (stage) {
                case 0:
                    client.write(`EHLO awtsmoos.one${CRLF}`);
                    
                    stage++;
                    console.log("EHLO command", stage)
                    break;
                case 1:
                    client.write(`MAIL FROM:<${sender}>${CRLF}`);
                    stage++;
                    console.log("MF command", stage)
                    break;
                case 2:
                    client.write(`RCPT TO:<${recipient}>${CRLF}`);
                    stage++;
                    console.log("RC command", stage)
                    break;
                case 3:
                    client.write(`DATA${CRLF}`);
                    stage++;
                    console.log("data command", stage)
                    break;
                case 4:
                    client.write(`${data}${CRLF}.${CRLF}`);
                    stage++;
                    console.log("data write", stage)
                    break;
                case 5:
                    client.write(`QUIT${CRLF}`);
                    stage++;
                    console.log("quitted", stage)
                    break;
                default:
                    client.end();
                    console.log("ended", stage)
                    break;
            }
        });

        client.on('end', () => {
            console.log('Connection closed');
        });

        client.on('error', (err) => {
            console.error('Error:', err);
        });
    }
}

const smtpClient = new AwtsmoosEmailClient('awtsmoos.one');
console.log("Testing server")
smtpClient.sendMail(
    'me@awtsmoos.one',
    'cobykaufer@gmail.com',
    'Subject: Test email\r\n\r\nB"H '
);
module.exports = AwtsmoosEmailClient;