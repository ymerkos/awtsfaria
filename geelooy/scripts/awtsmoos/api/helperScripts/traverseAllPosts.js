//B"H
//B"H
var base = "/api/social"
async function traverseAllPostsInHeichel({
    heichelId,
    aliasId,
    callback
}) {
    
   
    await traverseAllPostsInSeries({
        seriesId: "root",
        heichelId,
        callback
    })
    
}



async function traverseAllPostsInSeries({
    seriesId,
    heichelId,
    callback,
    startAt={}
}) {
    var startIndex = startAt?.index || 0;
    //var startVerse = startAt?.verse || 0;
    
    var rootSubSeries = await get(`${
        base
    }/heichelos/${heichelId}/series/${seriesId}/series`)
    var rootPosts = await get(base+
        `/heichelos/${heichelId}/series/${seriesId}/posts`
    );
    var postIndex = 0;
    for(var i = startIndex; i < rootPosts.length; i++) {
         var rootPost = rootPosts[i];
        if(typeof(callback) == "function") {
            await callback({post: rootPost, seriesId, index:postIndex, heichelId})
        }
        postIndex++;
    }

    for(var rootSs of rootSubSeries) {
        await traverseAllPostsInSeries({
            seriesId: rootSs,
            heichelId,
            callback
        })
        
    }
}

async function editPost({
    heichelId,
    aliasId,
    postId,
    details={}
}) {
    return await get(
        base+
        `/heichelos/${heichelId}/post/${postId}`, {
            method: "PUT",
            body: new URLSearchParams(details)
        }
    )
}

async function get(url, opts={}) {
    return (await fetch(url, opts)).json()
}

/*
var times  = 0;
await traverseAllPostsInHeichel({
    
    heichelId:"ikar", async callback(r) {
        times++;
        if(times > 5) return console.log("DONE testing")
        k=await editPost({
            postId: r.post,
            heichelId: "testi",
            details: {

                aliasId: "sefarim",
                
                parentSeriesId: r.seriesId,
                dontOverride: true
            }
        })
        console.log("YO",r,k)
    }
})
*/
export {
    traverseAllPostsInSeries,
    traverseAllPostsInHeichel
}
