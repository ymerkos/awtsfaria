/**
 * B"H
 * @module AwtsmoosEmailClient
 * A client for sending emails.
 * @requires crypto
 * @requires net
 * @requires tls
 * @optional privateKey environment variable for your DKIM private key
 * matching your public key, can gnerate with generateKeyPairs.js script
 * @optional BH_email_cert and BH_email_key environemnt variables for certbot
 *  TLS cert and key
 * @overview:
 * 
 * 
 * @method handleSMTPResponse: This method handles the 
 * SMTP server responses for each command sent. It builds the multi-line response, checks
 *  for errors, and determines the next command to be sent based on the server’s response.

@method handleErrorCode: This helper method throws an
 error if the server responds with a 4xx or 5xx status code.

@method commandHandlers: An object map where keys are SMTP 
commands and values are functions that handle sending the next SMTP command.

@method sendMail: This asynchronous method initiates the process 
of sending an email. It establishes a connection to the SMTP server, sends the SMTP 
commands sequentially based on server responses, and handles the 
closure and errors of the connection.

@method emailData: The email content formatted with headers such as From, To, and Subject.

@method dkimSignature: If a private key is provided, it computes the
 DKIM signature and appends it to the email data.

@event client.on('connect'): Initiates the SMTP conversation by sending the EHLO command upon connection.

@event client.on('data'): Listens for data from the server,
 parses the responses, and calls handleSMTPResponse to handle them.

@event client.on('end'), client.on('error'), client.on('close'): These
 handlers resolve or reject the promise based on the connection status
  and the success of the email sending process.

Variables and Constants:

@const CRLF: Stands for Carriage Return Line Feed, which is not shown
 in the code but presumably represents the newline sequence "\r\n".
this.smtpServer, this.port, this.privateKey: Instance variables that
 store the SMTP server address, port, and private key for DKIM signing, respectively.
this.multiLineResponse, this.previousCommand, this.currentCommand: 
Instance variables used to store the state of the SMTP conversation.
 */

const crypto = require('crypto');
const tls = require("tls");
const fs = require("fs");
const net = require('net');
const dns = require('dns');
const CRLF = '\r\n';


class AwtsmoosEmailClient {
    socket = null;
    useTLS = false;
    cert = null;
    key = null
    constructor({
        port = 25
    } = {}) {
        
        const privateKey = process.env.BH_key;
        if(privateKey) {
            this.privateKey = 
            privateKey.replace(/\\n/g, '\n');
        }

        this.port = port || 25;
        this.multiLineResponse = '';
        this.previousCommand = '';


        const certPath = process.env.BH_email_cert;
        const keyPath = process.env.BH_email_key;

        console.log("certPath at",certPath,"keyPath at", keyPath)
        if (certPath && keyPath) {
            try {
                this.cert = fs.readFileSync(certPath, 'utf-8');
                this.key = fs.readFileSync(keyPath, 'utf-8');
                // if both are successfully loaded, set useTLS to true
                this.useTLS = true;
                console.log("Loaded cert and key")
            } catch (err) {
                console.error("Error reading cert or key files: ", err);
                // handle error, perhaps set useTLS to false or throw an error
            }
        }
    }

