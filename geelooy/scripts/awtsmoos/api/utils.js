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
    loadJSON,
    traverseTanachAndMakeAwtsmoos
}


function loadJSON() {
    return new Promise(async (r,j) => {
        var ip = document.createElement("input")
        ip.style.position="fixed"
        ip.style.zIndex="123901283901290391302123"
        ip.style.left="25px"
        ip.style.top="26px"
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
async function getSeries(id, heichel) {
    var seriesData = await getAPI(
        `${base}/api/social/heichelos/${
            heichel
        }/series/${id}/details` 
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



//B"H
async function traverseTanachAndMakeAwtsmoos(t, cb) {
	for(var i = 0; i < t.length; i++){
			//categories
			var tt = t[i].title;
			console.log(tt)
			for(var k = 0; k < t[i].books.length; k++) {
				//books
				var bookName = t[i].books[k].link.title
				console.log("Books for",tt,": ",bookName)
				for(var c = 0; c < t[i].books[k].content.length; c++) {
					//chapters
					var chap = t[i].books[k].content[c]
					var verses = chap.content.verses
					console.log("Chapter",c,chap,"for book",bookName,"in cate",tt)
					if(typeof(cb) == "function") {
                        await cb({
                            book: t[i].books[k],
                            category: t[i],
                            chapter: t[i].books[k].content[c],
                            verses
                        })
                    }
					
				}
			}
	}
}