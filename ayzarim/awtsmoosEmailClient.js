/**
 * B"H
 * @module AwtsmoosEmailClient
 * a client for SENDING emails
 * @requires crypto
 */

const crypto = require('crypto');
const net = require('net');
const tls = require('tls');

const CRLF = '\r\n';

class AwtsmoosEmailClient {
    constructor(smtpServer, port = 25, privateKey = null) {
        this.smtpServer = smtpServer;
        this.port = port;

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

        return `${dkimHeader}b=${signature}`;
    }

    handleSMTPResponse(line, client, sender, recipient, emailData) {
        if (line.startsWith('4') || line.startsWith('5')) {
            client.end();
            throw new Error(line);
        } else if (line.startsWith('220 ')) {
            client.write(`EHLO ${this.smtpServer}${CRLF}`);
        } else if (line.startsWith('250 ')) {
            client.write(`MAIL FROM:<${sender}>${CRLF}`);
        } else if (line.startsWith('235 ') || line.startsWith('250 2.1.0')) {
            client.write(`RCPT TO:<${recipient}>${CRLF}`);
        } else if (line.startsWith('250 2.1.5')) {
            client.write(`DATA${CRLF}`);
        } else if (line.startsWith('354')) {
            const domain = sender.split('@')[1];
            const selector = 'default';
            const dkimSignature = this.signEmail(domain, selector, this.privateKey, emailData);
            client.write(`DKIM-Signature: ${dkimSignature}${CRLF}${emailData}${CRLF}.${CRLF}`);
        } else if (line.startsWith('250 2.0.0')) {
            client.write(`QUIT${CRLF}`);
        } else {
            client.end();
            throw new Error(`Unknown response: ${line}`);
        }
    }

    async sendMail(sender, recipient, subject, body) {
        return new Promise((resolve, reject) => {
            const client = net.createConnection(this.port, this.smtpServer);
            client.setEncoding('utf-8');
            let buffer = '';

            const emailData = `From: ${sender}${CRLF}To: ${recipient}${CRLF}Subject: ${subject}${CRLF}${CRLF}${body}`;

            client.on('connect', () => {
                client.write(`EHLO ${this.smtpServer}${CRLF}`);
            });

            client.on('data', (data) => {
                buffer += data;
                let index;
                while ((index = buffer.indexOf(CRLF)) !== -1) {
                    const line = buffer.substring(0, index).trim();
                    buffer = buffer.substring(index + CRLF.length);

                    try {
                        if (!line.endsWith('-')) {
                            this.handleSMTPResponse(line, client, sender, recipient, emailData);
                        }
                    } catch (err) {
                        reject(err);
                        return;
                    }
                }
            });

            client.on('end', resolve);
            client.on('error', reject);
        });
    }
}


const privateKey = process.env.BH_key;

const smtpClient = new AwtsmoosEmailClient('smtp.yourserver.com', 25, privateKey);

async function main() {
    try {
        await smtpClient.sendMail(
            'me@awtsmoos.com', 'awtsmoos@gmail.com', 
            'B"H', 'This is a test email.'
        );
        console.log('Email sent successfully');
    } catch (err) {
        console.error('Failed to send email:', err);
    }
}

main();

module.exports = AwtsmoosEmailClient;