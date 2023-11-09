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
                "/api/social/heichelos/"
                +v.heichel
            )
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
        "/:heichel/post/:post": async v => {
            var post = await $i.fetchAwtsmoos(
                "/api/social/heichelos/"
                +v.heichel +
                "/posts" + v.post
            );
            if(post) {
                
            }
        }
    })
}