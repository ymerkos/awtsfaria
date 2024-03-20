/*B"H*/


export {
    getHeichelDetails,
    getAliasName,
    getSeries,
    getPost,
    getAPI,
    aliasOwnership,

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
    var parser = new DOMParser();

    var doc = parser.parseFromString(html, "text/html");
    Array.from(doc.body.childNodes).forEach((node, index, array) => {
        appendWithSubChildren(node, par, array);
    });
}

function appendWithSubChildren(node, parent, array) {
	//console.log("hi",node,parent)
    if (node.tagName === "SCRIPT" && !node.src) {
        try {
            eval(node.innerHTML);
        } catch (error) {
            console.log(error);
        }
    } else {
        if (typeof window.toldafy === "function") {
            window.toldafy(node, array.indexOf(node), array);
        }
        var clonedNode = node.cloneNode(false);
        parent.appendChild(clonedNode);
        if (node.childNodes.length > 0) {
            Array.from(node.childNodes).forEach((childNode) => {
                appendWithSubChildren(childNode, clonedNode, array);
            });
        } 
    }
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

async function aliasOwnership(aliasId, options) {
    try {
        var r = await fetch(base+`/api/social/aliases/${
            aliasId
        }/ownership`, options)
        var t = await r.json();
        return !t.no
    } catch(e) {
        console.log(e)
        return false;
    }
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

//Object { newSeriesID: "BH_1710481450148_745_sefarim", parentId: "root" }
async function batchTanachCreation() {
   //B"H
var baseSeries = "BH_1710373425033_726_sefarim"





//B"H
async function traverseTanachAndMakeAwtsmoos(t, cb) {
	for(var i = 0; i < t.length; i++){
			//categories
			var tt = t[i].title;
			var category = tt;
			var categorySeries = null;
			if(!categorySeries) {
				var cu = await makeSeries({
					seriesName: category,
					aliasId: "sefarim",
					heichelId: "ikar",
					parentSeries: baseSeries
				})
				if(cu.success) {
					console.log(cu)
					categorySeries = cu.success.newSeriesID
				} else {
					console.log("ISSUE",t[i])
					return
				}

			}
			console.log(tt)
			for(var k = 0; k < t[i].books.length; k++) {
				//books
				var bookSeries = null;
				
				var bookName = t[i].books[k].link.title
				if(!bookSeries) {
						var bu = await makeSeries({
							seriesName: bookName,
							aliasId: "sefarim",
							heichelId: "ikar",
							parentSeries: categorySeries
						})
						if(bu.success) {
							console.log(bu)
							bookSeries = bu.success.newSeriesID
						}
				}
				console.log("Books for",tt,": ",bookName)
				for(var c = 0; c < t[i].books[k].content.length; c++) {
					//chapters
					
					
					var chap = t[i].books[k].content[c]
					var verses = chap.content.verses
					console.log("Chapter",c,chap,"for book",bookName,"in cate",tt)
							
							var pu = await makePost({
								postName: "Chapter "+(c+1),
								aliasId: "sefarim",
								heichelId: "ikar",
								sections: Object.entries(verses).map(
									w=>
										"<span class='"
											+w[0]
											+"'>"
											+w[0]
											 +"</span>"+ w[1]
									),
								parentSeries: bookSeries
							})
							if(pu.success) {
								console.log(pu, "MADE POST")
								
							}
					}
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
