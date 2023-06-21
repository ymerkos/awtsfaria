//B"H
const http = require('http');
const fs = require('fs');
const path = require('path');
const processTemplate = require('./ayzarim/awtsmoosProcessor.js');
const DosDB = require("./ayzarim/DosDB.js")

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css'
};

http.createServer((request, response) => {
    let filePath = './geelooy' + request.url;
    if (filePath == './geelooy/') {
        filePath = './geelooy/index.html';
    } else if (!path.extname(filePath)) {
        // If there is no extension, check if it's a directory and serve index.html from it
        filePath = path.join(filePath, '/index.html');
    }

    const extname = String(path.extname(filePath)).toLowerCase();

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (errors, content) => {
        if (!errors) {
            var processed;
            try {
                processed = processTemplate(content, {
                    DosDB
                });
            } catch(e) {
                processed = JSON.stringify({errorWasHere:e})
            }
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(processed, 'utf-8');
        } else {
            console.log(errors);
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end("B\"H<br>There were some errors! Time for Teshuva :)<br>"+JSON.stringify(errors));
        }
    });

}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');
