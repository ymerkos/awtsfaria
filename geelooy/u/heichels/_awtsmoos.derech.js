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
        "/:heichel": async vars => {
            var p = await info.$ga(
                "_awtsmoos.posts.html", {
                    heichela: vars.heichel
                }
            )
            
            
            return p
        },
    })
};