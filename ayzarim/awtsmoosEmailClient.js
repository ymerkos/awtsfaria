/**
 * B"H
 * @module AwtsmoosEmailClient
 * a client for SENDING emails
 * @requires crypto
 */

const crypto = require("crypto");
const net = require('net');
const CRLF = '\r\n';

class AwtsmoosEmailClient {
    constructor(smtpServer, port = 25, username = null, password = null, privateKey = null) {
        this.smtpServer = smtpServer;
        this.port = port;
        this.username = username;
        this.password = password;
        this.privateKey = privateKey ? privateKey.replace(/\\n/g, '\n') : null;
    }

    canonicalizeRelaxed(headers, body) {
        const canonicalizedHeaders = headers.split(CRLF)
            .map(line => line.toLowerCase().split(/\s*:\s*/).join(':').trim())
            .join(CRLF);

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

        const formattedSignature = signature.match(/.{1,72}/g).join(CRLF);
        return `${dkimHeader}b=${formattedSignature}`;
    }

    async sendMail(sender, recipient, subject, body) {
        const client = net.createConnection(this.port, this.smtpServer, () => {
            console.log('Connected to SMTP server');
        });

        client.setEncoding('utf-8');
        let receivingDataAck = false;
        let buffer = '';

        const emailData = `From: ${sender}${CRLF}To: ${recipient}${CRLF}Subject: ${subject}${CRLF}${CRLF}${body}`;

        return new Promise((resolve, reject) => {
            client.on('data', (data) => {
                buffer += data;
                let index;
                while ((index = buffer.indexOf(CRLF)) !== -1) {
                    const line = buffer.substring(0, index).trim();
                    buffer = buffer.substring(index + CRLF.length);

                    console.log('Server:', line);

                    if (line.startsWith('4') || line.startsWith('5')) {
                        console.error('Error from server:', line);
                        client.end();
                        reject(line);
                        return;
                    }

                    if (line.startsWith('220 ')) {
                        client.write(`EHLO ${this.smtpServer}${CRLF}`);
                    } else if (line.startsWith('250-')) {
                        // Server still sending additional information, do nothing
                    } else if (line.startsWith('250 ')) {
                        if (receivingDataAck) {
                            client.write(`QUIT${CRLF}`);
                            resolve();
                        } else {
                            client.write(`MAIL FROM:<${sender}>${CRLF}`);
                        }
                    } else if (line.startsWith('250 2.1.0')) {
                        client.write(`RCPT TO:<${recipient}>${CRLF}`);
                    } else if (line.startsWith('250 2.1.5')) {
                        client.write(`DATA${CRLF}`);
                    } else if (line.startsWith('354')) {
                        if (this.privateKey) {
                            const domain = sender.split('@')[1];
                            const selector = 'default'; // Update with your selector
                            const dkimSignature = this.signEmail(domain, selector, this.privateKey, emailData);
                            client.write(`DKIM-Signature: ${dkimSignature}${CRLF}${emailData}${CRLF}.${CRLF}`);
                        } else {
                            client.write(`${emailData}${CRLF}.${CRLF}`);
                        }
                        receivingDataAck = true;
                    } else {
                        console.log('Unknown response, closing connection:', line);
                        client.end();
                        reject(line);
                    }
                }
            });

            client.on('end', () => {
                console.log('Connection closed');
            });

            client.on('error', (err) => {
                console.error('Error:', err);
                reject(err);
            });
        });
    }
}

const username = process.env.username;
const password = process.env.password;
const privateKey = process.env.BH_key;

const smtpClient = new AwtsmoosEmailClient('awtsmoos.one', 25, username, password, privateKey);

smtpClient.sendMail(
    'me@awtsmoos.one', 'awtsmoos@gmail.com', 'Test email', 'This is a test email.')
    .then(() => console.log('Email sent successfully'))
    .catch(err => console.error('Failed to send email:', err));

module.exports = AwtsmoosEmailClient;