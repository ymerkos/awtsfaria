/*B"H*/


export {
    getHeichelDetails,
    getAliasName,
    getSeries,
    getPost,
    getAPI,
    aliasOwnership,
    getCommentsByAlias,
    getCommentsOfAlias,
    getComment,
    traverseSeries,
    addNewEditor,

    leaveComment,

    makePost,
    makeSeries,

    appendHTML,
    loadJSON,
    batchTanachCreation,
    parseCommentaries,
    doc,
    getCommentariesOfVerse,
    awtsHref,
    commentaryMap,
    commentaryMapHeb,
    nmToId
}

//B"H
var commentaryMap = {
	Rashi: `רש"י`,
	Ramban: `רמב"ן`,
	Malbim: `מלבי"ם`,
	"Ohr HaChayim": `אור החיים`,
	Onkeles: "אונקלוס",
	"Targum Yonsasan": `יונתן`,
    "Rabeinu Bechiya ben Asher": "רבינו בחיי בן אשר",
    "Ibn Ezra": "אבן עזרא",
    "Abarbanel": "דון יצחק אברבנאל",
    "Alshich": "אלשיך"

}

var commentaryMapHeb = {
    "בעל הטורים": "Baal HaTurim",
    "ילקוט שמעוני": "Yalkut Shimoni",
    "כלי יקר": "Kli Yakar",
    "תולדות אהרן": "Toldos Aharon",
    "רש\"י מנוקד ומעוצב": "Rashi",
    "רש\"י": "Rashi",
    "רמב\"ן": "Ramban",
    "מלבי\"ם": "Malbim",
    "אור החיים": "Ohr HaChayim",
    "אונקלוס": "Onkeles",
    "יונתן": "Targum Yonsasan",
    "רבינו בחיי בן אשר": "Rabeinu Bechiya ben Asher",
    "אבן עזרא": "Ibn Ezra",
    "דון יצחק אברבנאל": "Abarbanel",
    "אלשיך": "Alshich"
};

