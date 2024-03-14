/**
 * B"H
 * @module AwtsMail
 */

var AwtsmoosClient = require("./awtsmoosEmailClient.js");
var net = require('net');
var CRLF = '\r\n';

module.exports = class AwtsMail {
    constructor() {
        console.log("Starting instance of email");

        this.server = net.createServer(socket => {
            //console.log("Some connection happened!", Date.now());
            socket.write('220 awtsmoos.one ESMTP Essence of Reality' + CRLF);

            let sender = '';
            let recipients = [];
            let data = '';
            let receivingData = false;
            let buffer = '';

            socket.on('data', chunk => {
                buffer += chunk.toString();
                let index;
                while ((index = buffer.indexOf(CRLF)) !== -1) {
                    var command = buffer.substring(0, index);
                    buffer = buffer.substring(index + CRLF.length);

                    //console.log("Received command:", command);
                    //console.log("Command length:", command.length);

                    if (receivingData) {
                        if (command === '.') {
                            receivingData = false;
                           // console.log("Received email data:", data);

                            socket.write(`250 2.0.0 Ok: queued as 12345${CRLF}`);

                            // Simulate sending a reply back.
                            if (sender) {
                              //console.log("The email has ended!")
                              try {
                               // console.log(`Sending a reply back to ${sender}`);
                                var ds=this.gotMail;
                                  ds({
                                      sender,
                                      recipients,
                                      data

                                  });
                                this.smtpClient.sendMail(
                                    'reply@awtsmoos.one', sender, 
                                    "Reply from Awtsmoos " + (
                                         Math.floor(
                                             Math.random() * 8
                                        )
                                    ),

                                    'B"H\n\nHello from the Awtsmoos, the time is '+
                                  (new Date())
                                
                                );
                              } catch(e){
                                  console. log("didn't send response",e)

                              }
                            }
                        } else {
                            data += command + CRLF;
                        }
                        continue;
                    }

                    if (command.startsWith('EHLO') || command.startsWith('HELO')) {
                        socket.write(`250-Hello${CRLF}`);
                        socket.write(`250 SMTPUTF8${CRLF}`);
                    } else if (command.startsWith('MAIL FROM')) {
                        sender = command.slice(10).split("<").join("")
                        .split(">").join("");
                        socket.write(`250 2.1.0 Ok${CRLF}`);
                        console.log("The SENDER is:", sender);
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
                      //  console.log("Unknown command:", command);
                        socket.write('500 5.5.1 Error: unknown command' + CRLF);
                    }
                }
            });

            socket.on("error", err => {
                console.log("Socket error:", err);
            });

            socket.on("close", () => {
                console.log("Connection closed");
            });
        });

        this.smtpClient = new AwtsmoosClient();

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

    gotMail({
        sender,
        recipients,
        data

    }){
        console. log("I've got mail",
                     sender,
                     recipients)

    }
}
