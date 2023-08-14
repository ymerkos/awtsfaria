/**
 * B"H
 * an API to get
 * files from the "public" folder
 * in the DB if it exists.
 */

module.exports = {
    dynamicRoutes: async info => {
       
            await info.use({
                "/": async vars => {
                    
                    var pth = info.$_GET.path;
                    if(typeof(pth) !== "string")
                        return {
                            response: {
                                one: "two"
                            }
                        }
                    pth = info.Utils.sanitizePath(pth);
                    var fl;
                    try {
                        var pubPath = info.path.join("public", pth)
                        fl = await info.db.get(pubPath);
                    } catch(e){}

                    if(!fl) {
                        return {
                            response: {
                                not: "found"
                            }
                        }
                    } else {
                       
                        var ex = info.path.extname(pth)
                        var mi = info.mimeTypes[ex];
                        
                        return {
                            mimeType: mi,
                            response: fl
                            
                        }
                    }
                }
            });
    }
}