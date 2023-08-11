/**
 * B"H
 * an API to get
 * files from the "public" folder
 * in the DB if it exists.
 */

module.exports = {
    dynamicRoutes: async info => {
        if(info.request.method.toLowerCase() == "post")
            await info.use({
                "/": async vars => {
                    
                    var pth = info.$_POST.path;
                    if(typeof(pth) !== "string")
                        return {
                            response: {
                                one: "two"
                            }
                        }
                    var fl;
                    try {
                        fl = await info.db.get("public/"+pth);
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