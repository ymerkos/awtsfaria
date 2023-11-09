/**
 * B"H
 * Dynamic endpoint for
 * getting posts in current heichel.
 */

module.exports.dynamicRoutes = async info => {
    
    await info.use({
        
        "/:heichel/posts": async vars => {
            var posts = await info.$ga(
                "_awtsmoos.posts.html", {
                    heichel:vars.heichel
                }
            )
                
            
            return posts;
        },
        /*
        "/:heichel": async vars => {
            var getHeichel = await info.fetchAwtsmoos(
                `/api/social/heichelos/${
                    vars.heichel
                }`
            )
            var p = null;
            if(getHeichel)
                var p = await info.$ga(
                    "_awtsmoos.heichel.html", {
                        heichelID: vars.heichel,
                        heichel:getHeichel
                    }
                );
            else {

            }
            return p
        },*/
        
    })
};