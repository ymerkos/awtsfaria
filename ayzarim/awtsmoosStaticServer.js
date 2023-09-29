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
                var sec = null;
                
                try  {
                    sec = require(this.directory  + config.secret)
                } catch(e) {}
                if(!sec) sec = {
                    BH:"B\"H",
                    noKey: "There is no security here at all!"
                }
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
        response.setHeader("content-language","en")
		paramKinds.GET = parsedUrl.query; // Get the query parameters

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
            
            if(request.method.toUpperCase() == "POST") {
                await getPostData();
            }

            if(request.method.toUpperCase() == "PUT") {
                await getPutData();
            }

            if(request.method.toUpperCase() == "DELETE") {
                await getDeleteData();
            }
            
            
            if(
                foundAwtsmooses.length && 
                !isDirectoryWithIndex
            ) {
                didThisPathAlready = await doAwtsmooses();
            }
            
            
            
            if(didThisPathAlready.c) {
            
                return;
            }
            

            if(
               
                    isDirectoryWithIndex ||
                    isRealFile
                
            ) {
                
                var startsWithAw=fileName.startsWith("_awtsmoos")
                
                if(
                    !startsWithAw
                ) {
                    
                    return await doFileResponse();
                } else {
                    return errorMessage(
                        "You're not allowed to see that!"
                    )
                }

            }  else {
                errorMessage({
			fileName,
			isDirectoryWithIndex,
			didThisPathAlready,
			isRealFile,
			filePath
		
			
		});
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
                            ended = true;
                            return false;
                            
                        }
                        isDirectoryWithIndex = true;
                        fileName = "index.html";
                    } else {
                        isDirectoryWithoutIndex = true;
                    }
                } else if(st) {
                    isRealFile = true;
                    
                    filePaths = filePath.split("/")
                    .filter(q=>q)
                    .join("")
                    .split("\\")
                    .filter(w=>w)
                    
                    fileName = filePaths[filePaths.length-1];
                    
                }
            } catch (err) {
            // stat call failed, file or directory does not exist
            }


            await getAwtsmoosInfo();
            
            return true;
        }


        function getPostData() {
            return getData();
        }

        function getPutData() {
            return getData("PUT")
        }

        function getDeleteData() {
            return getData("DELETE")
        }

        function getData(method = "POST") {
            return new Promise((r,j) => {
                let paramData = '';
                request.on('data', chunk => {
                    if(request.method.toUpperCase() !== method)
                        return;
                    
                        paramData += chunk;

                    // Check for flood attack or faulty client, "Yetzer Hara" of the digital realm.
                    if (paramData.length > 15e6) {
                        paramData = "";
                        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                        // We show "Din", judgement, by cutting off the request.
                        request.socket.destroy();
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
                        ]).map(([key, value]) => {
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
  let didThisPath = { c: false, wow:{},m:{},time: new Date(),awtsmooseem:[] };
		const otherDynamics=[]

  for (const awtsmoos of foundAwtsmooses) {
	  didThisPath.awtsmooseem.push(awtsmoos)
    try {
      const derech = path.join(self.directory, self.mainDir, awtsmoos + "/" + awtsMoosification);
      didThisPath.derech=derech
      const awts = require(derech);
	    const baseDerech="/"+awtsmoos
	    // Assuming filePath is something like "/home/ubuntu/BH/awtsfaria/geelooy/api/social/aliases"
// and derech is the absolute path to the module, e.g., "/home/ubuntu/BH/awtsfaria/geelooy/api/social/_awtsmoos.derech.js"

const modulePath = path.dirname(derech); // Get the directory path of the module
const relativeChildPath = path.relative(modulePath, filePath); // Get the child path relative to the module

// Convert file system path to URL path
const childPathUrl = "/"+relativeChildPath.replace(/\\/g, '/');

	    didThisPath.moose= childPathUrl
	var dynam = awts.dynamicRoutes||
		awts;
      didThisPath.awts=[!!awts,typeof(awts),
		       typeof(awts.dynamicRoutes)]
	    
      if (typeof(dynam) 
	  !== 'function') continue;
      didThisPath.next="hi"

      

      const templateObject = getTemplateObject({
        derech,
        use: async (route, func) => {
		
          if (typeof route === "string") {
		  didThisPath.wow[route] = childPathUrl
            await awtsUse(childPathUrl, route, func);
          } else if (route && typeof route === "object") {
            for (const [rt, fnc] of Object.entries(route)) {
		    didThisPath.wow[rt] = childPathUrl
              await awtsUse(childPathUrl, rt, fnc);
            }
          }
        },
      });
	
	

      await dynam(templateObject);
	    didThisPath.dynamicLength=
		    otherDynamics.length


      for (const od of otherDynamics) {
        didThisPath.od = od;
        if (od.doesMatch) {
          didThisPath.c = true;
          await doAwtsmoosResponse(od.result, derech);
          return didThisPath;
        }
      }

      if (didThisPath.c) return didThisPath;

    } catch (e) {
	didThisPath.error=e+""
      console.log(e);
    }
  }

  return didThisPath;

  async function awtsUse(basePath, route, func) {
	  didThisPath.rootAtion=route+"baseP"
	  didThisPath.m[route]=basePath + " made through "
    if (typeof route !== "string" || typeof func !== "function") {
	    otherDynamics.push({no:8,j:route,$:6})
	    didThisPath.rootl=route
	    return;

    }

    didThisPath.m[route]+="after if "

    const fullPath = path.join(basePath, route).replace(/\\/g, '/');
    const info = getAwtsmoosDerechVariables(basePath, route);
	  didThisPath.m[route]+=" after derech vars "
	  +JSON.stringify(info)

    if (info && info.doesRouteMatchURL) {
      try {
	didThisPath.m[route]+="matches trying function"
        const rez = await func(info.vars);
	didThisPath.m[route]+="did function got result"
        otherDynamics.push({ route: fullPath, basePath, shortRoute: route, result: rez, vars: info.vars, doesMatch: info.doesRouteMatchURL });
        
      } catch (e) {
	otherDynamics.push({
		error:+"",
		basePath,route,fullPath,info

	})
        console.log(e);
      }
    } else {
	otherDynamics.push({
		route,
		fullPath,
		info,
		basePath
		
	

	})

    }
  }
}

function getAwtsmoosDerechVariables(url, basePath) {
    if (typeof url !== "string" || typeof basePath !== "string") return null;

    let vars = {};
    let doesRouteMatchURL = true;

    // Replace backslashes with forward slashes
    url = url.replace(/\\/g, '/');
    basePath = basePath.replace(/\\/g, '/');

    const urlSegments = url.split("/").filter(Boolean);
    const basePathSegments = basePath.split("/").filter(Boolean);

    // Iterate over the longer array to compare segments
    const maxLength = Math.max(urlSegments.length, basePathSegments.length);

    for (let i = 0; i < maxLength; i++) {
        // If one of the arrays is shorter and doesn't contain the index i, it's not a match
        if (i >= urlSegments.length || i >= basePathSegments.length) {
            doesRouteMatchURL = false;
            break;
        }

        if (urlSegments[i].startsWith(":")) {
            // Capture variable from the basePath
            vars[urlSegments[i].substring(1)] = basePathSegments[i];
        } else if (urlSegments[i] !== basePathSegments[i]) {
            // If a non-variable segment doesn’t match, it’s not a match
            doesRouteMatchURL = false;
            break;
        }
    }

    return { vars, doesRouteMatchURL };
}




        




        async function doAwtsmoosResponse(dyn, path) {
           
            if(!dyn) {
                
                return errorMessage({
                    notFound: path
                });
            }

            
            var r = dyn.response;
            if(!r) r = dyn;
            

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
                
                return true;
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
            const getT /*get template content*/
            
            = async (path, vars) => {
                var pth = self.directory+"/templates/" + path;
                var fl;
                var temp;
                try {
                    fl = await fs.readFile(pth);
                } catch(e){
                    return null;
                }
                if(fl) {
                    temp = await template(
                        fl+"",
                        vars
                    );
                    return temp;
                }
                return null;
            }

            /**
             * @method getA (getAwtsmoos)
             * gets a file in current directory
             * as a template.
             * @param {String} path 
             * @param {Object} ob to
             * set as global variables in template
             * @returns 
             */
            const getA =
            async(pathToFile, vars) => {
                var derechPath = typeof(ob.derech) 
                    == "string" ? ob.derech : null;
                
                // Use path.dirname to get the parent directory of derechPath
                var derechParent = derechPath ? 
                    path.dirname(derechPath) : null;
                
                // Use path.join to safely concatenate paths
                var pth = path.join(derechParent || parentPath, pathToFile);
                
                var fl;
                var temp;
                try {
                    fl = await fs.readFile(pth);
                    
                } catch(e){
                    console.log("Error: ",e)
                    return null;
                }
                if(fl) {
                    temp = await template(
                        fl+"",
                        vars
                    );
                    return temp;
                }
                
                return null;
            };

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
                getT,
                getA,
                $ga:getA,
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
                $_POST: paramKinds.POST, // Include the POST parameters in the context
                $_GET: paramKinds.GET // Include the GET parameters in the context
                    ,
                $_PUT: paramKinds.PUT,
                $_DELETE: paramKinds.DELETE,
                config,
                utils: Utils,
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
