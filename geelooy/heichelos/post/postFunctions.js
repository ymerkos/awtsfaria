//B"H
import Highlighter from "/api/nav/highlighter.js";
import TabManager from "/heichelos/post/TabManager.js";

var seriesInfo = {}
var otherPostInfo = {}
window.seriesInfo=seriesInfo
window.otherPostInfo=otherPostInfo
//
window.heightFactor = .5;
window.offset = 50;

window.heightFactorSmall =3
// Global variables to store bounding box data and last active element

let lastEl = null;

var activePar= null
// Function to start the highlighting with cached bounding boxes
function startHighlighting(elId, targetClass, callback) {
    var chai = new Highlighter(
	    "#"+elId,
	    "."+targetClass,
	    (h)=>{
		    activePar=h
		    window. activePar=h
		    callback({main:h})
	    }
    );
   var subChai = new Highlighter(
	    "#"+elId,
	    "."+targetClass +
	    " .sub-awtsmoos"
,
	    (h)=>{
		    callback({sub:h})
		 //  console.log("active SUB section",h)
	    }
    );
	
window.subChai = subChai
window.chai = chai
}


var postElement = postFrame;
var MAX_FONT_SIZE =
	72; // Define the max font size
var MIN_FONT_SIZE =
	10; // Define the min font size
var FONT_SIZE_INCREMENT =
	2; // Define the size increment
var postElement;
window.adjustFontSize = adjustFontSize

function adjustFontSize(action) {
	if (!postElement)
		postElement = document
		.querySelector('.content');
	let currentFontSize = window
		.getComputedStyle(postElement,
			null)
		.getPropertyValue('font-size');
	currentFontSize = parseFloat(
		currentFontSize);
	
	if (action == 'increase' &&
		currentFontSize < MAX_FONT_SIZE
	) {
		postElement.style.fontSize = (
				currentFontSize +
				FONT_SIZE_INCREMENT) +
			'px';
	} else if (action === 'decrease' &&
		currentFontSize > MIN_FONT_SIZE
	) {
		postElement.style.fontSize = (
				currentFontSize -
				FONT_SIZE_INCREMENT) +
			'px';
	}
	
	localStorage.currentFontSize =
		currentFontSize;
	// sendSizeMessage()
}

function loadFontSize() {
	if (!postElement)
		postElement = document
		.querySelector('.content');
	if (!postElement) {
		return;
	}
	var fs = localStorage
		.currentFontSize;
	if (!fs) return;
	var num = parseInt(fs);
	if (isNaN(num)) return;
	postElement.style.fontSize = num +
		"px";
	
}



function isHebrewWord(word) {
  // Regular expression to match Hebrew letters and vowels
  const hebrewRegex = /^[א-ת\u0590-\u05FF]+$/;

  // Check if the word matches the Hebrew regex
  return hebrewRegex.test(word);
}
var $_GET = new URLSearchParams(location
	.search)


