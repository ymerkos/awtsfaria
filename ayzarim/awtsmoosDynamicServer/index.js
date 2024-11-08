// B"H
/**
 * This file contains the logic for serving static files for our application.
 * It's a helper class called "AwtsmoosStaticServer".
 * 
 * @fileoverview Static file server module for our application.
 * @module AwtsmoosStaticServer
 * @requires path
 * @requires fs
 * @requires url
 * @requires querystring
 * @requires ./awtsmoosProcessor.js
 * @requires ./DosDB.js
 * @requires ./fetch.js
 @optional mail argument
 */
// The Garden of Servers - AwtsmoosStaticServer
// A symphony of code, a dance of bytes, a living testament to the Creator's design, guided by the essence of the Awtsmoos.
var url = require('url');
var fs = require('fs')
	.promises; // Use promises version of fs, the "Yesod" foundation of our file operations.
var {fetch, TextEncoder, URLSearchParams} = require("./fetch.js");
var path = require('path'); // "Netzach", leading us on the right path.
var Utils = require("../tools/utils.js");
var config = require("../awtsmoos.config.json");
var processTemplate = require('./awtsmoosProcessor.js'); // Our own "Hod", glory of template processing.
var DosDB = require("../DosDB/GraphDB.js"); // The "Tiferet", beauty of our data management.
var querystring = require('querystring'); // The "Gevurah", strength to parse form data.
var auth = require("../tools/auth.js")
var AwtsmoosResponse = require("./awtsmoosResponse.js")
var awtsMoosification = "_awtsmoos.derech.js";
var Ayzarim = require("./getAwtsmooses.js"); 
var TemplateObjectGenerator = require("./TemplateObjectGenerator.js")
var sodos = require("../tools/sodos.js");

var {
	binaryMimeTypes,
	mimeTypes
} = require("./mimes.js");

var self = null;

// The Sacred Map - MIME Types
// A journey through the garden of formats, a gateway to the essence of digital existence, the "Chokhmah", wisdom of our server.

/**
 * A mapping of file extensions to MIME types, the "Chokhmah", wisdom of our server.
 * This is used to set the Content-Type header in the HTTP response.
 * 
 * @enum {string}
 */


// B"H
// The AwtsmoosStaticServer - A Living Symphony
// A dance of requests and responses, a symphony of logic and emotion, a journey through the digital realm guided by the Awtsmoos.

class AwtsmoosStaticServer {
	constructor(directory, mail=null) {
		self = this;
		this.directory = (directory || __dirname) + "/";
		this.mainDir = config.public || "geelooy";
		this.middleware = [];
		this.db = null;
		this.mail=mail;
		process.env.__awtsdir = this.directory;
		
		
		
	}
	
	async init() {
		
		if (config) {
			if (typeof(config.dbPath) == "string") {
				try {
					var absoluteDbPath = path.resolve(
						this.directory,
						config.dbPath
					);
					process.awtsmoosDbPath = absoluteDbPath;
					
				} catch (e) {
					
				}
				
			} else {
				try {
					var absoluteDbPath = path.resolve(
						this.directory,
						"../../"
					);
					process.awtsmoosDbPath = absoluteDbPath;
					
				} catch (e) {
					
				}
			}
			
			
			var db = new DosDB(process.awtsmoosDbPath);
			await db.init();
			this.db = db;
			if (typeof(config.secret) == "string") {
				var sec = null;
				
				try {
					sec = require(this.directory + config.secret)
				} catch (e) {}
				if (!sec) sec = {
					BH: "B\"H",
					noKey: "There is no security here at all!"
				}
				if (sec) {
					this.secret = JSON.stringify(sec);
					var awtsAuth = new auth(this.secret);
					
					this.use(awtsAuth.sessionMiddleware.bind(awtsAuth));
				}
			}
		}

		if(this. mail){
			
			this.mail.gotMail=({
				sender,
				recipients,
				data

			})=>{
				try{
				var time=Date.now();
				recipients.forEach(r=>
				
				this.db.write(`/emails/${
					r.replace("@","_at_")
					.replace("<","")
					.replace(">","")

				}/from/${
					sender.replace("@","_at_")
					.replace("<","")
					.replace(">","")
					
				}/time/${
					time
				}`, {
					data: data+""
				}));
				console. log("wrote email",sender,
					     recipients,time);
			    }
				catch($){
					console.log("didn't save email")

				}
				

			}

		}

		
	}
	/**
	 * 
	 * @param {Function<request, response>} fn the middleware function to add 
	 * this function allows the "static" server to use middleware 
	 */
	use(fn) {
		if (typeof(fn) == "function")
			this.middleware.push(fn);
	}
	/**
	 * 
	 * @param {*} q request object 
	 * @param {*} r response
	 */
	async doMiddleware(q, r) {
		if (this.middleware.length) {
			await Promise.all(this.middleware.map(async w => {
				await w(q, r);
			}));
		}
	}
	
	
	
