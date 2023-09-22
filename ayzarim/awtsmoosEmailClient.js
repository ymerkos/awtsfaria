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

    @requires crypto
 */
    const crypto = require("crypto");
    const net = require('net');
    const CRLF = '\r\n';
    
    class AwtsmoosEmailClient {
        constructor(smtpServer, port = 25, key) { // Default port for unencrypted SMTP is 25
            this.smtpServer = smtpServer;
            this.port = port;
            this.key = key;
        }

        canonicalizeRelaxed(headers, body) {
            // Canonicalizing headers
            const canonicalizedHeaders = headers.split(CRLF)
                .map(line => line.toLowerCase().split(/\s*:\s*/).join(':').trim())
                .join(CRLF);
    
            // Canonicalizing body
            const canonicalizedBody = body.split(CRLF)
                .map(line => line.split(/\s+/).join(' ').trimEnd())
                .join(CRLF).trimEnd();
    
            return { canonicalizedHeaders, canonicalizedBody };
        }
    
        signEmail(domain, selector, privateKey, emailData) {
            const [headers, ...bodyParts] = emailData.split(CRLF + CRLF);
            const body = bodyParts.join(CRLF + CRLF);
    
            const { canonicalizedHeaders, canonicalizedBody } = this.canonicalizeRelaxed(headers, body);
            const bodyHash = crypto.createHash('sha256').update(canonicalizedBody).digest('base64');
    
            const dkimHeader = `v=1;a=rsa-sha256;c=relaxed/relaxed;d=${domain};s=${selector};bh=${bodyHash};h=from:to:subject:date;`;
            const signature = crypto.createSign('SHA256').update(dkimHeader + canonicalizedHeaders).sign(privateKey, 'base64');
    
            // Breaking the base64 string into lines no longer than 72 characters
            const formattedSignature = signature.match(/.{1,72}/g).join(CRLF);
            return `${dkimHeader}b=${formattedSignature}`;
        }
    
        sendMail(sender, recipient, emailData) {
            const domain = 'awtsmoos.one';
            const selector = 'default';
    
            const dkimSignature = this.signEmail(domain, selector, this.key, emailData);
            const signedEmailData = `DKIM-Signature: ${dkimSignature}${CRLF}${emailData}`;
    
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
                        client.write(`${signedEmailData}${CRLF}.${CRLF}`);
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
    const privateKey = process.env.BH_key;
    
    var formattedKey = null;
    if(privateKey) {
        formattedKey = privateKey.replace(/\\n/g, '\n');
        console.log("private key loaded")
    } else {
        console.log("No private key")
    }
    const smtpClient = new AwtsmoosEmailClient(
        'awtsmoos.one', 
        25, 
        formattedKey
    );
    smtpClient.sendMail(
        'me@awtsmoos.one', 
        'you@awtsmoos.one', 
        `From: me@awtsmoos.one${
            CRLF
        }To: you@awtsmoos.one${
            CRLF
        }Date: ${
            new Date().toUTCString()
        }${
            CRLF
        }Subject: Test email${
            CRLF
        }${
            CRLF
        }This is a test email.`
    );

    smtpClient.sendMail(
        'me@awtsmoos.one', 
        'cobykaufer@gmail.com', 
        `From: me@awtsmoos.one${
            CRLF
        }To: cobykaufer@gmail.com${
            CRLF
        }Date: ${
            new Date().toUTCString()
        }${
            CRLF
        }Subject: Test email${
            CRLF
        }${
            CRLF
        }This is a test email.`
    );
    
module.exports = AwtsmoosEmailClient;