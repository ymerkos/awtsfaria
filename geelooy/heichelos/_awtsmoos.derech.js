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
                    "./heichel/_awtsmoos.heichel.html", {
                        heichel:hch
                    }
                )
            else return $i.$ga(
                "_awtsmoos.heichelNotFound.html"
            )
        },
        "/:heichel/delete": async v => {
           
            var al = $i.$_GET.editingAlias;
            var doesOwn = await $i.fetchAwtsmoos(
                `/api/social/aliases/${al}/ownership`
            );
            if(!doesOwn || doesOwn.no) {
                return "You don't own the alias "+al+ ", which is needed."
            }
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
                }`: type == "series" ?
                `${baseE}/series/${contentID}/details` : 
                type == "comment" ? 
                `${
                    baseE
                }/comment/${
                    contentID
                }` : null;
            if(!currentPath) {
                return "B\"H<br>There was an issue, no current path found"
            }
            var current = await $i.fetchAwtsmoos(
                currentPath
            );
            var endpoint = type=="post" ? 
            `${
             baseE   
            }/post/${
                contentID
            }` : type == "series" ? `${
                baseE
            }/series/${
                contentID
            }/editSeriesDetails` : 
            type == "comment" ?
            `${
                baseE
            }/comment/${
                contentID
            }` : null
            ;

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
                    series:$sd.parentSeriesId,
                    $$sd: $sd
                }
            );
            return p;
        },
        "/:heichel/submit": async v => {

            var $sd = getDetails();
            var al = $sd.alias;

             var zr=$i.$_GET.series||
                 $i
                .$_GET.seriesId;
            
            
            var n=$sd.type=="comment"?"comments":
                $sd.type == "post"?"posts":
                $sd.type == "series"?
                "addNewSeries":"n"

            $sd.endpoint=`/api/social/heichelos/${
                v.heichel
            }/${n}`;
            $sd.method = "POST";

            var p = await $i.$ga(
                "_awtsmoos.submitToHeichel.html", {
                    heichel:v.heichel,
                  
                    series:zr||"root",

                    $$sd: $sd,
                    endpointType: n
                }
            );
            return p;
        },
        "/:heichel/submitPost": async v => {
            //return "HI";
            
            var p = await $i.$ga(
                "./heichel/submit/_awtsmoos.post.html", {
                    heichel:v.heichel,
                  
                }
            );
            return p;
        },

        "/:heichel/post/:post": async vars => {
            
         
            var g = await $i.fetchAwtsmoos(
                `/api/social/heichelos/${
                    vars.heichel
                }/post/${
                    encodeURIComponent(vars.post)
                }`
            );
          //  console.log("GOT post d",g)

            var hurl= `/api/social/heichelos/${
                    encodeURIComponent(vars.heichel)
                }`;

            var heichelDetails = await $i.fetchAwtsmoos(
                hurl
            );
            

            var aliasDetails = await $i.fetchAwtsmoos(
                `/api/social/aliases/${
                    encodeURIComponent(g.author)
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
                "./post/_awtsmoos.post.html", {
                    heichel: heichelDetails,
                    post: postInfo,
                    alias:aliasDetails
                }
            );
            
            return p;
        },


        "/:heichel/series/:series/:index": async vars => {
            var p = await $i.$ga(
                "./post/_awtsmoos.post.html", {
                    heichel: vars.heichel,
                    parentSeries: vars.series,
                    indexInSeries: vars.index
                }
            );
            return p
        }
    });

    function getDetails() {
        var t = $i.$_GET.type;
        var alias = $i.$_GET.editingAlias;
        var $sd = {}; 
        $sd.alias = alias;
        if(t == "post" || t == "series") {
            $sd.type = t;
            $sd.ttitle = $sd.type[0]
            .toUpperCase() +
                $sd.type.substring(1);
            $sd.tdesc = $sd.type == "post" ? "content" 
            : "description";
        } else if(t == "comment") {
            var par = $i.$_GET.parentType;
            var parId = $i.$_GET.parentId;
            $sd.parentType = par;
            $sd.parentId = parId
            $sd.type = "comment"
            $sd.ttitle = "Comment"
            $sd.tdesc = "content"
        }
        
        $sd.returnURL = $i.$_GET.returnURL;
        return $sd
    }
}
