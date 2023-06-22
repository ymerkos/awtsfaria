//B"H
const http = require('http');
const fs = require('fs').promises; // Use promises version of fs
const path = require('path');
const processTemplate = require('./ayzarim/awtsmoosProcessor.js');
const DosDB = require("./ayzarim/DosDB.js")
const querystring = require('querystring'); // Require querystring to parse form data
const url = require('url'); // Require url to parse GET parameters

const exists = async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}
//B"H hi
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css'
};

http.createServer(async (request, response) => { // Make request handler async
    let filePath = './geelooy' + url.parse(request.url).pathname;
    const parsedUrl = url.parse(request.url, true); // Parse the URL, including query parameters
    const getParams = parsedUrl.query; // Get the query parameters

    // If the path doesn't exist or it's the root directory, serve the index.html file
    if (!(await exists(filePath)) || filePath == './geelooy/') {
        filePath = './geelooy/index.html';
    } else if (!path.extname(filePath)) {
        // If there is no extension, check if it's a directory and serve index.html from it
        filePath = path.join(filePath, '/index.html');
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    let postData = '';
    request.on('data', chunk => {
        postData += chunk;

        // Check for flood attack or faulty client
        if(postData.length > 1e6) {
            postData = "";
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            request.connection.destroy();
        }
    });

    request.on('end', async () => {
        let postParams = {};

        if(request.method === 'POST') {
            // If it's a POST request, parse the POST data
            postParams = querystring.parse(postData);
            // Perform your validation here
        }

        try {
            const content = await fs.readFile(filePath, 'utf-8'); // Await readFile
            const processed = await processTemplate(content, { // Await processTemplate
                DosDB,
                $_POST:postParams, // Include the POST parameters in the context
                $_GET:getParams // Include the GET parameters in the context
            });
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(processed, 'utf-8');
        } catch (errors) {
            console.log(errors);
            response.writeHead(500, { 'Content-Type': 'text/html' });
            response.end("B\"H<br>There were some errors! Time for Teshuva :)<br>"+JSON.stringify(errors));
        }
    });

}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');
