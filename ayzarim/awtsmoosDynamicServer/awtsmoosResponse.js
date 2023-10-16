/**
 * B"H
 */

let {
    
    getProperContent,
    
    errorMessage,
    foundAwtsmooses,
    path,
    self,
    fs,
    awtsMoosification,
    getTemplateObject,
    originalPath,
    filePath
} = safeInit();
/**
 * @class AwtsmoosResponse
 * This class provides methods to handle awtsmooses and generate appropriate responses.
 */
class AwtsmoosResponse {
    ended = false;
    /**
     * @constructor
     * @param {object} vars - An object containing various configurations and settings.
     */
    constructor(vars) {
        
        ({
            
            getProperContent,
            
            
            errorMessage,
            foundAwtsmooses,
            path,
            fs,
            self,
            awtsMoosification,
            getTemplateObject,
            
            originalPath,
            filePath
        } = vars); 
    }

    /**
     * Process and evaluate awtsmooses.
     * @async
     * @returns {object} Information about the processed path.
     */
    async doAwtsmooses({
        foundAwtsmooses,
        filePath
    } = {}) {
        
        this.ended = false;

        const didThisPath = {
            c: false,
            wow: {},
            m: {},
            time: new Date(),
            awtsmooseem: []
        };

        if(filePath.includes("favicon")) {
            
            return didThisPath;
        }

        const otherDynamics = [];
        
        for (const awtsmoos of foundAwtsmooses) {
            didThisPath.awtsmooseem.push(awtsmoos);

            try {
                const derech = path.join(awtsmoos + "/" + awtsMoosification);
                didThisPath.derech = derech;
                
                const awts = require(derech);
                const baseDerech = "/" + awtsmoos;

                // Calculate path information for the current module
                const modulePath = path.dirname(derech);
                const relativeChildPath = path.relative(modulePath, filePath);
                const childPathUrl = "/" + relativeChildPath.replace(/\\/g, '/');

                didThisPath.moose = childPathUrl;

                const dynam = awts.dynamicRoutes || awts;

                if (typeof dynam !== 'function') continue;

                const templateObject = await getTemplateObject({
                    derech,
                    use: async (route, func) => {
                        // Handle dynamic routes
                        return await 
                        this.handleDynamicRoutes
                        (route, func, childPathUrl, didThisPath, otherDynamics);
                    },
                });
                
                await dynam(templateObject);
                
                for (const od of otherDynamics) {
                    if (od.doesMatch) {
                        didThisPath.c = true;

                        var resp = await 
                        this.doAwtsmoosResponse
                        (od.result, derech);

                        didThisPath.responseInfo = resp;
                        
                        return didThisPath;
                    }
                }

                if (!didThisPath.c) {
                    
                    didThisPath.invalidRoute = true;
                }

                return didThisPath;
            } catch (e) {
                didThisPath.error = e + "";
                console.log(e);
            }
        }

        return didThisPath;
    }

    /**
     * Handles dynamic routes.
     * @async
     * @param {string|object} route - The route or an object containing multiple routes.
     * @param {function} func - The function associated with the route.
     * @param {string} childPathUrl - The URL path of the child.
     * @param {object} didThisPath - An object to store information about the processed path.
     * @param {array} otherDynamics - An array to store information about other dynamic routes.
     * @returns {Promise<boolean>} A promise that resolves to true if a match is found.
     */
    async handleDynamicRoutes(route, func, childPathUrl, didThisPath, otherDynamics) {
        if (typeof route === "string") {
            return await this.processDynamicRoute
            (route, func, childPathUrl, didThisPath, otherDynamics);
        } else if (route && typeof route === "object") {
            for (const [rt, fnc] of Object.entries(route)) {
                const matches = await this.processDynamicRoute
                (rt, fnc, childPathUrl, didThisPath, otherDynamics);
                if (matches) return true;
            }
        }

        return false;
    }

    /**
     * Process a single dynamic route.
     * @async
     * @param {string} route - The route string.
     * @param {function} func - The function associated with the route.
     * @param {string} childPathUrl - The URL path of the child.
     * @param {object} didThisPath - An object to store information about the processed path.
     * @param {array} otherDynamics - An array to store information about other dynamic routes.
     * @returns {Promise<boolean>} A promise that resolves to true if a match is found.
     */
    async processDynamicRoute(route, func, childPathUrl, didThisPath, otherDynamics) {
        const fullPath = path.join(childPathUrl, route).replace(/\\/g, '/');
        const info = this.getAwtsmoosDerechVariables(route, childPathUrl);

        if (info && info.doesRouteMatchURL) {
            try {
                const rez = await func(info.vars);
                otherDynamics.push({
                    route: fullPath,
                    matches: true,
                    shortRoute: route,
                    result: rez,
                    vars: info.vars,
                    doesMatch: info.doesRouteMatchURL
                });

                return true;
            } catch (e) {
                otherDynamics.push({
                    error: e + "",
                    route,
                    anIssueOccuredInFuncButMaybeMatches:true,
                    fullPath,
                    info
                });
                console.log(e);
                return false;
            }
        } else {
            otherDynamics.push({
                route,
                fullPath,
                ProbablyDoesntMatch:true,
                info
            });
            return false;
        }
    }
    
