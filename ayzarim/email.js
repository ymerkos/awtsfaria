//B"H
const net = require('net');
const CRLF = '\r\n';
module.exports = class Awtsmail {
	server
	constructor() {
    console.log("Starting instance of email")
		this.server = net.createServer(socket => {
      console.log("Some connection happened!",Date.now())
			let sender = '';
			let messageReceived = false;

			socket.on('data', data => {
        console.log("Got some data! " + data)
				const command = data.toString().trim();
				console.log(command);

				if (command.startsWith('HELO') || command.startsWith('EHLO')) {
					socket.write(`250 Hello${CRLF}`);
				} else if (command.startsWith('MAIL FROM')) {
					socket.write(`250 2.1.0 Ok${CRLF}`);
					sender = command.slice(10); // Capture the sender's email address
				} else if (command.startsWith('RCPT TO')) {
					socket.write(`250 2.1.5 Ok${CRLF}`);
				} else if (command.startsWith('DATA')) {
					socket.write(`354 End data with <CR><LF>.<CR><LF>${CRLF}`);
				} else if (command.startsWith('.')) {
					socket.write(`250 2.0.0 Ok: queued as 12345${CRLF}`);
					messageReceived = true;
				} else if (messageReceived && command.startsWith('QUIT')) {
					const client = new net.Socket();
					client.connect(25, 'smtp.gmail.com', () => {
						client.write(`HELO server${CRLF}`);
						client.write(`MAIL FROM: hi@awtsmoos.com${CRLF}`);
						client.write(`RCPT TO: ${sender}${CRLF}`);
						client.write(`DATA${CRLF}`);
						client.write(`Subject: Hello${CRLF}`);
						client.write(`B'H${CRLF}`);
						client.write(`.${CRLF}`);
					});
					client.on('data', data => console.log(data.toString()));
					client.on('end', () => socket.write(`221 2.0.0 Bye${CRLF}`));
					socket.end();
				}
			});
		});
	}

	shoymayuh() {
		this.server.listen(25, () => {
			console.log("Awtsmoos mail listening to you, port 25");
		})
	}
}