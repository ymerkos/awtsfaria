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
 const Utils = require("./ayzarim/utils.js");
 const config = require("./ayzarim/awtsmoos.config.json");
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
 
 const binaryMimeTypes = [
    'model/gltf-binary',
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'image/gif',
    'image/webp',
    'image/x-icon',
    'image/tiff',
    'image/bmp',
    'image/x-dcraw',
    'image/heif',
    'image/heif-sequence',
    'image/heic',
    'image/heic-sequence',
    'image/avif',
    'image/jxl',
    'image/x-ms-bmp',
    'image/bmp',
    'image/jpeg',
    'image/jpeg',
    'image/jpeg',
    'image/webp',
    'image/apng',
    'image/flif',
    'image/vnd.radiance',
    'image/x-icon',
    'application/x-navi-animation',
    'application/octet-stream'
  ];

 /**
  * A mapping of file extensions to MIME types, the "Chokhmah", wisdom of our server.
  * This is used to set the Content-Type header in the HTTP response.
  * 
  * @enum {string}
  */
 const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.jsm': 'application/javascript',
    '.mjs': 'application/javascript',
    '.glb':'model/gltf-binary',
    '.gltf':'model/gltf-binary',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.tiff': 'image/tiff',
    '.bmp': 'image/bmp',
    '.raw': 'image/x-dcraw',
    '.heif': 'image/heif',
    '.heif-sequence': 'image/heif-sequence',
    '.heic': 'image/heic',
    '.heic-sequence': 'image/heic-sequence',
    '.avif': 'image/avif',
    '.jxl': 'image/jxl',
    '.bat': 'image/x-ms-bmp',
    '.dib': 'image/bmp',
    '.jfif': 'image/jpeg',
    '.pjpeg': 'image/jpeg',
    '.pjp': 'image/jpeg',
    '.webp': 'image/webp',
    '.apng': 'image/apng',
    '.flif': 'image/flif',
    '.hdr': 'image/vnd.radiance',
    '.cur': 'image/x-icon',
    '.ani': 'application/x-navi-animation',
 };
 
 /**
  * The "Keter", crown of our application, starting the HTTP server.
  * The server listens for requests on port 8080.
  * For each request, it reads the requested file from the filesystem, the "Da'at", knowledge of our server,
  * processes it as a template if necessary, and sends the resulting content back to the client.
  */
 http.createServer(async (request, response) => { // Make request handler async
    response.statusCode = 200;
    var cookies = Utils.parseCookies(request.headers.cookie);
    let filePath = './geelooy' + url.parse(request.url).pathname;
    filePath = filePath.split("../").join("/");
    filePath = filePath.split("/")
        .filter(o=>o).join("/");

    var parts = filePath.split("/");
    var lastPart = parts[parts.length - 1];
    if(!lastPart.endsWith("/") && lastPart.indexOf(".") < 0) {
       filePath += "/";
    }
    const parsedUrl = url.parse(request.url, true); // Parse the URL, including query parameters
    const getParams = parsedUrl.query; // Get the query parameters
    var parts = filePath.split
    console.log(filePath)
    response.setHeader("BH","Boruch Hashem");
    
    // If the path doesn't exist or it's the root directory, serve the index.html file
    if (filePath === './geelooy/' || filePath === './geelooy') {
        filePath = './geelooy/index.html';
    } else if (await exists(filePath)) {
        if (!path.extname(filePath)) {
            // If there is no extension, it's a directory - serve index.html from it
            filePath = path.join(filePath, '/index.html');

            
        }
    } else {
        response.setHeader("content-type","application/json")
        response.end(JSON.stringify({BH:"B\"H",error:"Not found"}));
        return;  // Important! You need to return from the function here to avoid serving any file.
    }
    
      //  console.log(`Requested: ${url.parse(request.url).pathname}`);
     //   console.log(`Serving file at: ${filePath}`);
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
                const contentType = mimeTypes[extname] || 'application/octet-stream';

                let content;
                if (binaryMimeTypes.includes(contentType)) {
                  // If the file is a binary file, read it as binary.
                  content = await fs.readFile(filePath);
                } else {
                  // Otherwise, read the file as 'utf-8' text and process it as a template.
                  const textContent = await fs.readFile(filePath, 'utf-8');
                  async function template(textContent, ob={}) {
                    if(typeof(ob) != "object") ob={};
                    return await processTemplate(textContent, { // Await processTemplate
                        DosDB,
                        require,
                        request,
                        setHeader:(nm,vl) => {
                            response.setHeader(nm,vl);
                        },
                        console: {
                            log:(...args)=>console.log(args)
                        },
                        getT/*get template content*/:async(path, ob) =>{
                            var file = await fs.readFile("./templates/"+path);
                            console.log(file.toString())
                            return await template(file+"",ob);
                        },
                        setStatus:status=>response.statusCode = status,
                        template,
                        getHeaders:()=>request.headers,
                        path,
                        url,
                        fs,
                        cookies,
                        $_POST: postParams, // Include the POST parameters in the context
                        $_GET: getParams // Include the GET parameters in the context
                        ,
                        config,
                        ...ob
                    });
                  };
                  content = await template(textContent);
                }
    
                // Send the processed content back to the client
                response.setHeader('Content-Type', contentType);
                response.end(content);
            } catch (errors) {
                // If there was an error, send a 500 response and log the error
                console.error(errors);
                response.writeHead(500, { 'Content-Type': 'text/html' });
                response.end("B\"H<br>There were some errors! Time for Teshuva :)<br>"+JSON.stringify(errors));
            }
        });
    
    }).listen(8080); // Listen for requests on port 8080
    
    console.log('Server running at http://127.0.0.1:8080/');
    
 