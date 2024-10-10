/**
 * B"H
 */

var di= require("./DependencyInjector.js")

class TemplateObjectGenerator {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.dependencies.me = this;
    }
    
    test=3
    /**
     * @method fetchAwtsmoos gets the
     * result as if one makes a request to
     * this path
     * @param {String} path 
     * @param {Object} opts 
     * 		@params of opts:
     * 		- method: 'POST', 'GET', etc.
     * 		- body: Data to be passed for POST, PUT, etc.
     * 		- headers: any additional headers
     * 		
     */
    async fetchAwtsmoos(path, opts) {
        if(!opts) opts = {}
        
        var me = this;
        var g = !!(me);
        console.log(g,"OK",path, opts)
        if(!g) {
            me = me.me
        }
        console.log("still me?")
        if(!me.test) return console.log("lo",(me?me.test:8))
        return di.execute({
            base: fetchAwtsmoos,
            params: {
                path, opts
                
            },
            
            dependencies:me.dependencies
        })
    }

    async getTemplateObject(ob={}) {
        
        return di.execute({
            base: _getTemplateObject,
            params: {
                ob: {
                    ...ob
                    
                },
                fetchAwtsmoos: this.fetchAwtsmoos
            },
            
            dependencies:this.dependencies
        })
    }

    
}


async function fetchAwtsmoos (path, opts) {
    if(!opts) opts = {}
        
    // Mock request object
    var mockRequest = {
        url: path,
        method: opts.method || 'GET',
        headers: {
            cookie: opts.cookies || ''
        },
        on: (eventName, callback) => {
            // Simulating request events for methods like POST/PUT
            if (eventName === 'data') {
                if (opts.body) {
                    var dataChunks = typeof opts.body === 'string' ? [opts.body] : opts.body;
                    dataChunks.forEach(chunk => callback(chunk));
                }
            } else if (eventName === 'end') {
                callback();
            }
        }
    };

    var _data = "";
    var _responseHeaders = {};
    // Mock response object
    
    var mockResponse = {
        _data: '',
        setHeader: (name, value) => {
            if(typeof(name) == "string") {
                name = name.toLowerCase();
            } else return;

             _responseHeaders
            [name] = value
            // For this mock, we won't do anything with headers
            // but in a real server, this sets HTTP headers for the response
        },
        end: function(data) {
            _data += data;
        },
        get data() {
            return _data;
        }
    };
    
    try {
        // Invoke onRequest function
        await self.onRequest(mockRequest, mockResponse);
    } catch(e) {
        console.log(e)
    }

    var d = mockResponse.data;
    var ct = _responseHeaders["content-type"]
    if(ct && ct.includes("json")) {
        try {
            d = JSON.parse(d)
        } catch(e) {

        }
    }

    
    return d;
};

async function _getTemplateObject(ob) {

    
    var getT /*get template content*/
    
    = async (path, vars) => {
        var temps = config.templateDir ||
            "templates"
        var pth = self.directory + "/" + 
            temps + "/" 
            + path;
            
        var fl;
        var temp;
        try {
            fl = await fs.readFile(pth);
        } catch (e) {
            return null;
        }
        if (fl) {
            temp = await template(
                fl + "",
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
    var getA =
        async (pathToFile, vars) => {
            var derechPath = typeof(ob.derech) ==
                "string" ? ob.derech : null;
            
            // Use path.dirname to get the parent directory of derechPath
            var derechParent = derechPath ?
                path.dirname(derechPath) : null;
            
            // Use path.join to safely concatenate paths
            var pth = path.join(derechParent || parentPath, pathToFile);
            
            var fl;
            var temp;
            try {
                fl = await fs.readFile(pth);
                
            } catch (e) {
                console.log("Error: ", e)
                return null;
            }
            if (fl) {
                temp = await template(
                    fl + "",
                    vars
                );
                return temp;
            }
            
            return null;
        };
    
    if (typeof(ob) != "object" || !ob)
        ob = {};
    
    function fetchIt(urlString, options = {}) {
        return new Promise((resolve, reject) => {
            const url = new URL(urlString);
            const protocol = url.protocol === 'https:' ? https : http;
        
            // Parse options
            const { method = 'GET', headers = {}, body } = options;
        
            // Prepare request options
            const requestOptions = {
            method: method.toUpperCase(),
            headers: headers,
            };
        
            // If there's a body, add it to request options
            if (body) {
            requestOptions.headers['Content-Length'] = Buffer.byteLength(body);
            }
        
            // Send request
            const req = protocol.request(url, requestOptions, (res) => {
            let responseData = '';
        
            res.on('data', (chunk) => {
                responseData += chunk;
            });
        
            res.on('end', () => {
                resolve({
                ok: res.statusCode >= 200 && res.statusCode < 300,
                status: res.statusCode,
                statusText: res.statusMessage,
                headers: res.headers,
                text: () => Promise.resolve(responseData),
                json: () => Promise.resolve(JSON.parse(responseData)),
                });
            });
            });
        
            req.on('error', (error) => {
            reject(error);
            });
        
            // If there's a body, write it to the request
            if (body) {
            req.write(body);
            }
        
            req.end();
        });
        }
    return ({ // Await processTemplate
        DosDB,
        require,
        request,
        setHeader: (nm, vl) => {
            response.setHeader(nm, vl);
            //console.log("Header",nm,vl)
        },
        base64ify: str => {
            try {
                return Buffer.from(str)
                    .toString("base64");
            } catch (e) {
                return null;
            }
        },
        response,
        console: {
            log: (...args) => console.log(args)
        },
        db: self.db,
        parsedUrl,
        location,
        getT,
        btoa, atob,
        getA,
        fetchAwtsmoos,
        fetchIt,
        fetch,
        TextEncoder,
        $ga: getA,
        __awtsdir: self.directory,
        setStatus: status => response.statusCode = status,
        template,
        process,
        mimeTypes,
        binaryMimeTypes,
        path,
        server: self,
        getHeaders: () => request.headers,
        path,
        URLSearchParams,
        url,
        sodos,
        fs,
        cookies,
        setCookie: (nm,val)=>{
            try {
                var encoded = encodeURIComponent(val);
            response.setHeader(
                "set-cookie",
                `${nm}=${encoded}; HttpOnly; `+
                "max-age="+(60*60*24*365) + "; "
                + "Path=/;"
            );
                return {success: true}

            } catch(e) {
                return {error: e+""};

            }

        },
        removeCookie:nm => {
            response.setHeader(
                "set-cookie",
                `${nm}=; HttpOnly; `+
                "max-age=0; "
                + "Path=/;"
            );
        },
        makeToken,
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
module.exports = TemplateObjectGenerator;
