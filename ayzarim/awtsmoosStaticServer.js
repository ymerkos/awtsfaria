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

const {binaryMimeTypes, mimeTypes} = require("./mimes.js");
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

        try {
            originalPath = decodeURIComponent(
                originalPath
            );
        } catch(e){

            console.log(e);
        }
        
        var filePath = path.join(this.directory, this.mainDir, originalPath);
        var currentPath = filePath;
        var foundAwtsmooses = [];
        var postParams = {};


		// Proceed with serving file at filePath
        
        //first, process middleware
        this.doMiddleware(request, response);
		response.setHeader("BH", "Boruch Hashem");
        response.setHeader("content-language","en")
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

        var ended = true;
        return await doEverything();

        async function doEverything() {
            
            var iExist = await getPathInfo();

            if(!iExist) {
                
                return;
            }

            if(isDirectoryWithIndex) {
                contentType = "text/html";
            }
            
            var didThisPathAlready = false;
            console.log(request.method)
            if(request.method.toUpperCase() == "POST") {
                await getPostData();
            }
            
            if(
                foundAwtsmooses.length
            ) {
                didThisPathAlready = await doAwtsmooses();
            }
            

            
            if(didThisPathAlready) {
                return;
            }
            

            if(
               
                    isDirectoryWithIndex ||
                    isRealFile
                
            ) {
                
                if(
                    !fileName.startsWith("_awtsmoos")
                ) {
                    
                    return await doFileResponse();
                } else {
                    return errorMessage(
                        "You're not allowed to see that!"
                    )
                }

            }  else {
                errorMessage("oh");
                return;
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
            

            
            await getAwtsmoosInfo();
            

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

                            if(!ended) {
                                response.writeHead(301, {
                                    Location: redirectUrl
                                });
                                
                                response.end();
                                ended = true;
                                return false;
                            }
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

            return true;
        }



        function getPostData() {
            return new Promise((r,j) => {
                let postData = '';
                request.on('data', chunk => {
                    if(request.method.toUpperCase() !== "POST")
                        return;
                    
                    postData += chunk;

                    // Check for flood attack or faulty client, "Yetzer Hara" of the digital realm.
                    if (postData.length > 15e6) {
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
            try {
                response.setHeader("content-type", "application/json");
         
                response.end(JSON.stringify({
                    BH: "B\"H",
                    error: custom || "Not found"
                }));
            } catch(e){
                console.log(e)
            }
            
            ended = true;
            
            


            return true;
        }

        async function doAwtsmooses() {
            
            var didThisPath = false;
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
                    
                    var derech = "/" + foundAwtsmooses[i];
                    if(
                        typeof(awts.dynamicRoutes) != "function"
                    ) {
                        
                        continue;
                    }
                    var dyn = await awts.dynamicRoutes(getTemplateObject({
                        derech,
                        use: async (route, func) => {
                            if(typeof(route) == "string") {
                                await awtsUse(route, func);
                                
                            }
                            else if(
                                /**
                                 * really object with 
                                 * {[route]: func/*(vars) => ({info:2})*  /}
                                 */

                                route && typeof(route) == "object"
                            ) {
                                var k = Object.keys(route);
                                var y;
                                for(
                                    y = 0;
                                    y < k.length;
                                    y++
                                ) {
                                    var rt = k[y] //the route string;
                                    var fnc = route[k[y]] // the function
                                    await awtsUse(rt, fnc);
                                }
                                
                                
                            }
                        }
                    }));

                    if(!otherDynamics.length) {
                        
                        return errorMessage();
                    }
                    
                    async function awtsUse(route, func) {
                        if(
                            typeof(route) != "string" ||
                            typeof(func) != "function"
                        )
                            return;
                        var info = null;
                        route = derech + "/" + route;

                        
                        info = getAwtsmoosDerechVariables(route, originalPath);
                        if(
                            !info ||
                            !info.doesRouteMatchURL
                        ) {
                            return;
                        }
                        try {
                            

                            var rez = await func(info?info.vars : null);
                            
                            otherDynamics.push(
                                {
                                    route,
                                    result:rez,
                                    vars: info.vars,
                                    doesMatch: info.doesRouteMatchURL
                                }
                            );

                        } catch(e) {
                            console.log(e)
                        }

                        
                    }

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
                                od.doesMatch
                            ) {
                                didThisPath = true;
                                
                                await doAwtsmoosResponse(
                                    od.result
                                );
                                return didThisPath;
                            } else {
                                
                            }
                        }
                    }


                    

                    return await doAwtsmoosResponse(dyn);


                }
            }

            
            return didThisPath;
        }

        
        
        function getAwtsmoosDerechVariables(url, basePath) {
            if(
                typeof(url) != "string" ||
                typeof(basePath) != "string"
            )
                return null;
            
            var vars = {};
            var doesRouteMatchURL = true;
            var sp = url.substring(1).split("/").filter(q=>q)
                .map(q=>q.trim());
            var op = basePath.substring(1).split("/").filter(q=>q)
                .map(q=>q.trim());
            
                
            sp.forEach((w,i) => {
                if(!doesRouteMatchURL) return;
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
                        cor !== sp[i]
                    ) {
                        
                        doesRouteMatchURL = false;
                        return;
                    }
                }
                
            });

            if(op.length != sp.length) {
                doesRouteMatchURL = false;
            }
            
            return {
                vars,
                doesRouteMatchURL
            };

        }

        async function doAwtsmoosResponse(dyn) {
            if(!dyn) {
                return errorMessage();
            }
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
                ended = true;
                r = setProperContent(r, m);
                
                response.end(r);
                
                return;
            } catch(e) {
                console.log(e);
            }
        }

        async function doFileResponse() {

			try {
				let content;
                console.log("ASD")
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
                ended = true;
                
                return;
			} catch (errors) {
				// If there was an error, send a 500 response and log the error
				console.error(errors);
				return errorMessage(
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
            
            if(contentType) {
                response.setHeader('Content-Type', contentType);
                
            }
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
                base64ify: str => {
                    try {
                        return Buffer.from(str).toString("base64");
                    } catch(e) {
                        return null;
                    }
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
                mimeTypes,
                binaryMimeTypes,
                path,
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