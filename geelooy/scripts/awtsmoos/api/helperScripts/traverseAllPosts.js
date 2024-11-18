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
    callback
}) {
    var rootSubSeries = await get(`${
        base
    }/heichelos/${heichelId}/series/${seriesId}/series`)
    var rootPosts = await get(base+
        `/heichelos/${heichelId}/series/${seriesId}/posts`
    );

    for(var rootPost of rootPosts) {
        if(typeof(callback) == "function") {
            await callback({post: rootPost, seriesId})
        }
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
