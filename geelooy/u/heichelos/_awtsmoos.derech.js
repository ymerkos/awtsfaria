/**
 * B"H
 * Dynamic endpoint for
 * getting posts in current heichel.
 */

module.exports.dynamicRoutes = async info => {
    
    await info.use({
        "/:heichel/posts/:post": async vars => {
            

            var g = await info.fetchAwtsmoos(
                `/api/social/heichelos/${
                    vars.heichel
                }/posts/${
                    vars.post
                }`
            );

            var heichelDetails = await info.fetchAwtsmoos(
                `/api/social/heichelos/${
                    vars.heichel
                }`
            );

            var aliasDetails = await info.fetchAwtsmoos(
                `/api/social/aliases/${
                    g.author
                }`
            )
            
            if(heichelDetails) {
                heichelDetails.id = vars.heichel;
            }

            
            var postInfo = g;
            if(postInfo) {
                postInfo.id = vars.post
                postInfo.heichel = heichelDetails
            }
            var p = await info.$ga(
                "_awtsmoos.post.html", {
                    heichel: heichelDetails,
                    post: postInfo,
                    alias:aliasDetails
                }
            );
            
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
        },
        
    })
};