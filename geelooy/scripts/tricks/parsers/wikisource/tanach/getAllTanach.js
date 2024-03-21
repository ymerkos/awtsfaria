//B"H
console.log("B\"H")
async function downloadAllTenachIndecies(getOnlyIndecies=true, slow=false) {
	var t = document.querySelector("table")
	TanachRows = Array.from(t.rows).slice(1,4);
	var subTables = TanachRows.map(w=>w.querySelector("table"))
	var categories = subTables.map(q=>({
		title: q.rows[0].textContent.trim(), 
		books: Array.from(q.rows).slice(1).map(
				q=>
					Array.from(q.querySelectorAll("a")).filter(w=>w.parentNode.tagName != "B")
				).flat()
			
	}));

	
	for(var i = 0; i < categories.length; i++) {
		/*
			get chapter index of each bok

		*/
		var cat = categories[i];
		for(var y = 0; y < cat.books.length; y++) {
			var index = await getBookChaptersIndex(cat.books[y].href)
			console.log("Getting chapter index", index)
			/**
				get index of verses in each chapter now
			**/
			for(var z = 0; z < index.length; z++) {
				console.log("Getting chapter verses",index[z])
				var versesIndex = await getChapterSectionsIndex(
					index[z].href,
					!slow
				);


				if(slow) {
					if(getOnlyIndecies)
						index[z] = {
							link: aToObj(index[z]),
							sections: versesIndex.map(r=>aToObj(r))
						}
					else {
						for(var v = 0; v < versesIndex.length; v++) {
							var details = await getVerseDetailsSLOW(versesIndex[v].href);
							versesIndex[v] = {
								link: aToObj(versesIndex[v]),
								content: details
							}
						}
					}
				} else {
					index[z] = {
						link: aToObj(index[z]),
						content: versesIndex
					}
				}
			}
			

			cat.books[y] = {
				link: aToObj(cat.books[y]),
				
				content: index
			}
		}
		
		
		
	}
	return categories
	
}

/*slow version*/
async function getVerseDetailsSLOW(url) {
	var d = await doc(url)
	//B"H
	var lan= d.querySelector("div[lang='hbo']")
	var com = d.querySelector(`a[title*='מ"ג']`)
	if(lan && com)
		return {
			verse: lan.innerHTML,
			commentaries: com.href
		}
	else return null
}

function getVerseDetails(chapterDoc) {
	//B"H

	function getVerses() {
		
		var h = chapterDoc.querySelector("div[lang='hbo']")
		var p = h.children[0]
		var verses = {};
		var curVerse = null;
		var curVerseContents = ""
		Array.from(p.childNodes)
		.forEach((w,i,ar) => {
			//console.log(w.textContent)
			if(w.tagName == "SPAN" && w.id) {
				if(curVerse) {
					verses[curVerse] = curVerseContents
				}
				console.log("OK",w.id,curVerse,curVerseContents)
				curVerse = w.id;
				curVerseContents = ""
				return;
			}

			curVerseContents += w.innerHTML || w.textContent

			if(i == ar.length - 1){
				if(curVerse) {
					verses[curVerse] = curVerseContents
				}
			}


		})
		return verses;
	}

	function getCommentaries() {
		var m = chapterDoc.querySelector(`a[title*='מ"ג איכה ב']`)
		return m;
	}

	return {
		verses: getVerses(),
		commentaries: getCommentaries()
	}
}
function aToObj(a) {
	return {
		title: a.textContent,
		href: a.href
	}
}


async function getBookChaptersIndex(url) {
	var d = await doc(url);
	try {
			//B"H
		var f=d.getElementById("mw-content-text")
		var center = f.querySelector("center")
		var a = Array.from(center.querySelectorAll("a"))
		return a;
	} catch(e) {
		console.log("Issue",e,url)
		return null;
	}
}


async function getChapterSectionsIndex(url, details = false) {
	var d = await doc(url);

	try {
		if(!details) {
			//B"H
			var f=d.getElementById("mw-content-text")
			var navA = Array.from(f.querySelectorAll(".NavFrame a.mw-redirect"))

			var a = Array.from(f.querySelectorAll("a.mw-redirect"))
				.filter(w=>
					!navA.includes(w) &&
					w.parentNode.tagName == "SPAN"
				)
			return a;

		} else {
			var chapter = getVerseDetails(d)
			return chapter
		}
	} catch(e) {
		console.log("There was an issue!", e)
		return null;
	}
}

//B"H
async function getCommentariesOfVerse(urlPart) {
	var url = "https://he.wikisource.org"+urlPart;
	var f = await doc(url);

	if(!f) return console.log("WHAT",url,f)
	var g = f.querySelector("a[href*='" + encodeURIComponent('מ"ג_בראשית_א_טו') +"']")
	if(!g) {
		console.log("NO commenariy found!",url,f)
		return;

	}
	var otherDoc = await doc(g.href);
	var com = parseCommentaries(otherDoc)
	return com;
}

function parseCommentaries(doc) {
	//B"H
	p = doc.getElementById("mw-content-text")
	var ch = Array.from(p.childNodes[0].childNodes)
	ch;
	var tab = doc.querySelector("table")
	tab;
	var div = doc.querySelectorAll(".mw-parser-output > div")[2]
	k={div, tab}
	function parseDiv(d) {
		var sec = [];
		var curSecName = null;
		var curSecContent = "";
		var capturing = false; // Flag to indicate whether we're capturing content
		var n = Array.from(d.childNodes);

		n.forEach((w, i, a) => {

			if (w.tagName == "H2") {

				if (curSecName) {
					sec.push({
						name: curSecName,
						content: curSecContent.trim() // Trim to remove leading/trailing whitespace
					});
					curSecContent = "";
				}
				curSecName = w.textContent;
				capturing = true; // Start capturing content when encountering h2
				return;
			}

			// Check if encountering another div at the main level
			if (w.tagName == "DIV" && capturing) {
				// Capture content from nested div
				var nestedContent = parseDiv(w);
				if (nestedContent.length > 0) {
					sec.push(...nestedContent.reverse());
				}
			} else if (capturing) {
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

function downloadJSON(json, nm) {
	var a=  document.createElement("a")
	a.href = URL.createObjectURL(
		new Blob([
			JSON.stringify(json, null, "\t")
		], {
			type: "application/json"
		})
	);

	a.download = (
		nm || "BH_" + Date.now()
	) + ".json";

	a.click()
	
}



/*

g = await getChapterSectionsIndex("https://he.wikisource.org/wiki/%D7%91%D7%A8%D7%90%D7%A9%D7%99%D7%AA_%D7%90")
*/


g=await downloadAllTenachIndecies()
downloadJSON(g)
g;