      /**
     * @description Extracts parameters from a URL path based on a given template path.
     * @param {string} url - The URL to extract parameters from.
     * @param {string} basePath - The template path with placeholders.
     * @returns {Object|null} - Returns an object with extracted parameters and a flag indicating if the URL matches the basePath or null if inputs are invalid.
     */
      getAwtsmoosDerechVariables(url, basePath) {
        // Ensure that the inputs are valid
        if (typeof url !== "string" || typeof basePath !== "string") return null;
        
        let vars = {};
        let doesRouteMatchURL = true;
        
        // Convert paths to use consistent forward slashes for cross-platform compatibility
        url = url.replace(/\\/g, '/');
        basePath = basePath.replace(/\\/g, '/');
        
        const urlSegments = url.split("/").filter(Boolean);
        const basePathSegments = basePath.split("/").filter(Boolean);
        
        // Check segment length for both paths
        if (basePathSegments.length !== urlSegments.length) {
            return {
                vars,
                doesRouteMatchURL: false
            };
        }
        
        // Extract parameters from URL based on the given basePath
        for (let i = 0; i < urlSegments.length; i++) {
            if (urlSegments[i].startsWith(":")) {
                vars[urlSegments[i].substring(1)] = basePathSegments[i];
            } else if (urlSegments[i] !== basePathSegments[i]) {
                doesRouteMatchURL = false;
                break;
            }
        }
        
        return {
            vars,
            doesRouteMatchURL
        };
    }
    
    /**
     * @description Handles the response for a matched route.
     * @param {Object} dyn - The dynamic route information.
     * @param {string} path - The matched path.
     * @returns {boolean} - Indicates success or failure.
     */
    async doAwtsmoosResponse(dyn, path) {
        var responseType = "";
        var actualResponse = null;
        
        if (dyn === undefined) {
            return errorMessage({
                notFound: path
            });
        }

        let r = dyn.response || dyn;

        // Extract mime type from the dynamic route information
        let m = dyn.mimeType;
        if (m && typeof(m) === "string") {
            try {
                responseType = m;
            } catch (e) {
                console.log("Rpoblem with header", e)
            }
        }
        
        
        // Process and send the response if it hasn't been ended yet
        try {
            r = getProperContent(r, m);
            this.ended = true;
            actualResponse  = r;
            
          
           
        } catch (e) {
            console.log(e);
        }

        return {
            responseType,
            actualResponse
        };
    }

    /**
     * @description Checks if the given path matches any Awtsmoos route definitions.
     * @returns {Array} - A list of matching Awtsmoos routes.
     */
    async getAwtsmoosInfo(sourcePath) {
        var checkedPath = sourcePath;
        if(sourcePath.includes("favicon")) {
            
            return []
        } 
        
        let myFoundAwtsmooses = [];
        let paths = checkedPath.replaceAll
        ("\\","/").split("/")
        .filter(w => w);

        /**
         * @description Recursive function to check all possible routes.
         */
        async function checkAwtsmoosDracheem() {
            try {
                let derech = path
                .join
                (
                    
                    checkedPath + 
                    "/" + 
                    awtsMoosification
                );
                
                let moos = await 
                    fs.stat(
                        derech
                    );
                if (
                    moos && 
                    !moos.isDirectory()
                ) {
                    
                    myFoundAwtsmooses
                    .push(checkedPath);
                } else {
                    
                }
            } catch (e) {
                if(e.code != "ENOENT")
                    console.log("Eror",e)
                paths.pop();
                checkedPath = paths
                .join("/");
                paths = checkedPath
                .split("/").filter(w => w);
                if (paths.length) 
                    await 
                    checkAwtsmoosDracheem();
            }
        }
        
        await checkAwtsmoosDracheem();
        foundAwtsmooses = myFoundAwtsmooses;
        return myFoundAwtsmooses;
    }
}

module.exports = AwtsmoosResponse;

function safeInit(initialValues = {}) {
    return new Proxy(initialValues, {
      get: (target, name) => {
        if (name in target) {
          return target[name];
        } else {
          return undefined;
        }
      }
    });
  }