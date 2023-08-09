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
const fs = require('fs').promises; // Use promises version of fs, the "Yesod" foundation of our file operations.

const path = require('path'); // "Netzach", leading us on the right path.
const Utils = require("./utils.js");
const config = require("./awtsmoos.config.json");
const processTemplate = require('./awtsmoosProcessor.js'); // Our own "Hod", glory of template processing.
const DosDB = require("./DosDB.js"); // The "Tiferet", beauty of our data management.
const querystring = require('querystring'); // The "Gevurah", strength to parse form data.
const auth = require("./auth.js")

var awtsMoosification = "_awtsmoos.derech.js";  

var self = null;

// The Sacred Map - MIME Types
// A journey through the garden of formats, a gateway to the essence of digital existence, the "Chokhmah", wisdom of our server.

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

  // B"H
// The AwtsmoosStaticServer - A Living Symphony
// A dance of requests and responses, a symphony of logic and emotion, a journey through the digital realm guided by the Awtsmoos.

class AwtsmoosStaticServer {
	constructor(directory, mainDir) {
        self = this;
		this.directory = (directory || __dirname)+"/";
        this.mainDir = mainDir || "geelooy";
        this.middleware = [];
        this.db = null;
        process.env.__awtsdir = this.directory;
        
        if(config) {
            if(typeof(config.dbPath) == "string") {
                try {
                    var absoluteDbPath = path.resolve(
                        this.directory,
                        config.dbPath
                    );
                    process.awtsmoosDbPath = absoluteDbPath;

                } catch(e) {

                }
                
            } else {
                try {
                    var absoluteDbPath = path.resolve(
                        this.directory,
                        "../../"
                    );
                    process.awtsmoosDbPath = absoluteDbPath;

                } catch(e) {

                }
            }


            var db = new DosDB(process.awtsmoosDbPath);
            this.db = db;
            if(typeof(config.secret) == "string") {
                var sec = require(this.directory  + config.secret)
                if(sec) {
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
        if(typeof(fn) == "function")
            this.middleware.push(fn);
    }
    /**
     * 
     * @param {*} q request object 
     * @param {*} r response
     */
    async doMiddleware(q, r) {
        if(this.middleware.length) {
            await Promise.all(this.middleware.map(async w=> {
                await w(q,r);
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

        var filePath = path.join(this.directory, this.mainDir, originalPath);
        var currentPath = filePath;
        var foundAwtsmooses = [];
        var postParams = {};


		// Proceed with serving file at filePath
        
        //first, process middleware
        this.doMiddleware(request, response);
		response.setHeader("BH", "Boruch Hashem");
		const getParams = parsedUrl.query; // Get the query parameters

		//  console.log(`Requested: ${url.parse(request.url).pathname}`);
		//   console.log(`Serving file at: ${filePath}`);
		const extname = String(path.extname(filePath)).toLowerCase();
		var contentType = mimeTypes[extname] || 'application/octet-stream';

        var isBinary = false;
        

        var isDirectoryWithIndex = false;
        var isDirectoryWithoutIndex = false;
        
        var isRealFile = false;

        var fileName = null;
        var filePaths = null;

        await doEverything();

        async function doEverything() {

            await getPathInfo();

            if(isDirectoryWithIndex) {
                contentType = "text/html";
            }

            if(
                isDirectoryWithIndex ||
                isRealFile
            ) {
                if(
                    !fileName.startsWith("_awtsmoos")
                ) {
                    if(request.method.toUpperCase() == "POST") {
                        await getPostData();
                    }
                    await doFileResponse();
                } else {
                    return errorMessage(
                        "You're not allowed to see that!"
                    )
                }

            } else if(
                foundAwtsmooses.length
            ) {
                
                await doAwtsmooses();
            } else {
                errorMessage();
            }
        }

        async function getAwtsmoosInfo() {
            var checkedPath = originalPath;
            var paths = checkedPath.split("/").filter(w=>w);
            async function checkAwtsmoosDracheem() {
                try {
                    var derech = path.join(
                        self.directory,
                        self.mainDir,
                        checkedPath +"/"+ awtsMoosification
                    );
                    
                    var moos = await fs.stat(derech);
                    if(
                        moos && 
                        !moos.isDirectory()
                    ) {
                        foundAwtsmooses.push(checkedPath);

                    }
                    
                } catch(e) {
                    
                    
                    paths.pop();
                    checkedPath = paths.join("/");
                    paths = checkedPath.split("/").filter(w=>w);
                    if(paths.length)
                        await checkAwtsmoosDracheem();
                }
            }
            
            await checkAwtsmoosDracheem();

        }

        async function getPathInfo() {
            

            
            if(!extname) {
                await getAwtsmoosInfo();
            }

            try {
            var st = await fs.stat(filePath);
           
            


            
            if (st && st.isDirectory()) {
                
                
                
                
                var indexFilePath = filePath + "/index.html";
                if (await exists(indexFilePath)) {
                    filePath = indexFilePath;
                    // Redirect if the original path does not end with a trailing slash
                    if (!originalPath.endsWith('/')) {
                        var redirectUrl = originalPath + '/';
                
                        // Check if query parameters exist
                        if (Object.keys(parsedUrl.query).length > 0) {
                        redirectUrl += '?' + new url.URLSearchParams(parsedUrl.query).toString();
                        }
                
                        // Check if a hash fragment exists
                        if (parsedUrl.hash) {
                        redirectUrl += parsedUrl.hash;
                        }
                        response.writeHead(301, {
                        Location: redirectUrl
                        });
                        response.end();
                        return;
                    }
                    isDirectoryWithIndex = true;
                    fileName = "index.html";
                } else {
                    isDirectoryWithoutIndex = true;
                }
            } else if(st) {
                isRealFile = true;
                filePaths = filePath.split("/").filter(q=>q);
                fileName = filePaths[filePaths.length-1];
            }
            } catch (err) {
            // stat call failed, file or directory does not exist
            }
        }



        function getPostData() {
            return new Promise((r,j) => {
                let postData = '';
                request.on('data', chunk => {
                    if(request.method.toUpperCase() !== "POST")
                        return;
                    
                    postData += chunk;

                    // Check for flood attack or faulty client, "Yetzer Hara" of the digital realm.
                    if (postData.length > 1e6) {
                        postData = "";
                        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                        // We show "Din", judgement, by cutting off the request.
                        request.socket.destroy();
                    }
                });

                request.on('end', async () => {
                    
                    
                    if (request.method === 'POST') {
                        // If it's a POST request, parse the POST data
                        postParams = querystring.parse(postData);
                        // Perform your validation here
                        r(postParams);
                        return;
                    }
                    
                });
            })
            
        }


        function errorMessage(custom) {
            response.setHeader("content-type", "application/json");
            response.end(JSON.stringify({
                BH: "B\"H",
                error: custom || "Not found"
            }));
        }

        async function doAwtsmooses() {
            if(foundAwtsmooses.length) {
                var i;
                for(
                    i = 0;
                    i < foundAwtsmooses.length;
                    i++
                ) {
                    var awts = null;
                    
                    try {
                        var derech = path.join(
                            self.directory,
                            self.mainDir,
                            foundAwtsmooses[i] +"/"+ awtsMoosification
                        );
                        awts = require(derech);
                        
                    } catch(e) {
                        console.log(e)
                    }
                    if(!awts) continue;

                    var otherDynamics = [];
                    var info = null;
                    var dyn = awts.dynamicRoutes(getTemplateObject({
                        derech: "/" + foundAwtsmooses[i],
                        use: (route, func) => {
                            if(typeof(route) != "string")
                                return;
                            
                            info = getAwtsmoosDerechVariables(route, originalPath);
                            try {
                                var rez = func(info?info.vars : null);
                                otherDynamics.push(
                                    {
                                        route,
                                        result:rez,
                                        vars: info.vars
                                    }
                                );

                            } catch(e) {
                                console.log(e)
                            }
                        }
                    }));

                    if(
                        otherDynamics
                        .length
                    ) {
                        
                        var i;
                        for(
                            i = 0;
                            i < otherDynamics.length;
                            i++
                        ) {
                            var od = otherDynamics[i];
                            
                            if(
                                info &&
                                info.doesRouteMatchURL
                            ) {
                                
                                await doAwtsmoosResponse(
                                    od.result
                                );
                                return;
                            }
                        }
                    }
                    if(!dyn) {
                        return errorMessage();
                    }

                    await doAwtsmoosResponse(dyn);


                }
            }
        }
        
        function getAwtsmoosDerechVariables(url, basePath) {
            if(
                typeof(url) != "string" ||
                typeof(basePath) != "string"
            )
                return null;
            
            var vars = {};
            var doesRouteMatchURL = true;
            var sp = url.split("/").filter(q=>q)
                .map(q=>q.trim());
            var op = basePath.split("/").filter(q=>q)
                .map(q=>q.trim());
            
                console.log("all",sp,op)
            sp.forEach((w,i) => {
                if(w.startsWith(":")) {
                    var rest = w.substring(1);
                    var corresponding = 
                    op[i];
                    if(corresponding) {
                        vars[rest] 
                        = corresponding;
                    }
                } else {
                    var cor = op[i];
                    if(
                        cor === undefined
                    ) {
                        
                        doesRouteMatchURL = false;
                    }
                }
                
            });

            return {
                vars,
                doesRouteMatchURL
            };

        }

        async function doAwtsmoosResponse(dyn) {
            var r = dyn.response;
                    
            

            var m = dyn.mimeType;
            if(
                m &&
                typeof(m) 
                == "string"
            ) {
                try {
                    response.setHeader("content-type", m);
                } catch(e) {}
            }
            

            try {
                r = setProperContent(r, m);
                response.end(r);
            } catch(e) {
                console.log(e);
            }
        }

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
			} catch (errors) {
				// If there was an error, send a 500 response and log the error
				console.error(errors);
				errorMessage(
                    errors
                )
			}
        }


        function setProperContent(content, contentType) {
            
            if(!isBinary) {
                if(typeof(content) == "boolean") {
                    content += ""
                }
                if(typeof(content) == "object") {
                    contentType = "application/json";
                    try {
                        content = JSON.stringify(content);
                    } catch(e) {
                        content += ""
                    }
                }

                
            }
            
            if(contentType)
                response.setHeader('Content-Type', contentType);
            return content;
        }

        function getTemplateObject(ob) {
            if(typeof(ob) != "object" || !ob)
                ob = {};
            
            return ({ // Await processTemplate
                DosDB,
                require,
                request,
                setHeader: (nm, vl) => {
                    response.setHeader(nm, vl);
                },
                response,
                console: {
                    log: (...args) => console.log(args)
                },
                db:self.db,
                getT /*get template content*/: async (path, ob) => {
                    var pth = self.directory+"/templates/" + path
                    var file = await fs.readFile(pth);
                   
                    var temp = await template(
                        file + "", 
                        ob

                    );
                    return temp;
                },
                __awtsdir: self.directory,
                setStatus: status => response.statusCode = status,
                template,
                process,
                server:self,
                getHeaders: () => request.headers,
                path,
                url,
                fs,
                cookies,
                $_POST: postParams, // Include the POST parameters in the context
                $_GET: getParams // Include the GET parameters in the context
                    ,
                config,
                ...ob
            })
        }

        async function template(textContent, ob = {}, entire = false) {
            if (typeof(ob) != "object") ob = {};
            return await processTemplate(textContent, 
                getTemplateObject(ob)
                , entire);
        };



	}
}

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

module.exports = AwtsmoosStaticServer;