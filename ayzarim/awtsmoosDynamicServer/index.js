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
 */
// The Garden of Servers - AwtsmoosStaticServer
// A symphony of code, a dance of bytes, a living testament to the Creator's design, guided by the essence of the Awtsmoos.
const url = require('url');
const fs = require('fs')
	.promises; // Use promises version of fs, the "Yesod" foundation of our file operations.

const path = require('path'); // "Netzach", leading us on the right path.
const Utils = require("../utils.js");
const config = require("./awtsmoos.config.json");
const processTemplate = require('../awtsmoosProcessor.js'); // Our own "Hod", glory of template processing.
const DosDB = require("../DosDB/GraphDB.js"); // The "Tiferet", beauty of our data management.
const querystring = require('querystring'); // The "Gevurah", strength to parse form data.
const auth = require("../auth.js")
var AwtsmoosResponse = require("./awtsmoosResponse.js")
var awtsMoosification = "_awtsmoos.derech.js";
var Ayzarim = require("./getAwtsmooses.js"); 
var TemplateObjectGenerator = require("./TemplateObjectGenerator.js")

const {
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
	constructor(directory, mainDir) {
		self = this;
		this.directory = (directory || __dirname) + "/";
		this.mainDir = mainDir || "geelooy";
		this.middleware = [];
		this.db = null;
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
		
		var filePath = path.join(this.directory, this.mainDir, originalPath);
		// Get the parent path (current directory) of the file
		
		var currentPath = filePath;
		var parentPath = path.dirname(currentPath);
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
		response.setHeader("content-language", "en")
		paramKinds.GET = parsedUrl.query; // Get the query parameters
		
		//  console.log(`Requested: ${url.parse(request.url).pathname}`);
		//   console.log(`Serving file at: ${filePath}`);
		const extname = String(path.extname(filePath))
			.toLowerCase();
		var contentType = mimeTypes[extname] || 'application/octet-stream';
		
		var isBinary = false;
		
		
		var isDirectoryWithIndex = false;
		var isDirectoryWithoutIndex = false;
		
		var isRealFile = false;
		
		var fileName = null;
		var filePaths = null;
		
		

		var dependencies = {
			errorMessage,
			getProperContent,
			path,
			originalPath,
			foundAwtsmooses,
			fs,
			self,
			awtsMoosification,
			filePath,
			template,
			
			DosDB,
			require,
			request,
			response,
			console,
			mimeTypes,
			binaryMimeTypes,
			url,
			cookies,
			paramKinds,
			Utils,
			fetchAwtsmoos,
			config,
			
			fileName,
			isDirectoryWithIndex,
			contentType,
			getPostData,
			getPutData,
			getDeleteData,
			
			doFileResponse

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
		fetchAwtsmoos = fetchAwtsmoos.bind(ayz)
		doEverything = doEverything.bind(ayz);

		


		return await doEverything();
		
		
		
		
		
		
		
		
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
						
						// Perform your validation here
						r(paramKinds[method]);
						return;
					} else {
						r(null)
					}
				});
			})
			
		}
		
		
		function errorMessage(custom) {
			try {
				response.setHeader("content-type", "application/json");
				
				response.end(JSON.stringify({
					BH: "B\"H",
					error: custom || "Not found"
				}));
			} catch (e) {
				console.log(e)
			}
			
			
			return true;
		}
		/*
			Do awtsmoos resposne here

		*/

		
		
		async function doFileResponse() {
			try {
				let content;
				
				if (binaryMimeTypes.includes(contentType)) {
					// If the file is a binary file, read it as binary.
					content = await fs.readFile(filePath);
					isBinary = true;
				} else {
					// Otherwise, read the file as 'utf-8' text and process it as a template.
					const textContent = await fs.readFile(filePath, 'utf-8');
					
					content = await template(textContent);
				}
				
				// Send the processed content back to the client
				
				content = setProperContent(content, contentType);

				response.end(content);
				
				return;
			} catch (errors) {
				// If there was an error, send a 500 response and log the error
				console.error(errors);
				return errorMessage(
					errors
				)
			}
		}
		
		
		function getProperContent
		(
			content=null, 
			contentType=null
		) {
			

			if (!isBinary) {
				if (typeof(content) == "boolean") {
					content += ""
				}
				else if (
					content && 
					typeof(content) == "object"
				) {
					contentType = "application/json";
					try {
						content = JSON.stringify(content);
					} catch (e) {
						content += ""
					}
				}
			}
			return {
				content,
				contentType
			}
		}

		function setProperContent(content, contentType) {
			var cnt = getProperContent(content, contentType)
			
			
			if (cnt.contentType) {
				
					response.setHeader('Content-Type', contentType);
				
			}
			return cnt.content;
		}
		
		
		
		
		async function template(textContent, ob = {}, entire = false) {
			if (typeof(ob) != "object") ob = {};
			return await processTemplate(textContent,
				await templateObjectGenerator.getTemplateObject(ob), entire);
		};
		
		
		
	}
}

/**
 * The "Binah", understanding of whether a file exists at the given file path.
 * 
 * @param {string} filePath - The path to the file, our "Malkhut", sovereignty over the file system.
 * @returns {boolean} True if the file exists, false otherwise.
 */
async function exists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
};

module.exports = AwtsmoosStaticServer;