    /**
     * @method getDNSRecords
     * @param {String (Email format)} email 
     * @returns 
     */
    async getDNSRecords(email) {
        return new Promise((r,j) => {
            if(typeof(email) != "string") {
                j("Email paramter not a string");
                return;
            }
            const domain = email.split('@')[1];
            if(!domain) return j("Not an email");
            // Perform MX Record Lookup
            dns.resolveMx(domain, (err, addresses) => {
                if (err) {
                    console.error('Error resolving MX records:', err);
                    j(err);
                    return;
                }
                
                // Sort the MX records by priority
                addresses.sort((a, b) => a.priority - b.priority);
                r(addresses);
                return addresses
            });
        })
        
    }
    /**
     * Determines the next command to send to the server.
     * @returns {string} - The next command.
     */
    getNextCommand() {
        const commandOrder = [
            'START',
            'EHLO', 
            'STARTTLS', // Add STARTTLS to the command order
            'EHLO',
            'MAIL FROM', 
            'RCPT TO', 
            'DATA', 
            'END OF DATA'
        ];
        const currentIndex = commandOrder.indexOf(this.previousCommand);
    
        if (currentIndex === -1) {
            return commandOrder[0]; 
        }
    
        if (currentIndex + 1 >= commandOrder.length) {
            throw new Error('No more commands to send.');
        }
    
        // If the previous command was STARTTLS, return EHLO to be resent over the secure connection
        if (this.previousCommand === 'STARTTLS') {
            return 'EHLO';
        }
    
        return commandOrder[currentIndex + 1];
    }
    
    
    /**
     * Handles the SMTP response from the server.
     * @param {string} lineOrMultiline - The response line from the server.
     * @param {net.Socket} client - The socket connected to the server.
     * @param {string} sender - The sender email address.
     * @param {string} recipient - The recipient email address.
     * @param {string} emailData - The email data.
     */
    
