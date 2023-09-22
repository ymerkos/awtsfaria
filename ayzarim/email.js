
/**
 * B"H
 * @module AwtsMail
 */

const AwtsmoosClient = require("./awtsmoosEmailClient.js")
const net = require('net');
const CRLF = '\r\n';

module.exports = class AwtsMail {
    constructor() {
        console.log("Starting instance of email");
        this.server = net.createServer(socket => {
            console.log("Some connection happened!", Date.now());
            socket.write('220 awtsmoos.one ESMTP Postfix' + CRLF);
            
            let sender = '';
            let recipients = [];
            let data = '';
            let receivingData = false;
            
            socket.on('data', chunk => {
                const command = chunk.toString().trim();
                console.log("Received command:", command);
                
                if (receivingData) {
                    data += command + CRLF;
                    if (command === '.') {
                        receivingData = false;
                        console.log("Received email data:", data);
                        socket.write(`250 2.0.0 Ok: queued as 12345${CRLF}`);


                        // Simulate sending a reply back.
                        if (sender) {
                          console.log(`Sending a reply back to ${sender}`);
                          const replyData = `Subject: Reply from Awtsmoos ${
                            Math.floor(Math.random()*8)
                          }\r\n\r\nB"H\n\nHello from the Awtsmoos, the time is ${
                            Date.now()
                          }.`;
                          this
                          .smtpClient
                          .sendMail('reply@awtsmoos.one', sender, replyData);
                        }
                    }
                    return;
                }
                
                if (command.startsWith('EHLO') || command.startsWith('HELO')) {
                    socket.write(`250-Hello${CRLF}`);
                    socket.write(`250 SMTPUTF8${CRLF}`);
                } else if (command.startsWith('MAIL FROM')) {
                    sender = command.slice(10);
                    socket.write(`250 2.1.0 Ok${CRLF}`);
                } else if (command.startsWith('RCPT TO')) {
                    recipients.push(command.slice(8));
                    socket.write(`250 2.1.5 Ok${CRLF}`);
                } else if (command.startsWith('DATA')) {
                    receivingData = true;
                    socket.write(`354 End data with <CR><LF>.<CR><LF>${CRLF}`);
                } else if (command.startsWith('QUIT')) {
                    socket.write(`221 2.0.0 Bye${CRLF}`);
                    socket.end();
                } else {
                    console.log("Unknown command:", command);
                    socket.write('500 5.5.1 Error: unknown command' + CRLF);
                }
            });
            
            socket.on("error", err => {
                console.log("Socket error:", err);
            });
            
            socket.on("close", () => {
                console.log("Connection closed");
            });
        });

        this.smtpClient = new AwtsmoosClient("awtsmoos.one");

        this.server.on("error", err => {
            console.log("Server error: ", err);
        });
    }
    
    shoymayuh() {
        this.server.listen(25, () => {
            console.log("Awtsmoos mail listening to you, port 25");
        }).on("error", err => {
            console.log("Error starting server:", err);
        });
    }
}
