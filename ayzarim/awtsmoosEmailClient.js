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
        constructor(smtpServer, port = 25) { // Default port for unencrypted SMTP is 25
            this.smtpServer = smtpServer;
            this.port = port;
        }
    
        sendMail(sender, recipient, emailData) {
            const client = net.createConnection(this.port, this.smtpServer, () => {
                console.log('Connected to SMTP server');
            });
    
            client.setEncoding('utf-8');
            let stage = 0;
    
            client.on('data', (data) => {
                console.log('Server: ' + data);
    
                if (data.startsWith('4') || data.startsWith('5')) {
                    console.error('Error from server:', data);
                    client.end();
                    return;
                }
    
                switch (stage) {
                    case 0:
                        client.write(`EHLO awtsmoos.one${CRLF}`);
                        stage++;
                        
                        console.log("ehlo sending", stage)
                        break;
                    case 1:
                        client.write(`MAIL FROM:<${sender}>${CRLF}`);
                        stage++;
                        
                        console.log("mf sending", stage)
                        break;
                    case 2:
                        client.write(`RCPT TO:<${recipient}>${CRLF}`);
                        stage++;
                        console.log("Data sending", stage)
                        break;
                    case 3:
                        client.write(`DATA${CRLF}`);
                        stage++;
                        
                        console.log("Data sending", stage)
                        break;
                    case 4:
                        client.write(`${emailData}${CRLF}.${CRLF}`);
                        stage++;
                        break;
                    case 5:
                        client.write(`QUIT${CRLF}`);
                        stage++;
                        
                        console.log("quit", stage)
                        break;
                    default:
                        client.end();
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
    
    const username = process.env.username;
    const password = process.env.password;

    console.log("username", username)
    const smtpClient = new AwtsmoosEmailClient(
        'awtsmoos.one', 
        25, 
        username, 
        password
    );
    smtpClient.sendMail(
        'me@awtsmoos.one', 
        'cobykaufer@gmail.com', 
        'Subject: Test email\r\n\r\nThis is a test email.'
    );
    
module.exports = AwtsmoosEmailClient;