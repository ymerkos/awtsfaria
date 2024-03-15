/*B"H*/


export {
    getHeichelDetails,
    getAliasName,
    getSeries,
    getPost,
    getAPI,

    makePost,
    makeSeries,

    appendHTML,
    loadJSON
}


function loadJSON() {
    return new Promise(async (r,j) => {
        var ip = document.createElement("input")
        ip.type="file"
        ip.onchange = async () => {
            try {
                var g = await fetch(URL.createObjectURL(ip.files[0]));
                var h = await g.json()
                ip.parentNode.removeChild(ip)
                r(h)
            } catch(e){r(null)}
        }
        document.body.appendChild(ip)
        ip.click()
    })
    
}
function appendHTML(html, par) {
    var d = document.createElement("div");
    d.innerHTML = html;
    d.children.forEach(w => par.appendChild(w))
}
var base = "https://awtsmoos.com"
async function makeSeries({
    seriesName,
    heichelId,
    aliasId,
    description,
    parentSeries
}) {
    var resp = await getAPI(`${base}/api/social/heichelos/${
        heichelId
    }/addNewSeries`, {
        method: "POST",
        body: new URLSearchParams({
            aliasId,
            description,
            title: seriesName,
            heichel: heichelId,
            parentSeriesId: parentSeries || "root"
        })
    });
    return resp;
}

async function makePost({
    postName,
    heichelId,
    aliasId,
    sections,
    content= "",
    parentSeries
}) {
    var ob = {
        aliasId,
        title: postName,
        content,
        
        heichel: heichelId,
        parentSeriesId: parentSeries || "root"
    }
    if(sections && Array.isArray(sections)) {
        ob.dayuh = JSON.stringify({
            sections
        })
    } 

    var body = new URLSearchParams(ob)
    console.log(body, ob)
    var resp = await getAPI(`${base}/api/social/heichelos/${
        heichelId
    }/posts`, {
        method: "POST",
        body
    });
    return resp;
}


async function getAPI(url, options) {
    try {
        var r = await fetch(url, options)
        var t = await r.text();
        try {
            t = JSON.parse(t)
        } catch(e){}
        return t;
    } catch(e) {
        return null;
    }
}




async function getHeichelDetails(heichelId) {
    return await getAPI(`${base}/api/social/heichelos/${
        heichelId
    }`)
}

async function getAliasName(alias) {
    return await getAPI(`${base}/api/social/aliases/${
        alias
    }`)
}
async function getSeries(id) {
    var seriesData = await getAPI(
        `${base}/api/social/heichelos/${
            heichel
        }/series/${parentSeries}/details` 
    );
    return seriesData;
}
async function getPost(parentSeries, index, heichel) {
    

    var p = parentSeries.posts[index];
    if(!p) return null;

    var postInfo =  await getAPI(
        `${base}/api/social/heichelos/${
            heichel
        }/post/${p}` 
    );

    return postInfo

}