function makeInfoHTML() {
    const post = window.post;
    const alias = window.alias;
    if (!post) return "Couldn't load";

    // Main container
    const container = document.createElement("div");
    container.className = "post-info-container";

    // Author Section
    const authorSection = document.createElement("div");
    authorSection.className = "tl post-author";

    const authorLabel = document.createElement("div");
    authorLabel.className = "label";
    authorLabel.textContent = "Author:";

    const authorValue = document.createElement("div");
    authorValue.className = "value";

    const authorLink = document.createElement("a");
    authorLink.href = `/@${alias.id}`;
    authorLink.className = "author-link";
    authorLink.textContent = alias.name;

    authorValue.appendChild(authorLink);
    authorSection.appendChild(authorLabel);
    authorSection.appendChild(authorValue);
    container.appendChild(authorSection);

    // Heichel Section
    const heichelSection = document.createElement("div");
    heichelSection.className = "tl post-heichel-name";

    const heichelLabel = document.createElement("div");
    heichelLabel.className = "label";
    heichelLabel.textContent = "Heichel:";

    const heichelValue = document.createElement("div");
    heichelValue.className = "value";

    const heichelLink = document.createElement("a");
    heichelLink.href = `/heichelos/${post.heichel.id}`;
    heichelLink.className = "heichel-link";
    heichelLink.textContent = post.heichel.name;

    const heichelDesc = document.createElement("div");
    heichelDesc.className = "heichelDesc";
    appendHTML(post.heichel.description || "", heichelDesc);
	
    heichelLink.appendChild(heichelDesc);
    heichelValue.appendChild(heichelLink);
    heichelSection.appendChild(heichelLabel);
    heichelSection.appendChild(heichelValue);
    container.appendChild(heichelSection);

    // Series Section
    const seriesSection = document.createElement("div");
    seriesSection.className = "tl post-parent-series";

    const seriesLabel = document.createElement("div");
    seriesLabel.className = "label";
    seriesLabel.textContent = "Part of Series:";

    const seriesValue = document.createElement("div");
    seriesValue.className = "value";

    const path = new URLSearchParams({ series: window.parentSeries });
    if (window.pth) path.append("path", window.pth);

    const seriesLink = document.createElement("a");
    seriesLink.href = `/heichelos/${post.heichel.id}/?${path}`;
    seriesLink.className = "series-link";
    seriesLink.textContent = window.series.prateem.name;

    seriesValue.appendChild(seriesLink);
    seriesSection.appendChild(seriesLabel);
    seriesSection.appendChild(seriesValue);
    container.appendChild(seriesSection);

    // Edit Post Link
    if (window.doesOwn) {
        const editLink = document.createElement("a");
        editLink.href = `/heichelos/${post.heichel.id}/edit?type=post&id=${post.id}${window.getLinkHrefOfEditing()}`;
        editLink.className = "edit-post-link";
        editLink.textContent = "Edit post";
        container.appendChild(editLink);
    }

    return container.outerHTML;
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
	    var result = null
        if (typeof window.toldafy === "function") {
            result = window.toldafy(node, parent, array);
        }
	var newNodes = []; 
	if(result == "delete") return;
		
	else if(result?.node) {
		newNodes.push(result.node)
	} else if(result?.nodes) {
		newNodes = Array.from(result.nodes)
	} else 
        	newNodes.push(node.cloneNode(false));
	var action = result?.action || {};
	
	newNodes.forEach(newNode => {
		if(action.appendFirst) {
			try {
				newNode.appendChild(action.appendFirst)
			} catch(e){console.log(e)}
		}
	        parent.appendChild(newNode);
	        if (node.childNodes.length > 0) {
	            Array.from(node.childNodes).forEach((childNode) => {
	                appendWithSubChildren(childNode, newNode, array);
	            });
	        } 
	});
    }
}

function getLinkHrefOfEditing() {
	return `&parentSeriesId=${
		series.id
	    }&returnURL=${
		location.href
	    }`
}
window.getLinkHrefOfEditing=getLinkHrefOfEditing

function makeNavBars(post, seriesParent,
	indexInSeries) {
	var html = "";
	var myID = post.id;
	var sr = seriesParent.id;
	
	var posts = seriesParent.posts
	var cur = indexInSeries;
	try {
		// cur = parseInt(cur)
	} catch (e) {
		
	}
	var length = posts.length;
	
	var hasPrevious = cur > 0;
	var hasNext = cur < length - 1;
	
	var path = null
	html += `<div class="nav">`
	
	html += `<div class="controls">${
                            cur + 1
                        } of ${
                            length
                        }    
                        </div>`;
	var last = encodeURIComponent(cur -
		1);
	if (hasPrevious) {
		html +=
			`<a id="last" class="nav button primary" href="${last}">Previous</a>`
	}
	
	if (hasNext) {
		var next = encodeURIComponent(
			cur + 1);
		html +=
			`<a id="next" class="nav button primary"  href="${next}">Next</a>`
	}
	
	html += `</div>`;
	
	html += `
                        <script>

                            if(window.next) {
                                next.href = next.href
                                
                            }

                            if(window.last) {
                                last.href = last.href
                                    
                            }
                        </script` +
		`>`;
	return html;
}
var man = null;


function addTab({
	
	header,
	content,
	append,
	rootParent=null,
	addClasses = false,
	parent = null,
	btnParent = null,
	tabParent = null,
	onswitch,
	onopen,
	onclose,
	oninit
}) {
	if(!man) {
		man = new TabManager({
			parent:rootParent,
			onclose() {
				window?.commentaryBtn?.dispatchEvent(new CustomEvent("click",{}))
			}
			
		})
		window.tabManager = man;
	}
	return man.addTab({
		
		header,
		content,
		append,
		addClasses,
		parent,
		btnParent,
		tabParent,
		onswitch,
		onopen,
		onclose,
		oninit
	})
}

