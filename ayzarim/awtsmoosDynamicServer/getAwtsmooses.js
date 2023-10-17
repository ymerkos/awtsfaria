/**
 * B"H
 * Some helper functions 
 * to mock requests 
 * and get template files
 */

class Ayzarim {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.dependencies.fetchAwtsmoos = 
        this.fetchAwtsmoos.bind(this)
        this.server = dependencies.self;
    }

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
    async fetchAwtsmoos (path, opts) {
        if(!opts) opts = {}
            
        // Mock request object
        const mockRequest = {
            url: path,
            method: opts.method || 'GET',
            headers: {
                cookie: opts.cookies || ''
            },
            on: (eventName, callback) => {
                // Simulating request events for methods like POST/PUT
                if (eventName === 'data') {
                    if (opts.body) {
                        const dataChunks = typeof opts.body === 'string' ? [opts.body] : opts.body;
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
        const mockResponse = {
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
            await this.server.onRequest(mockRequest, mockResponse);
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



    async doEverything() {
        return (doEverything.bind(this))()
    }
}

async function getPathInfo() {
	with(this.dependencies) {
                
                
        awtsRes.ended = false;
        var doesNotExist = false;

        filePaths = filePath.split("/")
            .filter(q => q)
            .join("")
            .split("\\")
            .filter(w => w)
        
        fileName = filePaths[filePaths.length - 1];
        
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
                        if (Object.keys(parsedUrl.query)
                            .length > 0) {
                            redirectUrl += '?' + new url.URLSearchParams(parsedUrl.query)
                                .toString();
                        }
                        
                        // Check if a hash fragment exists
                        if (parsedUrl.hash) {
                            redirectUrl += parsedUrl.hash;
                        }
                        
                        response.writeHead(301, {
                            Location: redirectUrl
                        });
                        
                        response.end();
                        awtsRes.ended = true;
                        return false;
                        
                    }
                    isDirectoryWithIndex = true;
                    fileName = "index.html";
                } else {
                    isDirectoryWithoutIndex = true;
                    awtsRes.ended = false;
                    
                }
            } else if (st) {
                
                isRealFile = true;
                awtsRes.ended = false;
                
            }
        } catch (err) {
            doesNotExist = true;
            if(err.code != "ENOENT")
            console.log("Issue?",err)
            // stat call failed, file or directory does not exist
        }
        
        awtsRes.ended = false;
        var isReal = (
            !doesNotExist
        );
        var isDynamic = !isReal;
        if(isDynamic) {

            
            foundAwtsmooses = await awtsRes.getAwtsmoosInfo(filePath);
            
        }
        return (
            !!foundAwtsmooses.length ||
            isReal
        );
    }
}

async function doEverything() {
    
    with(this.dependencies) {

        
        var iExist = await (getPathInfo.bind(this))();
        
        if (!iExist) {
            
            
            if(fileName.startsWith("@")) {
                var tr = "/@/"+fileName.substring(1)
                
                
                var res = await (fetchAwtsmoos.bind(this))(
                    tr, {
                        superSecret: true
                    }
                )
                
                response.end(res)
                return
            }



            return errorMessage({
                message: "Dynamic route not found",
                code: "DYN_ROUTE_NOT_FOUND",
                info: {
                    filePath
                }
            });
        }
        
        if (isDirectoryWithIndex) {
            contentType = "text/html";
        }
        
        var didThisPathAlready = false;
        
        if (request.method.toUpperCase() == "POST") {
            await getPostData();
        }
        
        if (request.method.toUpperCase() == "PUT") {
            await getPutData();
        }
        
        if (request.method.toUpperCase() == "DELETE") {
            await getDeleteData();
        }
        
        if (
            foundAwtsmooses.length &&
            !isDirectoryWithIndex
        ) {
            
            didThisPathAlready = await 
            awtsRes.doAwtsmooses({
                foundAwtsmooses,
                filePath,
                extraInfo: {
                    fetchAwtsmoos
                }
            });

            
        }
        
        if(
            didThisPathAlready === false
        ) {
            if (
            
                isDirectoryWithIndex ||
                isRealFile
                
            ) {
                
                var startsWithAw = fileName.startsWith("_awtsmoos")
                
                if (
                    !startsWithAw ||
                    request.superSecret
                ) {

                    
                        
                        return await doFileResponse();
                
                } else {
                    return errorMessage(
                        "You're not allowed to see that!"
                    )
                }
                
            } else {
                return errorMessage({
                    message: "Invalid Dynamic Route",
                    code: "INVALID_DYNAMIC_ROUTE"
                    
                })
                
            }
            
        }
        
        
        if (didThisPathAlready.c) {
            var res = didThisPathAlready
                .responseInfo;
                
            try {
                
                if(!res.actualResponse) {
                    return errorMessage({
                        message:"No actual response",
                        code:"NO_AC_RES",
                        info:res,
                        details:didThisPathAlready
                    })
                }
                if(res.actualResponse
                    .contentType) {
                    response.setHeader(
                        "content-type",
                        res.actualResponse
                        .contentType
                    );
                }
                

                if(res.actualResponse.content) {
                    response.end(
                        res.actualResponse.content
                    )
                } else {

                    return errorMessage({
                        message: "No Awtsmoos Response",
                        code: "NO_AWTS_RESP"
                    });
                }
            } catch(e){
                console.log("Problem", e)
            }
            return;
        } else if(didThisPathAlready.invalidRoute) {
            return errorMessage(
                {
                    message: "Invalid Route",
                    code: "INVALID_ROUTE"
                }
            )
        } else if(didThisPathAlready.isPrivate) {
            return errorMessage({
                message: "That's a private route",
                code: "PRIVATE_ROUTE"
            })
        } else {
            return errorMessage({
                message: "Did not find route",
                code: "NOT_FOUND"
            })
        }

    }


}
module.exports = Ayzarim;