var nmToId = {
    Abarbanel: "abarbanel",
    "Baal HaTurim": "baalHaturim",
    "Yalkut Shimoni":"yalkutShimoni",
    "Toldos Aharon": "toldosAharon",
    "Kli Yakar": "kliYakar",
    Rashi: "rashi",
    Ramban: "ramban",
    "Ibn Ezra":"ibnEzra",
    Malbim: "malbim",
    "Ohr HaChayim": "ohrHachayim",
    "Targum Yonsasan": "targumYonsasan",
    Sforno: "sforno",
    "Rabeinu Bechiya ben Asher": "rabeinuBechiyaBenAsher",
    Onkeles: "onkeles",
    Alshich: "alshich"
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


async function getComment({
 
    heichelId,
    commentId
}) {
    try {
        var r = await fetch(base+`/api/social/heichelos/${
            heichelId
        }/comment/${
            commentId
        }`)
        var t = await r.json();
        return t;
    } catch(e) {
        console.log(e);
        return []
    }
}


async function getCommentsOfAlias({
    postId,
    heichelId,
    aliasId
}) {
    try {
        var r = await fetch(base+`/api/social/heichelos/${
            heichelId
        }/post/${
            postId
        }/comments/aliases/${
            aliasId
        }`)
        var t = await r.json();
        return t;
    } catch(e) {
        console.log(e);
        return []
    }
}
async function leaveComment({
    postId,
    heichelId,
    content,
    dayuh,
    aliasId
}) {
    if(!dayuh) dayuh = {};
    var p = await getAPI(`/api/social/heichelos/${
        heichelId
    }/post/${
        postId
    }/comments`, {
        method: "POST",
        body: new URLSearchParams({
            aliasId,
            dayuh: JSON.stringify(dayuh),
            content
        })
    })
    return p;
}
async function getCommentsByAlias({
    postId,
    heichelId
}) {
    try {
        var r = await fetch(base+`/api/social/heichelos/${
            heichelId
        }/post/${
            postId
        }/comments/aliases/`)
        var t = await r.json();
        return t;
    } catch(e) {
        console.log(e);
        return []
    }
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

//B"H
async function addNewEditor({
	aliasId,
	heichelId,
	editorAliasId//to add as new
}) {
	var k = await getAPI(`/api/social/heichelos/${
		heichelId
	}/editors`, {
		method: "POST",
		body: new URLSearchParams({
			aliasId,
			editorAliasId
		})
	});
	return k
}
async function addCommentariesAsComments({
	seriesId,
	postIndex,
	heichelId,
	commentaryMap
}) {
	try {
		var dp = new DOMParser()
		var actualCommentaries = [];
		var sr = await getSeries(seriesId,heichelId)
		var post = await getPost(sr, postIndex, heichelId)
		var d = post.dayuh || {};
		var s = d.sections || []
		for(var k = 0; k < s.length; k++) {
			await (async k => {
				var dk = dp.parseFromString(s, "text/html")
				var a = dk.querySelector("a")
				if(!a) return;
				var url = new URL(a.href)
				var com = await getCommentariesOfVerse(`https://awtsmoos.com/api/social/fetch/`
					+btoa("https://he.wikisource.org/"+url.pathname))
				console.log(com)
					for(var i = 0; i < com.length; i++) {
						await (async i => {
							var c = com[i];
							var eng = commentaryMapHeb[c.name]
							var id = nmToId[eng]
							if(!id) {
								console.log("MISSING",id,eng,i,c)
								return;
							}
							console.log("COMMENTING AS",eng,id,"WITH",c.content)
							var k = await leaveComment({
								postId:post.id,
								heichelId,
								aliasId: id,
								content: c.content,
								dayuh: {
									verseSection: k
								}
							})
							console.log("COMMENTED",k)
						})(i)
						
					}
			})(k);
			
		}
		return post;
		
	} catch(e) {
		console.log(e)
		return;
	}
}

/**
 * 
 * example
 * p = await addCommentariesAsComments({
	seriesId:"BH_1710482432718_757_sefarim",
	postIndex:0,
	heichelId:"ikar"
})
 */







async function traverseSeries({
	heichelId,
	seriesId,
	callbackForSeries,
	path=[],
	callbackForEachPost
}) {
	var first = await getSeries(seriesId, heichelId);
	var pth = Array.from(path);
	if(typeof(callbackForSeries) == "function") {
		callbackForSeries({
			seriesInfo: first.prateem,
			posts: first.posts,
			subSeries: first.subSeries,
			path
		})
	}
	for(var i = 0; i < first.subSeries.length; i++) {
		var b = first.subSeries[i]
		await traverseSeries({
			heichelId, seriesId: b,
			series: first,
			callbackForSeries,
			callbackForEachPost,
			path: pth.concat(seriesId)
		})
	}

	if(typeof(callbackForEachPost) == "function")
		for(var i = 0; i < first.posts.length; i++) {
			await (async (i) => {
				var b = first.posts[i];
				var post = await getPost(
					first, i, heichelId
				)
				await callbackForEachPost({
					heichelId, seriesId,
					postId: b,
					post,
					index:i,
					callbackForSeries,
					callbackForEachPost,
					path: pth.concat(seriesId)
				})
			})(i);
			
		}
	return first
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


/*
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
*/

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




//https://awtsmoos.com/api/social/fetch/aHR0cHMlM0ElMkYlMkZoZS53aWtpc291cmNlLm9yZyUyRndpa2klMkYlMjVENyUyNTlFJTI1MjIlMjVENyUyNTkyXyUyNUQ3JTI1OTElMjVENyUyNUE4JTI1RDclMjU5MCUyNUQ3JTI1QTklMjVENyUyNTk5JTI1RDclMjVBQV8lMjVENyUyNTkwXyUyNUQ3JTI1OTglMjVENyUyNTk1
//B"H
async function getCommentariesOfVerse(url) {
	
	var f = await doc(url);

	if(!f) return console.log("WHAT",url,f)
	var g = f.querySelector("a[href*='" + encodeURIComponent('מ"ג') +"']")
	if(!g) {
		console.log("NO commenariy found!",url,f)
		return;

	}
	var href = awtsHref(g.href)
	console.log("Pasring",href)
	var otherDoc = await doc(href);
	var com = parseCommentaries(otherDoc)
	return com;
}

function awtsHref(href) {
	var u = new URL(href)
	var n = "https://awtsmoos.com/api/social/fetch/" +
		btoa("https://he.wikisource.org/"+u.pathname)
	return n;
}

//B"H

function parseCommentaries(doc) {
	//B"H
	p = doc.getElementById("mw-content-text")
	var ch = Array.from(p.childNodes[0].childNodes)
	ch;
	var tab = doc.querySelector("table")
	tab;
	var div = doc.querySelectorAll(".mw-content-rtl > div > span[id] > div")[1]

	k={div, tab}
	function parseDiv(d) {
        var sec = [];
        var curSecName = null;
        var curSecContent = "";
        var capturing = false; // Flag to indicate whether we're capturing content
        var n = Array.from(d.childNodes);

        n.forEach((w, i, a) => {
            if (w.tagName == "H2") {
                // If we were capturing content from a previous section, push it to the sec array
                if (curSecName) {
                    sec.push({
                        name: curSecName,
                        content: curSecContent.trim() // Trim to remove leading/trailing whitespace
                    });
                    curSecContent = "";
                }
                // Update current section name and start capturing content
                curSecName = w.textContent;
                capturing = true;
                return;
            }

            // Check if encountering a span with an id
            if (w.tagName == "SPAN" && w.id && !capturing) {
                // Start capturing content if this is the span we're interested in
                capturing = true;
            }

            // Check if encountering another div at the main level while capturing content
            if (w.tagName == "DIV" && capturing) {
                // Capture content from nested div
                var nestedContent = parseDiv(w);
                if (nestedContent.length > 0) {
                    sec.push(...nestedContent.reverse());
                }
            } else if (capturing) {
                // Append content to current section
                curSecContent += w.innerHTML || w.textContent;
            }

            // End capturing when reaching the last child node
            if (i == a.length - 1 && capturing) {
                sec.push({
                    name: curSecName,
                    content: curSecContent.trim() // Trim to remove leading/trailing whitespace
                });
            }
        });

        return sec;
    }


	//o=parseDiv(div)
	var o = parseDiv(div)
	var commentaries = o;
	try {
		o.push({name: "אונקלוס", content: tab.rows[0].innerHTML})

		yoynisawn = tab.rows[2].innerHTML
	} catch(e){}
	try {
		o.push({name: "יונתן", content: tab.rows[2].innerHTML})

		yoynisawn = tab.rows[2].innerHTML
	} catch(e){}
	return commentaries;
	//Array.from(document.querySelectorAll("p"))
}

async function doc(url) {
	var dp = new DOMParser();

	try {
		var p = await fetch(url)
		var txt = await p.text()
		var d = dp.parseFromString(txt, "text/html");
		return d;
	} catch(e) {
		return null;
	}
}




//B"H





/*
h=await traverseSeries({
	seriesId:"BH_1710482432718_757_sefarim",
	heichelId:"ikar"
})*/

/*
async function addCommentariesAsComments({
	seriesId,
	postIndex,
	heichelId,
	commentaryMap
}) {
	try {
		var dp = new DOMParser()
		var actualCommentaries = [];
		var sr = await getSeries(seriesId,heichelId)
		var post = await getPost(sr, postIndex, heichelId)
		var d = post.dayuh || {};
		var s = d.sections || []
		for(var k = 0; k < s.length; k++) {
			await (async k => {
				var dk = dp.parseFromString(s, "text/html")
				var a = dk.querySelector("a")
				if(!a) return;
				var url = new URL(a.href)
				var com = await getCommentariesOfVerse(`https://awtsmoos.com/api/social/fetch/`
					+btoa("https://he.wikisource.org/"+url.pathname))
				console.log(com)
					for(var i = 0; i < com.length; i++) {
						await (async i => {
							var c = com[i];
							var eng = commentaryMapHeb[c.name]
							var id = nmToId[eng]
							if(!id) {
								console.log("MISSING",id,eng,i,c)
								return;
							}
							console.log("COMMENTING AS",eng,id,"WITH",c.content)
							var k = await leaveComment({
								postId:post.id,
								heichelId,
								aliasId: id,
								content: c.content,
								dayuh: {
									verseSection: k
								}
							})
							console.log("COMMENTED",k)
						})(i)
						
					}
			})(k);
			
		}
		return post;
		
	} catch(e) {
		console.log(e)
		return;
	}
}
/*
p = await addCommentariesAsComments({
	seriesId:"BH_1710482432718_757_sefarim",
	postIndex:0,
	heichelId:"ikar"
})*/
