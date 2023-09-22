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
        this.multiLineResponse = '';
        this.previousCommand = '';
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

    getNextCommand() {
        const commandOrder = ['EHLO', 'MAIL FROM', 'RCPT TO', 'DATA', 'END OF DATA'];
        const currentIndex = commandOrder.indexOf(this.previousCommand);
        return commandOrder[currentIndex + 1];
    }

    handleErrorCode(line) {
        if (line.startsWith('4') || line.startsWith('5')) {
            throw new Error(line);
        }
    }

    handleSMTPResponse(line, client, sender, recipient, emailData) {
        this.handleErrorCode(line);
    
        const commandHandlers = {
            'EHLO': () => client.write(`MAIL FROM:<${sender}>${CRLF}`),
            'MAIL FROM': () => client.write(`RCPT TO:<${recipient}>${CRLF}`),
            'RCPT TO': () => client.write(`DATA${CRLF}`),
            'DATA': () => {
                client.write(`${emailData}${CRLF}.${CRLF}`);
                this.previousCommand = 'END OF DATA';
            },
            'END OF DATA': () => {}
        };
    
        if (['220', '250'].some(code => line.startsWith(code))) {
            const nextCommand = this.getNextCommand();
            const handler = commandHandlers[nextCommand];
    
            if (!handler) {
                throw new Error(`Unknown command state: ${nextCommand}`);
            }
    
            handler();
            this.previousCommand = nextCommand;
        } else if (line.startsWith('354')) {
            client.write(`${emailData}${CRLF}.${CRLF}`);
            this.previousCommand = 'END OF DATA';
        } else {
            throw new Error(`Unknown response: ${line}`);
        }
    }

    async sendMail(sender, recipient, subject, body) {
        return new Promise((resolve, reject) => {
            const client = net.createConnection(this.port, this.smtpServer);
            client.setEncoding('utf-8');
            let buffer = '';
            
            const emailData = `From: ${sender}${CRLF}To: ${recipient}${CRLF}Subject: ${subject}${CRLF}${CRLF}${body}`;

            // Sign the email with DKIM
            const domain = 'awtsmoos.com'; // replace with your domain
            const selector = 'selector'; // replace with your selector
            const dkimSignature = this.signEmail(domain, selector, this.privateKey, emailData);
            
            // Append DKIM Signature to the email headers
            const signedEmailData = `DKIM-Signature: ${dkimSignature}${CRLF}${emailData}`;
            
            client.on('connect', () => {
                this.previousCommand = 'EHLO';
                client.write(`EHLO ${this.smtpServer}${CRLF}`);
            });

            client.on('data', (data) => {
                buffer += data;
                let index;
                while ((index = buffer.indexOf(CRLF)) !== -1) {
                    const line = buffer.substring(0, index).trim();
                    buffer = buffer.substring(index + CRLF.length);
            
                    if (line.endsWith('-')) {
                        // If the line ends with '-', it's a multiline response.
                        // Append it to the multiLineResponse buffer and continue.
                        this.multiLineResponse += line + CRLF;
                        continue;
                    }
            
                    // If multiLineResponse is not empty, prepend it to the current line.
                    const fullLine = this.multiLineResponse + line;
                    this.multiLineResponse = '';
            
                    try {
                        this.handleSMTPResponse(fullLine, client, sender, recipient, signedEmailData);
                    } catch (err) {
                        client.end(); // Ensure the connection is terminated
                        reject(err);
                        return;
                    }
                }
            });

            client.on('end', resolve);
            client.on('error', reject);
            client.on('close', resolve); 
        });
    }
}

const privateKey = process.env.BH_key;
const smtpClient = new AwtsmoosEmailClient('awtsmoos.one', 25, privateKey);

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
