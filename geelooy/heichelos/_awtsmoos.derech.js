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
        "/:heichel/delete": async v => {
           
            var al = $i.$_GET.editingAlias;
            
            var contentID = $i.$_GET.id;
            var type = $i.$_GET.type;
            var baseE = `/api/social/heichelos/${
                v.heichel
            }`;
            
            var $sd = getDetails();
            $sd.parentSeriesId = $i.$_GET.parentSeriesId;
            $sd.contentID = contentID;
            $sd.type = type;
            $sd.baseE = baseE;
            $sd.id = $i.$_GET.id;
            $sd.aliasID = al,
            $sd.heichel = v.heichel;
            var p = await $i.$ga(
                "_awtsmoos.deleteEntry.html", {
                    heichel:v.heichel,
                    aliasID:al,
                    seriesId:$sd.parentSeriesId,
                    $$sd: $sd
                }
            );
            return p;

        },
        "/:heichel/edit": async v => {
            var al = $i.$_GET.editingAlias;
            
            var aliases = [];
            if(al) {
                var fullAll = await $i.fetchAwtsmoos(
                    `/api/social/aliases/${al}`
                );
                fullAll.id=al
                aliases.push(fullAll)
            } else {
                var ali = await $i.fetchAwtsmoos(
                    `/api/social/aliases/details`
                );

                if(Array.isArray(ali)) {
                    aliases = ali
                }
            }
            var contentID = $i.$_GET.id;
            var action = "edit";
            var type = $i.$_GET.type;
            var baseE = `/api/social/heichelos/${
                v.heichel
            }`;
            var currentPath = type =="post"
                ?`${
                    baseE
                }/post/${
                    contentID
                }`:
                `${baseE}/series/${contentID}/details`;
            var current = await $i.fetchAwtsmoos(
                currentPath
            );
            var endpoint = type=="post" ? 
            `${
             baseE   
            }/post/${
                contentID
            }` : `${
                baseE
            }/`;

            var method = "PUT";
            var $sd = getDetails();
            $sd.action = action;
            $sd.endpoint = endpoint;
            $sd.method = method;
            $sd.contentID = contentID;
            $sd.parentSeriesId = $i.$_GET.parentSeriesId;
            $sd.current = current;
            var p = await $i.$ga(
                "_awtsmoos.submitToHeichel.html", {
                    heichel:v.heichel,
                    aliasIDs:aliases,
                    series:$sd.parentSeriesId,
                    $$sd: $sd
                }
            );
            return p;
        },
        "/:heichel/submit": async v => {
            var getAliasIDs = await $i.fetchAwtsmoos(
                `/api/social/aliases/details`
            );

            var aliasIDs = null;

            if(!getAliasIDs.error && Array.isArray(getAliasIDs)) {
                aliasIDs = getAliasIDs
            }

             var zr=$i.$_GET.series||
                 $i
                .$_GET.seriesId;
            
            var $sd = getDetails();
            var n=$sd.type=="post"?"posts":
                "addNewSeries"

            $sd.endpoint=`/api/social/heichelos/${
                v.heichel
            }/${n}`;
            $sd.method = "POST";

            var p = await $i.$ga(
                "_awtsmoos.submitToHeichel.html", {
                    heichel:v.heichel,
                    aliasIDs,
                    series:zr||"root",
                    $$sd: $sd
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
    });

    function getDetails() {
        var t = $i.$_GET.type;
        var $sd = {}; 
        if(t == "post" || t == "series") {
            $sd.type = t;
            $sd.ttitle = $sd.type[0]
            .toUpperCase() +
                $sd.type.substring(1);
            $sd.tdesc = $sd.type == "post" ? "content" 
            : "description";
        } 
        
        $sd.returnURL = $i.$_GET.returnURL;
        return $sd
    }
}
