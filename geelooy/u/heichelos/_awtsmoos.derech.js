/**
 * B"H
 * Dynamic endpoint for
 * getting posts in current heichel.
 */

module.exports.dynamicRoutes = async info => {
    
    await info.use({
        "/:heichel/posts/:post": async vars => {
            var p = await info.$ga(
                "_awtsmoos.post.html", {
                    heichel: vars.heichel,
                    post: vars.post
                }
            )
            return p;
        },
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
                    heichel: vars.heichel
                }
            )   
            return p
        },
        
    })
};