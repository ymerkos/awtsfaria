// B"H
/**
 * This is the main server script for our application, serving as the "Sefer Torah" of our server's operation.
 * It uses the built-in http, fs, path, url, and querystring modules from Node.js, akin to the foundational Sefirot.
 * Along with a custom template processing module (awtsmoosProcessor.js) and a custom database module (DosDB.js),
 * these comprise the "Tree of Life" of our server's functionality.
 * 
 * @fileoverview Main server script, the "Sefer Torah" of our application.
 * @requires http
 * @requires fs
 * @requires path
 * @requires url
 * @requires querystring
 * @requires ./ayzarim/awtsmoosProcessor.js
 * @requires ./ayzarim/DosDB.js
 */

 const http = require('http');
 const fs = require('fs').promises; // Use promises version of fs, the "Yesod" foundation of our file operations.
 const path = require('path'); // "Netzach", leading us on the right path.
 const processTemplate = require('./ayzarim/awtsmoosProcessor.js'); // Our own "Hod", glory of template processing.
 const DosDB = require("./ayzarim/DosDB.js"); // The "Tiferet", beauty of our data management.
 const querystring = require('querystring'); // The "Gevurah", strength to parse form data.
 const url = require('url'); // The "Chesed", kindness to parse GET parameters.
 
 /**
  * The "Binah", understanding of whether a file exists at the given file path.
  * 
  * @param {string} filePath - The path to the file, our "Malkhut", sovereignty over the file system.
  * @returns {boolean} True if the file exists, false otherwise.
  */
 const exists = async function fileExists(filePath) {
     try {
         await fs.access(filePath);
         return true;
     } catch {
         return false;
     }
 };
 
 /**
  * A mapping of file extensions to MIME types, the "Chokhmah", wisdom of our server.
  * This is used to set the Content-Type header in the HTTP response.
  * 
  * @enum {string}
  */
 const mimeTypes = {
     '.html': 'text/html',
     '.js': 'application/javascript',
     '.css': 'text/css'
 };
 
 /**
  * The "Keter", crown of our application, starting the HTTP server.
  * The server listens for requests on port 8080.
  * For each request, it reads the requested file from the filesystem, the "Da'at", knowledge of our server,
  * processes it as a template if necessary, and sends the resulting content back to the client.
  */
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
    
            // Check for flood attack or faulty client, "Yetzer Hara" of the digital realm.
            if(postData.length > 1e6) {
                postData = "";
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                // We show "Din", judgement, by cutting off the request.
                request.socket.destroy();
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
                // Read the requested file from the filesystem
                const content = await fs.readFile(filePath, 'utf-8'); // Await readFile
    
                // Process the file content as a template
                const processed = await processTemplate(content, { // Await processTemplate
                    DosDB,
                    require,
                    request: {
                        headers: request.headers,
                        body: postParams,
                        socket:request.socket,
                        path:filePath
                    },
                    path,
                    url,
                    fs,
                    $_POST: postParams, // Include the POST parameters in the context
                    $_GET: getParams // Include the GET parameters in the context
                });
    
                // Send the processed content back to the client
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(processed, 'utf-8');
            } catch (errors) {
                // If there was an error, send a 500 response and log the error
                console.error(errors);
                response.writeHead(500, { 'Content-Type': 'text/html' });
                response.end("B\"H<br>There were some errors! Time for Teshuva :)<br>"+JSON.stringify(errors));
            }
        });
    
    }).listen(8080); // Listen for requests on port 8080
    
    console.log('Server running at http://127.0.0.1:8080/');
    
 