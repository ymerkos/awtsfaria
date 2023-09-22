/**
 * B"H
 * @module AwtsmoosEmailClient
 * A client for sending emails.
 * @requires crypto
 * @requires net
 * @requires tls
 */

const crypto = require('crypto');
const net = require('net');

const CRLF = '\r\n';

class AwtsmoosEmailClient {
    constructor(smtpServer, port = 25, privateKey = null) {
        this.smtpServer = smtpServer;
        this.port = port;
        this.privateKey = privateKey ? privateKey.replace(/\\n/g, '\n') : null;
        this.multiLineResponse = '';
        this.previousCommand = '';
    }

    /**
     * Canonicalizes headers and body in relaxed mode.
     * @param {string} headers - The headers of the email.
     * @param {string} body - The body of the email.
     * @returns {Object} - The canonicalized headers and body.
     */
    canonicalizeRelaxed(headers, body) {
        const canonicalizedHeaders = headers.split(CRLF)
            .map(line => line.toLowerCase().split(/\s*:\s*/).join(':').trim())
            .join(CRLF);

        const canonicalizedBody = body.split(CRLF)
            .map(line => line.split(/\s+/).join(' ').trimEnd())
            .join(CRLF).trimEnd();

        return { canonicalizedHeaders, canonicalizedBody };
    }

    /**
     * Signs the email using DKIM.
     * @param {string} domain - The sender's domain.
     * @param {string} selector - The selector.
     * @param {string} privateKey - The private key.
     * @param {string} emailData - The email data.
     * @returns {string} - The DKIM signature.
     */
    signEmail(domain, selector, privateKey, emailData) {
        const [headers, ...bodyParts] = emailData.split(CRLF + CRLF);
        const body = bodyParts.join(CRLF + CRLF);

        const { canonicalizedHeaders, canonicalizedBody } = this.canonicalizeRelaxed(headers, body);
        const bodyHash = crypto.createHash('sha256').update(canonicalizedBody).digest('base64');

        const dkimHeader = `v=1;a=rsa-sha256;c=relaxed/relaxed;d=${domain};s=${selector};bh=${bodyHash};h=from:to:subject:date;`;
        const signature = crypto.createSign('SHA256').update(dkimHeader + canonicalizedHeaders).sign(privateKey, 'base64');

        return `${dkimHeader}b=${signature}`;
    }

    /**
     * Determines the next command to send to the server.
     * @returns {string} - The next command.
     */
    getNextCommand() {
        const commandOrder = ['EHLO', 'MAIL FROM', 'RCPT TO', 'DATA', 'END OF DATA'];
        const currentIndex = commandOrder.indexOf(this.previousCommand);

        if (currentIndex === -1) {
            throw new Error(`Unknown previous command: ${this.previousCommand}`);
        }

        if (currentIndex + 1 >= commandOrder.length) {
            throw new Error('No more commands to send.');
        }

        return commandOrder[currentIndex + 1];
    }

    /**
     * Handles the SMTP response from the server.
     * @param {string} line - The response line from the server.
     * @param {net.Socket} client - The socket connected to the server.
     * @param {string} sender - The sender email address.
     * @param {string} recipient - The recipient email address.
     * @param {string} emailData - The email data.
     */
    handleSMTPResponse(line, client, sender, recipient, emailData) {
        console.log('Server Response:', line);

        this.handleErrorCode(line);

        if (line.endsWith('-')) {
            console.log('Multi-line Response:', line);
            return;
        }

        this.previousCommand = this.currentCommand;
        
        // Check if this.currentCommand is END OF DATA
        if (this.currentCommand === 'END OF DATA') {
            client.end(); // End the client connection after receiving a successful response for END OF DATA
            return;
        }
        
        const nextCommand = this.getNextCommand();
        
        const commandHandlers = {
            'EHLO': () => client.write(`MAIL FROM:<${sender}>${CRLF}`),
            'MAIL FROM': () => client.write(`RCPT TO:<${recipient}>${CRLF}`),
            'RCPT TO': () => client.write(`DATA${CRLF}`),
            'DATA': () => client.write(`${emailData}${CRLF}.${CRLF}`),
            'END OF DATA': () => client.end(),
        };

        const handler = commandHandlers[nextCommand];

        if (!handler) {
            throw new Error(`Unknown next command: ${nextCommand}`);
        }

        handler();
        this.currentCommand = nextCommand;
    }

    /**
     * Handles error codes in the server response.
     * @param {string} line - The response line from the server.
     */
    handleErrorCode(line) {
        if (line.startsWith('4') || line.startsWith('5')) {
            throw new Error(line);
        }
    }

    /**
     * Sends an email.
     * @param {string} sender - The sender email address.
     * @param {string} recipient - The recipient email address.
     * @param {string} subject - The subject of the email.
     * @param {string} body - The body of the email.
     * @returns {Promise} - A promise that resolves when the email is sent.
     */
    async sendMail(sender, recipient, subject, body) {
        return new Promise((resolve, reject) => {
            const client = net.createConnection(this.port, this.smtpServer);
            client.setEncoding('utf-8');
            let buffer = '';

            const emailData = `From: ${sender}${CRLF}To: ${recipient}${CRLF}Subject: ${subject}${CRLF}${CRLF}${body}`;
            const domain = 'awtsmoos.com';
            const selector = 'selector';
            const dkimSignature = this.signEmail(domain, selector, this.privateKey, emailData);
            const signedEmailData = `DKIM-Signature: ${dkimSignature}${CRLF}${emailData}`;

            client.on('connect', () => {
                this.currentCommand = 'EHLO';
                client.write(`EHLO ${this.smtpServer}${CRLF}`);
            });

            client.on('data', (data) => {
                buffer += data;
                let index;
                while ((index = buffer.indexOf(CRLF)) !== -1) {
                    const line = buffer.substring(0, index).trim();
                    buffer = buffer.substring(index + CRLF.length);

                    if (line.endsWith('-')) {
                        this.multiLineResponse += line + CRLF;
                        continue;
                    }

                    const fullLine = this.multiLineResponse + line;
                    this.multiLineResponse = '';

                    try {
                        this.handleSMTPResponse(fullLine, client, sender, recipient, signedEmailData);
                    } catch (err) {
                        client.end();
                        reject(err);
                        return;
                    }
                }
            });

            client.on('end', resolve);
            client.on('error', reject);
            client.on('close', () => {
                if (this.previousCommand !== 'END OF DATA') {
                    reject(new Error('Connection closed prematurely'));
                } else {
                    resolve();
                }
            });
        });
    }
}

const privateKey = process.env.BH_key;
const smtpClient = new AwtsmoosEmailClient('awtsmoos.one', 25, privateKey);

async function main() {
    try {
        await smtpClient.sendMail('me@awtsmoos.com', 'awtsmoos@gmail.com', 'B"H', 'This is a test email.');
        console.log('Email sent successfully');
    } catch (err) {
        console.error('Failed to send email:', err);
    }
}

main();

module.exports = AwtsmoosEmailClient;
