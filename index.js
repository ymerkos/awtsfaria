//B"H
const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css'
};

http.createServer((request, response) => {
    let filePath = './geelooy' + request.url;
    if (filePath == './geelooy/') {
        filePath = './geelooy/index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (errors, content) => {
        if (!errors) {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        } else {
            console.log(errors);
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end("B\"H<br>There were some errors! Time for Teshuva :)");
        }
    });

}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');