function updateQueryStringParameter(key, value) {
    // Get the current URL
    const url = new URL(window.location);
    
    // Update the query parameter
    url.searchParams.set(key, value);
    
    // Push the new URL to the history
    window.history.pushState({ path: url.href }, '', url.href);
}

function scrollToActiveEl() {
	var search = new URLSearchParams(location.search);
	var idx = search.get("idx")
	if(!idx) return;
	if(!window.sections) return;
	var cur = sections[idx];
	if(!cur) return;
	var sub = search.get("sub");
	if(!cur && cur !== 0) return;
	if(!sub)
		cur?.scrollIntoView();

	
	var subIdx = cur.querySelector(`.sub-awtsmoos[data-idx="${sub}"]`);
	if(subIdx) {
		subIdx.scrollIntoView();
	}
}




var menu = null;
function showCustomContextMenu(x, y, e) {
  // Helper function to get selected text, if any
  function getSelectedText() {
    return window.getSelection().toString();
  }

  // Menu actions defined as an object
  const menuActions = {
    "Fullscreen": (selectedText) => {
      toggleFullscreen();
      console.log("Fullscreen toggled" + (selectedText ? ` with selected text: "${selectedText}"` : ""));
    },
    "Copy": (selectedText) => {
	if(!selectedText) {
		selectedText = activePar?.textContent;

	}
      const textToCopy = selectedText || "the Awtsmoos is always with u. Now is "+Date.now();
      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log(`Copied: "${textToCopy}"`);
      }).catch(err => {
        console.error("Failed to copy text:", err);
      });
    },
	...(
		e.target.tagName == "A" ?
		{
			"Open in new tab": () => {
				open(e.target.href, "_blank").focus();
			}
		} : {}
	)
  };

  // Remove any existing menu to avoid duplicates
  const existingMenu = document.getElementById("custom-context-menu");
  if (existingMenu) existingMenu.remove();
const selectedText = getSelectedText();
  // Create the menu container
  menu = document.createElement("div");
  menu.id = "custom-context-menu";
  menu.style.position = "absolute";
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.backgroundColor = "#333";
  menu.style.color = "white";
  menu.style.borderRadius = "5px";
  menu.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
  menu.style.padding = "10px";
  menu.style.zIndex = "1000";
  menu.style.cursor = "pointer";

menu.onblur=menu.remove
  // Loop through each action in the menuActions object to create menu items
  for (const [label, action] of Object.entries(menuActions)) {
    const menuItem = document.createElement("div");
    menuItem.innerText = label;
    menuItem.style.padding = "8px 16px";
    menuItem.addEventListener("click", () => {
      
      action(selectedText);
      menu.remove();
    });

    menuItem.addEventListener("mouseover", () => {
      menuItem.style.backgroundColor = "#555";
    });
    menuItem.addEventListener("mouseout", () => {
      menuItem.style.backgroundColor = "transparent";
    });
    menu.appendChild(menuItem);
  }

  // Append the menu to the document body
  document.body.appendChild(menu);
}
// Fullscreen toggle function
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Safari
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE11
      document.documentElement.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE11
      document.msExitFullscreen();
    }
  }
}

// Show context menu on right-click
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  showCustomContextMenu(e.pageX, e.pageY, e);
});
addEventListener("click", () => {
	if(menu) menu.remove()
})

function sanitizeContent(txt) {
	return txt.split("[cup]")
		.join("<b>")
		.split("[/cup]")
		.join("</b>")
}