	/**
	 * The Heartbeat - onRequest
	 * The soul of the server, where the essence of the Awtsmoos manifests in every request and response.
	 * A dance of logic and emotion, a journey through the digital garden.
	 * 
	 * @param {Object} request - The incoming HTTP request.
	 * @param {Object} response - The outgoing HTTP response.
	 * @returns {Promise<void>}
	 */
	
	async onRequest(request, response) {
		response.setHeader("Access-Control-Allow-Origin", "*")
		var self = this;
		response.statusCode = 200;
		var cookies = {};
		if (typeof(request.headers.cookie) == "string") {
			cookies = Utils.parseCookies(request.headers.cookie);
		}
		request.cookies = cookies;
		var parsedUrl = url.parse(request.url, true);
		var originalPath = parsedUrl.pathname;
		
		if (!originalPath) {
			originalPath = '/';
		}
		
		try {
			originalPath = decodeURIComponent(
				originalPath
			);
		} catch (e) {
			
			console.log(e);
		}
		
		var serverPath = path.join(
			this.directory, this.mainDir
		)
		var filePath = path.join(
			serverPath, originalPath
		);
		// Get the parent path (current directory) of the file
		
		var currentPath = filePath;
		var parentPath = serverPath//path.dirname(currentPath);
		var foundAwtsmooses = [];
		
		var paramKinds = {
			POST: {},
			PUT: {},
			GET: {},
			DELETE: {}
		}
		
		// Proceed with serving file at filePath
		
		//first, process middleware
		this.doMiddleware(request, response);
		response.setHeader("BH", "Boruch Hashem");
		response.setHeader("Awtsmoos", "Is found in all things");
		response.setHeader('Transfer-Encoding', 'chunked') // Enables chunked transfer
	        response.setHeader('Connection', 'keep-alive')
		response.setHeader("content-language", "en")
		paramKinds.GET = parsedUrl.query; // Get the query parameters
		var sear = parsedUrl.search;
		if(sear) {
			paramKinds = parseData(
				paramKinds,
				"GET",
				parsedUrl.search.substring(1)
			)
		}
		//console.log("GETTING",parsedUrl,paramKinds)
		//  console.log(`Requested: ${url.parse(request.url).pathname}`);
		//   console.log(`Serving file at: ${filePath}`);
		var extname = String(path.extname(filePath))
			.toLowerCase();
		var contentType = mimeTypes[extname] || 'application/octet-stream';
		
		var isBinary = false;
		
		
		var isDirectoryWithIndex = false;
		var isDirectoryWithoutIndex = false;
		
		
		
		var fileName = null;
		var filePaths = null;
		
		
		var modifiedResponse = response;
		var oldEnd = response.end;
		var ended = false;
		modifiedResponse.end = function(...args) {
			if(!ended) {
				ended = true;
				oldEnd.bind(response)(...args);
			} else {
				console.log("Tryied",args,ended)
			}
		}

		
		var dependencies = {
			//fetch,
			makeToken: (vl,ex={})=>{
		            try{
		                var tok = sodos.createToken(
		                    vl,
		                    self.secret,
		                    ex
		
		                )
		                return {success:tok}
		
		            }catch(e){
		                return {error: e}
		
		            }
		
		        },
			TextEncoder,
			URLSearchParams,
			binaryMimeTypes,
			mimeTypes,
			path,
			originalPath,
			sodos,
				
			fs,
			self,
			awtsMoosification,
			filePath,
			parentPath,
			template,
			
			DosDB,
			require,
			parsedUrl,
			location: parsedUrl,
			request,
			response,
			console,
			mimeTypes,
			binaryMimeTypes,
			url,
			cookies,
			paramKinds,
			Utils,
			
			config,
			
			fileName,
			isDirectoryWithIndex,
			contentType,
			getPostData,
			btoa, atob,
			getPutData,
			getDeleteData,
			

		};

		
		var templateObjectGenerator = 
		new TemplateObjectGenerator(dependencies);
		
		


		var nextDependencies = {
			awtsRes,
			
			templateObjectGenerator,
			...templateObjectGenerator.dependencies
		}

		var awtsRes = new AwtsmoosResponse(
			nextDependencies
		);

		var moreDependencies = {
			...nextDependencies,
			awtsRes
		}
		var ayz = new Ayzarim(moreDependencies);
		
		var {
			fetchAwtsmoos,
			doEverything
		} = ayz;
		fetchAwtsmoos = fetchAwtsmoos.bind(ayz);
		templateObjectGenerator.fetchAwtsmoos = fetchAwtsmoos
		doEverything = doEverything.bind(ayz);

		

		try {
			return await doEverything();
		} catch(e) {

		}

		
		
		
		
		
		
		
		async function getPostData() {
			return await getData();
		}
		
		async function getPutData() {
			return await getData("PUT")
		}
		
		async function getDeleteData() {
			return await getData("DELETE")
		}
		
		function getData(method = "POST") {
			return new Promise((r, j) => {
				let paramData = '';
				request.on('data', chunk => {
					if (request.method.toUpperCase() !== method)
						return r(null);
					
					paramData += chunk;
					
					// Check for flood attack or faulty client, "Yetzer Hara" of the digital realm.
					if (paramData.length > 15e6) {
						paramData = "";
						// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
						// We show "Din", judgement, by cutting off the request.
						request.socket.destroy();
						return r(null);
					}
				});
				
				request.on('end', async () => {
					
					if (request.method === method) {
						paramKinds = parseData(
							paramKinds,
							method,
							paramData
						)
						
						// Perform your validation here
						r(paramKinds[method]);
						return;
					} else {
						r(null)
					}
				});
			})
			
		}

		function parseData(paramKinds, method, paramData) {
			// If it's a POST request, parse the POST data
			paramKinds[method] = querystring.parse(paramData);
						
						
			// Try to parse each parameter as JSON
			paramKinds[method] = Object.fromEntries(
				Object.entries(paramKinds[
					method
				])
				.map(([key, value]) => {
					try {
						return [key, JSON.parse(value)];
					} catch (error) {
						// If it fails, keep the original string value
						return [key, value];
					}
				}));
			return paramKinds
		}
		
		
		
		/*
			Do awtsmoos resposne here

		*/

		
		
		
		
		
		
		
		async function template(textContent, ob = {}, entire = false) {
			if (typeof(ob) != "object") ob = {};
			return await processTemplate(textContent,
				await templateObjectGenerator.getTemplateObject(ob), entire);
		};
		
		
		
	}
}

function btoa(input) {
    return Buffer.from(input).toString('base64');
}

function atob(input) {
    return Buffer.from(input, 'base64').toString('binary');
}
module.exports = AwtsmoosStaticServer;