    handleSMTPResponse({
        lineOrMultiline, 
        client, 
        sender, 
        recipient, 
        emailData
    } = {}) {
        console.log('Server Response:', lineOrMultiline);

        this.handleErrorCode(lineOrMultiline);
    
        var isMultiline = lineOrMultiline.charAt(3) === '-';
        var lastLine = lineOrMultiline;
        var lines;
        if(isMultiline) {
            lines =  lineOrMultiline.split(CRLF)
            lastLine = lines[lines.length - 1]
        }

        console.log("Got full response: ",  lines)
        this.multiLineResponse = ''; // Reset accumulated multiline response.

        


        try {
            const nextCommand = this.getNextCommand();
            
            const commandHandlers = {
                'START': () => {
                    this.currentCommand = 'EHLO';
                    var command = `EHLO ${this.smtpServer}${CRLF}`;
                    console.log("Sending to server: ", command)
                    client.write(command);
                },
                'EHLO': () => {
                    if (lineOrMultiline.includes('STARTTLS')) {
                        var cmd = `STARTTLS${CRLF}`;
                        console.log("Sending command: ", cmd);
                        client.write(cmd);
                    } else {
                        var cmd = `MAIL FROM:<${sender}>${CRLF}`;
                        console.log("Sending command: ", cmd);
                        client.write(cmd);
                    }
                },
                'STARTTLS': () => {
                    console.log("Trying to start TLS")
                    const options = {
                        socket: client, 
                       // key:this.key,
                      //  cert:this.cert,
                      servername: 'gmail-smtp-in.l.google.com',
                        minVersion: 'TLSv1.2',
                        ciphers: 'HIGH:!aNULL:!MD5',
                        maxVersion: 'TLSv1.3', // Set max version explicitly 
                        // specify the minimum version of the TLS protocol
                        // existing socket
                        // other necessary TLS options
                    };
                    
                    const secureSocket = tls.connect(options, () => {
                        console.log('TLS handshake completed.');
                        // Replace the original socket with the secureSocket
                        this.socket = secureSocket;
                        // Continue with the next SMTP command
                        const nextCommand = this.getNextCommand();
                        const handler = commandHandlers[nextCommand];
                        if (handler) handler();
                    });
                
                    //'data' event
                    this.handleClientData({
                        client,
                        sender,
                        recipient,
                        dataToSend: emailData
                    });
                    
                    secureSocket.on('error', (err) => {
                        console.error('TLS Error:', err);
                        
                        console.error('Stack Trace:', err.stack);
                        this.previousCommand = '';

                    });
                    
                    secureSocket.on("secureConnect", () => {
                        console.log("Secure connect!");
                    });

                    secureSocket.on("clientError", err => {
                        console.error("A client error", err)
                        ;
                        console.log("Stack",err.stack)
                    })
                    secureSocket.on('close', () => {
                        console.log('Connection closed');
                        
                        this.previousCommand = '';
                    });
                },
                'MAIL FROM': () => {
                    var rc = `RCPT TO:<${recipient}>${CRLF}`;
                    console.log("Sending RCPT:", rc)
                    client.write(rc)
                },
                'RCPT TO': () => {
                    var c = `DATA${CRLF}`;
                    console.log("Sending data info: ", c)
                    client.write(c)
                },
                'DATA': () => {
                    var data = `${emailData}${CRLF}.${CRLF}`;
                    console.log("Sending data to the server: ", data)
                    client.write(data);
                    this.previousCommand = 'END OF DATA'; 
                    // Set previousCommand to 'END OF DATA' 
                    //after sending the email content
                },
            };

            const handler = commandHandlers[nextCommand];
            
            if (!handler) {
                throw new Error(`Unknown next command: ${nextCommand}`);
            }

            handler();
            if (nextCommand !== 'DATA') this.previousCommand = nextCommand; // Update previousCommand here for commands other than 'DATA'
        } catch (e) {
            console.error(e.message);
            client.end();
        }
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
        return new Promise(async (resolve, reject) => {
            console.log("Getting DNS records..");
            var addresses = await this.getDNSRecords(recipient);
            console.log("Got addresses", addresses);
            var primary = addresses[0].exchange;
            

            console.log("Primary DNS of recepient: ", primary)
            this.smtpServer = primary;
            
           
           
            this.socket = net.createConnection(
                this.port, this.smtpServer
            );
            
            
            this.socket.setEncoding('utf-8');
            

            const emailData = `From: ${sender}${CRLF}To: ${recipient}${CRLF}Subject: ${subject}${CRLF}${CRLF}${body}`;
            const domain = 'awtsmoos.one';
            const selector = 'selector';
            var dataToSend=emailData
            if(this. privateKey) {
                const dkimSignature = this.signEmail(
                    domain, selector, this.privateKey, emailData
                );
                const signedEmailData = `DKIM-Signature: ${dkimSignature}${CRLF}${emailData}`;
                dataToSend=signedEmailData;
                console.log("Just DKIM signed the email. Data: ", signedEmailData)
            }

            this.socket.on('connect', () => {
                console.log(
                    "Connected, waiting for first server response (220)"
                )
            });


            try {
                this.handleClientData({
                    client: this.socket,
                    sender,
                    recipient,
                    dataToSend
                });
            } catch(e) {
                reject(e);
            }
            


            this.socket.on('end', () => {
                this.previousCommand = ''
                resolve()
            });

            this.socket.on('error', (e)=>{
                console.error("Client error: ",e)
                this.previousCommand = ''
                reject("Error: " + e)
            });

            this.socket.on('close', () => {
                if (this.previousCommand !== 'END OF DATA') {
                    reject(new Error('Connection closed prematurely'));
                } else {
                    this.previousCommand = ''
                    resolve();
                }
            });
        });
    }