function mapSectionData(sec) {
	if(sec.subSections) {
		return sec;
	} else {
		return sec.text;
	}
}
async function interpretPostDayuh(post) {
	var dayuh = post?.dayuh;
	if(!dayuh || typeof(dayuh) != "object") {
		return null;
	}
	var sec = dayuh?.sections;
	
	if(typeof(sec) == "string")
		sec = [sec];
	
	if (Array.isArray(
		sec
	)) {
		if(typeof(sec[0]) == "object") {
			sec =  sec.map(mapSectionData)
		}
		if(!sec.length) return console.log("Nothing");
		//sec = removeAwtsmoosPage(sec)
		var sectionId = 0;
		for(var w of sec) {
			
			var isMulti = w.subSections;
			var refs = !isMulti ? await getReferences({sectionText:w}) : null;
			var isRef = typeof(refs) == "object" &&
				refs?.isReference;
			
			//console.log("Ref",refs?.texts,w)
			if(refs && isRef && Array.isArray(refs.texts)) {
				var refIdx = 0;
				for(var ref of w.texts) {
					w.refIdx=refIdx
					if(w.samePost) {
						w.postId = w.startPostId
					} else {
						var startIdx = w.info.start.postNum;
						var startIDs = w.startSections.slice(startIdx);
						if(startIDs.includes(refIdx)) {
							w.postId = w.startPostId;
						} else w.postId = w.endPostId
						//var endIdx = w.info.end.postNum;
					}
					
					await generateSection({
						sectionText: ref,
						sectionId,
						
						allSections: sec,
						isReference: true,
						referenceInfo: w
					})
					sectionId++;
					refIdx++
				}
			} else {
				await generateSection({
					sectionText: !isMulti ? w : null,
					...(isMulti ? {
						dynamic: w
					} : {}),
					sectionId,
					allSections: sec
					
				})
			}

			sectionId++;
			
		}
	}
}

