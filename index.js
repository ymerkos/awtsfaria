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

 */

 const http = require('http');

 const awts = require("./ayzarim/awtsmoosStaticServer.js");

 const email=require("./ayzarim/email.js");
var awtsm= new email();
 var serv = new awts(__dirname);
 
 /**
  * The "Keter", crown of our application, starting the HTTP server.
  * The server listens for requests on port 8080.
  * For each request, it reads the requested file from the filesystem, the "Da'at", knowledge of our server,
  * processes it as a template if necessary, and sends the resulting content back to the client.
  */
 http.createServer(async (request, response) => { // Make request handler async
    await serv.onRequest(request, response);
}).listen(8080); // Listen for requests on port 8080
    serv.db.write("/logs/mail/"+Date.now,{
hi:"there"+Date.now()
    })
    console.log('Server running at http://127.0.0.1:8080/');
    try{
awtsm.shoymayuh();
    } catch(e){
console. log("error mail:",e)
    }
 
