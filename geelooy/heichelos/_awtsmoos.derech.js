/**
 * B"H
 */
module.exports = async $i => {
    await $i.use({
        "/": async() => {
            return $i.$ga("_awtsmoos.index.html")
        },
        "/:heichel": async v => {
            var hch = await $i.fetchAwtsmoos(
                `/api/social/alias/${
                    "itDoesntEvenMatter"
                }/heichelos/`
                +v.heichel
            )
            hch.id = v.heichel;
            if(hch)
                return $i.$ga(
                    "_awtsmoos.heichel.html", {
                        heichel:hch
                    }
                )
            else return $i.$ga(
                "_awtsmoos.heichelNotFound.html"
            )
        },
        "/:heichel/submit": async v => {
            var getAliasIDs = await $i.fetchAwtsmoos(
                `/api/social/aliases/details`
            );

            var aliasIDs = null;

            if(!getAliasIDs.error && Array.isArray(getAliasIDs)) {
                aliasIDs = getAliasIDs
            }

             var zr=$i.$_GET.series

            var p = await $i.$ga(
                "_awtsmoos.submitToHeichel.html", {
                    heichel:v.heichel,
                    aliasIDs,
                    series:zr||null
                }
            );
            return p;
        },
        "/:heichel/post/:post": async vars => {
            

            var g = await $i.fetchAwtsmoos(
                `/api/social/heichelos/${
                    vars.heichel
                }/post/${
                    vars.post
                }`
            );

            var hurl= `/api/social/heichelos/${
                    vars.heichel
                }`;

            var heichelDetails = await $i.fetchAwtsmoos(
                hurl
            );
            console. log("heych",hurl,heichelDetails,g.author,"Aug" ,
                        
                        g,vars.post,vars.heichel,"he'll");

            var aliasDetails = await $i.fetchAwtsmoos(
                `/api/social/aliases/${
                    g.author
                }`
            )

            if(aliasDetails) {
                aliasDetails.id = g.author;
                
            }
            
            if(heichelDetails) {
                heichelDetails.id = vars.heichel;
            }

            
            var postInfo = g;
            if(postInfo) {
                postInfo.id = vars.post
                postInfo.heichel = heichelDetails
            }
            var p = await $i.$ga(
                "_awtsmoos.post.html", {
                    heichel: heichelDetails,
                    post: postInfo,
                    alias:aliasDetails
                }
            );
            
            return p;
        },
    })
}