async function getReferences({
	sectionText
}) {
	var w = sectionText;
	var refS = "<$awtsmoosRefStart:"
	var refEnd = ":awtsmoosRefEnd$>"
	var hasRef = w.indexOf(refS)
	
	if(hasRef < 0) return w;
	var sub = w.slice(refS, refEnd)
	
	//w = w.replace(sub, "")
	
	var refEnd = w.indexOf(refEnd)
	if(refEnd < 0) return w
	var refObj = w.slice(refS.length + hasRef, refEnd)
	
	var p = null;
	try {
		p = JSON.parse(refObj)
	} catch(e) {
		console.log(e)
	}
	
	console.log("made it",p,sub," W ",w,refObj,hasRef,refS,refEnd)
	if(!p) {
		return w;
	}
	var start = p.start;
	var end = p.end
	if(!start || !end) return w;

	var sourceSeries = p.sourceSeriesId;
	if(!sourceSeries) return w;
	var postStart = start.postNum;
	var postEnd = end.postNum;
	if(!postStart && postStart !== 0) return w;
	if(!postEnd && postEnd !== 0) return w;
	var sectionStart = start.section;
	var sectionEnd = end.section;
	
	var seriesDetails = seriesInfo[sourceSeries]
	if(!seriesDetails) {
		var heichel = post.heichel.id;
		
		try {
			 seriesDetails = await (await fetch(
				`/api/social/heichelos/${
					heichel
				}/series/${sourceSeries}/details?` + 
				new URLSearchParams({
					propertyMap: {
					
						posts: true
						
					}
				})
			)).json()
		} catch(e){
			console.log(e,p,w)
		}
		
		
		
	}

	if(!seriesDetails) return w;
	seriesInfo[sourceSeries] = seriesDetails;
	var startPostId = seriesDetails?.posts[postStart]
	if(!startPostId) {
		console.log("Couldn't find start post",p)
		return w;
	}

	var endPostId = seriesDetails.posts[postEnd]
	if(!endPostId) {
		console.log("Couldn't find end post",p)
		return w;
	}
	var startPostDetails = otherPostInfo[startPostId];
	if(!startPostDetails) {
		var heichel = post.heichel.id;
		
		try {
			 startPostDetails = await (await fetch(
				`/api/social/heichelos/${
					heichel
				}/post/${
					startPostId
				}/?` + 
				new URLSearchParams({
					propertyMap: {
					
						dayuh: {
							sections: true
						}
						
					}
				})
			)).json()
		} catch(e){
			console.log(e,p,w)
		}
		if(!startPostDetails) return w;
		otherPostInfo[startPostId] = startPostDetails;
		
	}

	var endPostDetails = otherPostInfo[endPostId];
	if(!endPostDetails) {
		var heichel = post.heichel.id;
		
		try {
			 endPostDetails = await (await fetch(
				`/api/social/heichelos/${
					heichel
				}/post/${
					endPostId
				}/?` + 
				new URLSearchParams({
					propertyMap: {
					
						dayuh: {
							sections: true
						}
						
					}
				})
			)).json()
		} catch(e){
			console.log(e,p,w)
		}
		if(!endPostDetails) return w;
		otherPostInfo[endPostId] = endPostDetails;
		
	}
	var refs = [];
	var samePost = false;
	var startSections = startPostDetails?.dayuh?.sections;
	
	var endSections = endPostDetails?.dayuh?.sections;
	var different = false;
	if(sectionEnd == "MAX")
		sectionEnd = endSections.length - 1;
	if(endPostId != startPostId) {
		var startRefs = startSections?.slice(
			sectionStart
		)
	
		var endRefs = endSections?.slice(
			0, sectionEnd + 1
		);
		different = {startRefs, endRefs}
		refs = [startRefs, endRefs].flat()
	} else {
		refs = startPostDetails?.dayuh?.sections.slice(
			sectionStart, sectionEnd + 1
		)
	}
	return {
		texts: refs,
		different,
		info: p,
		startSections,
		endSections,
		isReference: true,
		startPostId,
		endPostId,
		samePost,
		startPostDetails,
		endPostDetails,
		sourceSeries,
		seriesDetails
	};
	
	
}
function isFirstCharacterHebrew(str) {
  return /^[\u0590-\u05FF]/.test(str);
}
function generateSection({
	sectionText, sectionId, dynamic=null,
	allSections, isReference=false,
	referenceInfo
}) {
	if(!window.sectionData) {
		window.sectionData = []
	}
	
	
	var i = sectionId;
	var sectionInfo = {sectionId};
	window.sectionData.push(sectionInfo);
	var el =
		document
		.createElement(
			"div"
		);
	el.className =
		"section";
	el.dataset
		.idx =
		i;
	if(isReference) {
		el.dataset.isref=true;
		el.classList.add("reference");
		sectionInfo.referenceInfo = referenceInfo
	}
	
	var content = document
		.createElement("div")

	
	content.classList.add("toichen")
	
	el.appendChild(content)
	realPost
		.appendChild(
			el
		);
	//
	
	if(sectionText) {
		var w = sanitizeContent(sectionText);
		
		var a = allSections;
		addHTML(w, content, {
			index: i,
			array: a
		});
	}
	if(dynamic) {
		var {subSections} = dynamic;
		if(!subSections) {
			console.log("No sections?")
			return;
		}
		subSections.forEach((s, i, a) => {
			var subS = document
				.createElement("div")
		
			
			var txt = typeof(s) == "string" ? s
				: s?.text;
			if(typeof(txt) != "string") {
				return console.log("Skipping",s);
			}
			//var maybeEmpty = ((d=>(d.innerHTML=txt,d.innerText))(document.createElement("div"))).trim();
			//if(maybeEmpty) return;
			
			subS.dataset.idx = i;
			subS.classList.add("sub-awtsmoos")
			content.appendChild(subS);
			
			var san = sanitizeContent(txt);
			addHTML(san, subS, {
				index: i,
				array: a
			})
		})
	}
	if(!content.innerText.trim().length) {
		
		el.parentNode.removeChild(el)
	}
	if(isFirstCharacterHebrew(content.innerText)) {
		content.classList.add("heb")
	}
	window.sections = Array.from(document.querySelectorAll(".section"));
	
}

function addHTML(html, parent, {index, array}={}) {
	var h =
		(window
			.hayfich
		);
	
	if (h &&
		typeof (
			h
		) ==
		"function"
	) {
		var r =
			h(w, index,
				array
			)
		appendHTML
			(r,
				parent
			)
		
	} else {
		appendHTML
			(html,
				parent
			)
		
	}
}
function removeAwtsmoosPage(arr) {
  // Iterate through the array to find an element containing <awtsmoosPage>
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].includes('<awtsmoosPage>')) {
      // If there's an element before and after, merge them
      if (i > 0 && i < arr.length - 1) {
        arr[i - 1] += arr[i + 1]; // Merge the previous and next elements
      }
      // Remove the element containing <awtsmoosPage>
      arr.splice(i, 1);
      break; // Stop after modifying the array
    }
  }
  return arr;
}
export {
	getLinkHrefOfEditing,
	makeNavBars,
	addTab,
	
	appendHTML,

	makeInfoHTML,
	loadFontSize,
	adjustFontSize,
	startHighlighting,
	updateQueryStringParameter,
	interpretPostDayuh,
	scrollToActiveEl,
	isFirstCharacterHebrew
	
  
}
