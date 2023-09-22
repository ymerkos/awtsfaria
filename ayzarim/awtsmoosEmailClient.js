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
        // Normalize the private key
        this.privateKey = privateKey ? privateKey.replace(/\\n/g, '\n') : null;
    }

    canonicalizeRelaxed(headers, body) {
        // Canonicalize headers and body in relaxed mode
        const canonicalizedHeaders = headers.split(CRLF)
            .map(line => line.toLowerCase().split(/\s*:\s*/).join(':').trim())
            .join(CRLF);
        
        const canonicalizedBody = body.split(CRLF)
            .map(line => line.split(/\s+/).join(' ').trimEnd())
            .join(CRLF).trimEnd();
        
        return { canonicalizedHeaders, canonicalizedBody };
    }

    signEmail(domain, selector, privateKey, emailData) {
        // Extract headers and body
        const [headers, ...bodyParts] = emailData.split(CRLF + CRLF);
        const body = bodyParts.join(CRLF + CRLF);

        // Canonicalize and create body hash
        const { canonicalizedHeaders, canonicalizedBody } = this.canonicalizeRelaxed(headers, body);
        const bodyHash = crypto.createHash('sha256').update(canonicalizedBody).digest('base64');

        // Construct DKIM header and sign it
        const dkimHeader = `v=1;a=rsa-sha256;c=relaxed/relaxed;d=${domain};s=${selector};bh=${bodyHash};h=from:to:subject:date;`;
        const signature = crypto.createSign('SHA256').update(dkimHeader + canonicalizedHeaders).sign(privateKey, 'base64');
        const formattedSignature = signature.match(/.{1,72}/g).join(CRLF);
        
        return `${dkimHeader}b=${formattedSignature}`;
    }

    handleSMTPResponse(line, client, recipient, emailData) {
        // Handle different SMTP response codes and act accordingly
        if (line.startsWith('4') || line.startsWith('5')) {
            client.end();
            throw new Error(line);
        } else if (line.startsWith('220 ')) {
            client.write(`EHLO ${this.smtpServer}${CRLF}`);
        } else if (line.startsWith('250 2.1.0')) {
            client.write(`RCPT TO:<${recipient}>${CRLF}`);
        } else if (line.startsWith('250 2.1.5')) {
            client.write(`DATA${CRLF}`);
        } else if (line.startsWith('354')) {
            const domain = this.username.split('@')[1];
            const selector = 'default';
            const dkimSignature = this.signEmail(domain, selector, this.privateKey, emailData);
            client.write(`DKIM-Signature: ${dkimSignature}${CRLF}${emailData}${CRLF}.${CRLF}`);
        } else if (line.startsWith('250 ')) {
            client.write(`QUIT${CRLF}`);
        } else {
            client.end();
            throw new Error(`Unknown response: ${line}`);
        }
    }

    async sendMail(sender, recipient, subject, body) {
        const client = net.createConnection(this.port, this.smtpServer);
        client.setEncoding('utf-8');
        let buffer = '';
        
        const emailData = `From: ${sender}${CRLF}To: ${recipient}${CRLF}Subject: ${subject}${CRLF}${CRLF}${body}`;

        return new Promise((resolve, reject) => {
            client.on('data', (data) => {
                buffer += data;
                let index;
                while ((index = buffer.indexOf(CRLF)) !== -1) {
                    const line = buffer.substring(0, index).trim();
                    buffer = buffer.substring(index + CRLF.length);

                    try {
                        this.handleSMTPResponse(line, client, recipient, emailData);
                    } catch (err) {
                        reject(err);
                    }
                }
            });

            client.on('end', resolve);
            client.on('error', reject);
        });
    }
}

// Extract credentials from environment variables
const username = process.env.username;
const password = process.env.password;
const privateKey = process.env.BH_key;

// Create SMTP client instance and send email
const smtpClient = new AwtsmoosEmailClient('awtsmoos.one', 25, username, password, privateKey);
smtpClient.sendMail('me@awtsmoos.one', 'awtsmoos@gmail.com', 'Test email', 'This is a test email.')
    .then(() => console.log('Email sent successfully'))
    .catch(err => console.error('Failed to send email:', err));

module.exports = AwtsmoosEmailClient;
