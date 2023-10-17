/**
 * B"H
 */

const di= require("./DependencyInjector.js")

class TemplateObjectGenerator {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.dependencies.me = this;
    }
    
   
    async getTemplateObject(ob={}) {
        
        return di.execute({
            base: _getTemplateObject,
            params: {
                ob: {
                    ...ob
                    
                },
            },
            
            dependencies:this.dependencies
        })
    }

    
}

async function _getTemplateObject(ob) {

    
    const getT /*get template content*/
    
    = async (path, vars) => {
        var pth = self.directory + "/templates/" + path;
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
    const getA =
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
    
    return ({ // Await processTemplate
        DosDB,
        require,
        request,
        setHeader: (nm, vl) => {
            response.setHeader(nm, vl);
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
        getT,
        getA,
        fetchAwtsmoos,
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
module.exports = TemplateObjectGenerator;