    /**
     * 
     * @param {Object} 
     *  @method handleClientData
     * @description binds the data event
     * to the client socket, useful for switching
     * between net and tls sockets.
     * 
     * @param {NET or TLS socket} clientSocket 
     * @param {String <email>} sender 
     * @param {String <email>} recipient 
     * @param {String <email body>} dataToSend 
     * 
     *  
     */
    handleClientData({
        client,
        sender,
        recipient,
        dataToSend
    } = {}) {
        var firstData = false;

        let buffer = '';
        let multiLineBuffer = ''; // Buffer for accumulating multi-line response
        let isMultiLine = false; // Flag for tracking multi-line status
        let currentStatusCode = ''; // Store the current status code for multi-line responses

        client.on('data', (data) => {
            buffer += data;
            let index;

            while ((index = buffer.indexOf(CRLF)) !== -1) {
                const line = buffer.substring(0, index).trim();
                buffer = buffer.substring(index + CRLF.length);

                if (!firstData) {
                    firstData = true;
                    console.log("First time connected, should wait for 220");
                }

                const potentialStatusCode = line.substr(0, 3); // Extract the first three characters
                const fourthChar = line.charAt(3); // Get the 4th character

                // If the line's 4th character is a '-', it's a part of a multi-line response
                if (fourthChar === '-') {
                    isMultiLine = true;
                    currentStatusCode = potentialStatusCode;
                    multiLineBuffer += line.substr(4) + ' '; // Remove the status code and '-' and add to buffer
                    
                    continue; // Continue to the next iteration to keep collecting multi-line response
                }

                // If this line has the same status code as a previous line but no '-', then it is the end of a multi-line response
                if (isMultiLine && currentStatusCode === potentialStatusCode && fourthChar === ' ') {
                    const fullLine = multiLineBuffer + line.substr(4); // Remove the status code and space
                    multiLineBuffer = ''; // Reset the buffer
                    isMultiLine = false; // Reset the multi-line flag
                    currentStatusCode = ''; // Reset the status code

                    try {
                        console.log("Handling complete multi-line response:", fullLine);
                        this.handleSMTPResponse({
                            lineOrMultiline: fullLine, 
                            client, 
                            sender, 
                            recipient, 
                            emailData: dataToSend,
                            multiline:true
                        });
                    } catch (err) {
                        client.end();
                        
                        this.previousCommand = ''
                        throw new Error(err);
                    }
                } else if (!isMultiLine) {
                    // Single-line response
                    try {
                        console.log("Handling single-line response:", line);
                        this.handleSMTPResponse({
                            lineOrMultiline: line, 
                            client, 
                            sender, 
                            recipient, 
                            emailData: dataToSend
                        });
                    } catch (err) {
                        client.end();
                        this.previousCommand = ''
                        throw new Error(err);
                    }
                }
            }
        });
    }
    
    /**
     * Canonicalizes headers and body in relaxed mode.
     * @param {string} headers - The headers of the email.
     * @param {string} body - The body of the email.
     * @returns {Object} - The canonicalized headers and body.
     */
    canonicalizeRelaxed(headers, body) {
        const canonicalizedHeaders = headers.split(CRLF)
        .map(line => {
            const [key, ...value] = line.split(':');
            return key + ':' + value.join(':').trim();
        })
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
        try {
            const [headers, ...bodyParts] = emailData.split(CRLF + CRLF);
            const body = bodyParts.join(CRLF + CRLF);
        
            const { canonicalizedHeaders, canonicalizedBody } = 
            this.canonicalizeRelaxed(headers, body);
            const bodyHash = crypto.createHash('sha256')
            .update(canonicalizedBody).digest('base64');
        
            const headerFields = canonicalizedHeaders
            .split(CRLF).map(line => line.split(':')[0]).join(':');
            const dkimHeader = `v=1;a=rsa-sha256;c=relaxed/relaxed;d=${domain};s=${selector};bh=${bodyHash};h=${headerFields};`;
        
            const signature = crypto.createSign('SHA256').update(dkimHeader + CRLF + canonicalizedHeaders).sign(privateKey, 'base64');
        
            return `${dkimHeader}b=${signature}`;
        } catch(e) {
            console.error("There was an error", e);
            console.log("The private key is: ", this.privateKey, privateKey)
            return emailData;
        }
        
    }

}


/**
 * determine if we can use TLS by checking
 * if our cert and key exist.
 */





const smtpClient = new AwtsmoosEmailClient(
);

async function main() {
    try {
        await smtpClient.sendMail('me@awtsmoos.one', 
        'awtsmoos@gmail.com', 'B"H', 
        'This is a test email! The time is: ' + Date.now() 
        + " Which is " + 
        (new Date()));
        console.log('Email sent successfully');
    } catch (err) {
        console.error('Failed to send email:', err);
    }
}

main();

module.exports = AwtsmoosEmailClient;
