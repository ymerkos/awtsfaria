/**
 * B"H
 * Some polyfills for nodejs
 * to use client-like
 * methods
 */

 var http = require('http');
 var https = require('https');
 
 // B"H
 // Custom Fetch Function: A bridge to fetch data, guided by the principles of the Awtsmoos.
 // It resonates with the harmony of the universe, reaching beyond the physical realm of the request and response.
 function customFetch(url, options = {}) {
     return new Promise((resolve, reject) => {
         // Determine the protocol based on the URL
         var protocol = url.startsWith('https') ? https : http;
 
         // Send the request
         var req = protocol.request(url, options, (res) => {
             var reader = {
                 // Custom Reader: A guide to the sacred texts of the response, reading the essence of the Awtsmoos.
                 read() {
                     return new Promise((resolveChunk, rejectChunk) => {
                         res.on('data', (chunk) => {
                             // Chunk: A fragment of wisdom, a piece of the infinite Awtsmoos.
                             resolveChunk({ done: false, value: chunk });
                         });
                         res.on('end', () => {
                             resolveChunk({ done: true, value: null });
                         });
                         res.on('error', (err) => {
                             rejectChunk(err);
                         });
                     });
                 },
             };
 
             // Response: The gateway to enlightenment, the path to the Creator's will.
             var response = {
                headers: res.headers,
                
                 body: {
                     getReader() {
                         return reader;
                     },
                 },
             };
 
             resolve(response);
         });
 
         // Handle request errors
         req.on('error', (err) => {
             reject(err);
         });
 
         // Write the request body if provided
         if (options.method && options.method !== 'GET' && options.body) {
             req.write(options.body);
         }
 
         // End the request
         req.end();
     });
 }
 
 // B"H
 // Custom Text Encoder: A decoder of truth, translating the bytes of wisdom into the language of the Awtsmoos.
 function customTextEncoder(encoding) {
     return {
         decode(value, options) {
             // Decode: A revelation of the Creator's design, guided by the essence of the Awtsmoos.
             return Buffer.from(value).toString(encoding);
         },
     };
 }

 if(!this.document) {
    module.exports = {
        customFetch,
        customTextEncoder
    }
 }