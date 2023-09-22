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
    const tls = require('tls');
    const CRLF = '\r\n';
    
    class AwtsmoosEmailClient {
        constructor(smtpServer, port = 587, username, password) {
            this.smtpServer = smtpServer;
            this.port = port;
            this.username = Buffer.from(username).toString('base64');
            this.password = Buffer.from(password).toString('base64');
        }
    
        sendMail(sender, recipient, data) {
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
                        client.write(`EHLO localhost${CRLF}`);
                        stage++;
                        break;
                    case 1:
                        if (data.includes('STARTTLS')) {
                            client.write(`STARTTLS${CRLF}`);
                            stage++;
                        } else {
                            console.error('Server does not support STARTTLS');
                            client.end();
                        }
                        break;
                    case 2:
                        const secureClient = tls.connect({
                            socket: client,
                            rejectUnauthorized: false
                        }, () => {
                            secureClient.write(`AUTH LOGIN${CRLF}`);
                            stage++;
                        });
    
                        secureClient.setEncoding('utf-8');
    
                        secureClient.on('data', (secureData) => {
                            console.log('Secure Server:', secureData);
    
                            switch (stage) {
                                case 3:
                                    secureClient.write(`${this.username}${CRLF}`);
                                    stage++;
                                    break;
                                case 4:
                                    secureClient.write(`${this.password}${CRLF}`);
                                    stage++;
                                    break;
                                case 5:
                                    secureClient.write(`MAIL FROM:<${sender}>${CRLF}`);
                                    stage++;
                                    break;
                                case 6:
                                    secureClient.write(`RCPT TO:<${recipient}>${CRLF}`);
                                    stage++;
                                    break;
                                case 7:
                                    secureClient.write(`DATA${CRLF}`);
                                    stage++;
                                    break;
                                case 8:
                                    secureClient.write(`${data}${CRLF}.${CRLF}`);
                                    stage++;
                                    break;
                                case 9:
                                    secureClient.write(`QUIT${CRLF}`);
                                    stage++;
                                    break;
                                default:
                                    secureClient.end();
                                    break;
                            }
                        });
    
                        secureClient.on('end', () => {
                            console.log('Secure Connection closed');
                        });
    
                        secureClient.on('error', (err) => {
                            console.error('Secure Error:', err);
                        });
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
        'smtp.gmail.com', 587, username, password
    );
    smtpClient.sendMail(
        'me@awtsmoos.one', 
        'cobykaufer@gmail.com', 
        'Subject: Test email\r\n\r\nThis is a test email.'
    );
    
module.exports = AwtsmoosEmailClient;