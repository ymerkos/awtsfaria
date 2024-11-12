//B"H

var seriesInfo = {}
var otherPostInfo = {}
window.seriesInfo=seriesInfo
window.otherPostInfo=otherPostInfo
//
window.heightFactor = .5;
window.offset = 50;

window.heightFactorSmall =3
// Global variables to store bounding box data and last active element
let divDataCache = [];
let lastEl = null;

// Function to cache bounding boxes for all target divs within the parent container
function cacheBoundingBoxes(parentDiv, targetClass) {
    // Select all target divs and calculate their bounding boxes
    const targetDivs = Array.from(parentDiv.querySelectorAll(`.${targetClass}`));
    divDataCache = targetDivs.map(div => {
        const rect = div.getBoundingClientRect();
        return {
            element: div,
            top: rect.top + window.scrollY, // Adjust to take window scroll into account
            bottom: rect.bottom + window.scrollY,
            height: rect.height
        };
    });
}

// Function to start the highlighting with cached bounding boxes
function startHighlighting(elId, targetClass, callback) {
    const parentDiv = document.getElementById(elId);
    
    // Initial cache of bounding boxes
    cacheBoundingBoxes(parentDiv, targetClass);

    // Attach the scroll event to the parent div
    parentDiv.onscroll = () => highlightActiveDiv(elId, targetClass, callback);

    // Recalculate bounding boxes on window resize
    window.onresize = () => cacheBoundingBoxes(parentDiv, targetClass);

    // Initial call to highlight the active div on page load
    highlightActiveDiv(elId, targetClass, callback);
}

// Function to highlight the active div based on cached bounding boxes
function highlightActiveDiv(elId, targetClass, callback) {
    const parentDiv = document.getElementById(elId);
    const scrollTop = parentDiv.scrollTop;
    const parentHeight = parentDiv.clientHeight;
    const parentWidth = parentDiv.clientWidth;
    const heightFactor = window.innerWidth < 769 && parentWidth < parentHeight 
        ? window.heightFactorSmall 
        : window.heightFactor;

    const middleThreshold = scrollTop + (parentHeight * heightFactor);
    const offset = 50; // Distance below the middle threshold to activate
    const adjustedThreshold = middleThreshold + offset;

    let activeDiv = null;

    // Loop through cached bounding box data to find the active div
    for (const divData of divDataCache) {
        if (divData.top < adjustedThreshold && divData.bottom > middleThreshold) {
            activeDiv = divData.element;
            if (lastEl !== activeDiv) {
                if (typeof callback === "function") {
                    callback(activeDiv);
                }
                lastEl = activeDiv; // Update lastEl to the current active div
            }
            break;
        }
    }

    // If no active div is found, check for the last div when scrolling down
    if (!activeDiv && divDataCache.length) {
        const lastDivData = divDataCache[divDataCache.length - 1];
        if (scrollTop + parentHeight >= lastDivData.top) {
            activeDiv = lastDivData.element;
            if (lastEl !== activeDiv) {
                if (typeof callback === "function") {
                    callback(activeDiv);
                }
                lastEl = activeDiv;
            }
        }
    }

    // Remove the 'active' class from all target divs and add it to the active one
    divDataCache.forEach(divData => divData.element.classList.remove('active'));
    if (activeDiv) activeDiv.classList.add('active');
}


function makeSectionActive(num) {
  if(!window.sections) return console.log("No sections just body")
  var nm = null
  sections.forEach(w=> {
    if(w.dataset.idx == num) {
      nm = w; 
    }
    w.classList.remove("active")
  })

  
  if(!nm) return console.log ("something's up",nm, num);
  nm.classList.add("active")
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
	var html = "";
	var post = window.post;
	if(!post) return "Couldn't load";
	var alias = post.author;
	html += `<div class="tl post-author"><div class="label">Author:</div>
                            <div class="value"><a href="/@${
                                alias.id
                                
                                }">${alias.name}</a></div></div>
                            <div class="tl post-heichel-name"><div class="label">Heichel:</div>
                            <div class="value"><a href="/heichelos/${
                                post.heichel.id
                            }">${post.heichel.name}
                            
                            <div class="heichelDesc">${
                                post.heichel.description||""

                                }

                 </div>
                </a>      
                </div></div>`;
	
	var pth = $_GET.get("path")
	var sr = parentSeries;
	var pt = new URLSearchParams({
		series: sr,
		...(pth ? {
			path: pth
		} : {})
	})
	html += `<div class="tl post-parent-series">
                            <div class="label">Part of Series:</div>
                            <div class="value">
                                <a href="/heichelos/${
                                post.heichel.id   
                            }/?${pt}">${series.prateem.name}</a>
                        </div>
                        </div>`
	
	if (window.doesOwn) {
		html += /*html*/ `
                            <a href="/${
                                `heichelos/${
                                    post.heichel.id
                                }/edit?type=post&id=${post.id}${
                                    getLinkHrefOfEditing()
                                }"`
                            }">Edit post</a>
                        `;
	}
	return html;
	
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


function addTab({
	
	header,
	content,
	append,
	addClasses = false,
	parent = null,
	btnParent = null,
	tabParent = null,
	onswitch,
	onopen,
	onclose,
	oninit
}) {
	if (
	
		!parent ||
		!btnParent
	) return console.log("Need to supply 'parent' and 'btnParent' params");
	
	var par = parent;
	var btnPar = btnParent;
	
	var btn = document.createElement(
		"div");
	btn.className = "tab-button"
	btnPar.appendChild(btn);
	btn.textContent = header;
	
	
	var tab = document.createElement(
		"div");
	tab.awtsTabBtn = btn;
	tab.className = "tab-container";
	par.appendChild(tab);
	
	var info = document.createElement(
		"div")
	info.className = "post-info";
	tab.appendChild(info)

	var commentHeader = document.createElement("div")
	commentHeader.classList.add("comment-header")
	info.appendChild(commentHeader);
	
	var bck = document.createElement(
		"div");
	bck.className = "back-btn";
	bck.textContent = "Back";
	commentHeader.appendChild(bck);
	
	var hdr = document.createElement(
		"div");
	hdr.className = "info-header";
	hdr.textContent = header;
	commentHeader.appendChild(hdr);
	tab.awtsHeader = hdr;
	
	var actualTab = document
		.createElement("div");
	actualTab.className = "tab-content";
	tab.actual = actualTab;
	if (content)
		appendHTML(content, actualTab);
	if (typeof (append) == "function") {
		append(actualTab)
	}
	//       actualTab.innerHTML = content;
	info.appendChild(actualTab);
	var tabHidden = true;
	var tabParent = (tabParent ||
		btnPar);
	btn.onclick = async () => {
		
		tabParent.classList.add(
			"backScreen")
		if (!addClasses)
			btnPar.classList
			.remove("active")
		par.classList.add(
			"active");
		
		if (!addClasses)
			Array.from(par
				.children)
			.forEach(n => {
				n.classList
					.remove(
						"active"
					)
				
			});
		tab.classList.add(
			"active");
		if (typeof (onopen) ==
			"function") {
			await onopen({
				tab,
				actualTab
			})
		}
		
	}
	
	bck.onclick = async () => {
		tabParent.classList
			.remove(
				"backScreen");
		tabParent.classList.add(
			"active");
		onswitch?.({tab: tabParent})
		// if(addClasses) {
		tab.classList.remove(
			"active")
		if (typeof (onclose) ==
			"function") {
			await onclose({
				tab,
				actualTab
			})
		}
		actualTab.innerHTML = "";
		
		// par.classList.remove("active");
		
		/*setTimeout(()=>{
		    tab.classList.remove("active")

		}, 1000)*/
		;
	}
	oninit?.(tab);
	tab.awtsRefresh = () => {
		actualTab.innerHTML = "";
		onopen?.({
				tab,
				actualTab
			});
	};
	tab.onUpdateHeader = /*change header*/ (header) => {
		tab.awtsHeader.innerText = header;
		tab.awtsTabBtn.innerText = header;
	}
	return tab;
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
	cur?.scrollIntoViewIfNeeded();
}





function showCustomContextMenu(x, y) {
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
      const textToCopy = selectedText || "Default text to copy";
      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log(`Copied: "${textToCopy}"`);
      }).catch(err => {
        console.error("Failed to copy text:", err);
      });
    }
  };

  // Remove any existing menu to avoid duplicates
  const existingMenu = document.getElementById("custom-context-menu");
  if (existingMenu) existingMenu.remove();

  // Create the menu container
  const menu = document.createElement("div");
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

  // Loop through each action in the menuActions object to create menu items
  for (const [label, action] of Object.entries(menuActions)) {
    const menuItem = document.createElement("div");
    menuItem.innerText = label;
    menuItem.style.padding = "8px 16px";
    menuItem.addEventListener("click", () => {
      const selectedText = getSelectedText();
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
  showCustomContextMenu(e.pageX, e.pageY);
});



async function interpretPostDayuh(post) {
	var dayuh = post?.dayuh;
	if(!dayuh || typeof(dayuh) != "object") {
		return null;
	}
	var sec = dayuh?.sections;
	
	if (Array.isArray(
		sec
	)) {
		var sectionId = 0;
		for(var w of sec) {
			w = (w => )(w);
			
			w = await getReferences({sectionText:w});
			var isRef = typeof(w) == "object" &&
				w?.isReference;
			
			if(Array.isArray(w.texts)) {
				for(var ref of w.texts) {
					await generateSection({
						sectionText: ref,
						sectionId,
						allSections: sec,
						isReference: true,
						referenceInfo: w
					})
					sectionId++;
				}
			} else {
				await generateSection({
					sectionText: ref,
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

	w = w.replace(sub, "")

	var refEnd = w.indexOf(refEnd)
	if(refEnd < 0) return w
	var refObj = w.slice(hasRef + refS, refEnd)
	var p = null;
	try {
		p = JSON.parsE(refObj)
	} catch(e) {}
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
				}/series/sourceSeries/details?` + 
				new URLSearchParams({
					propertyMap: {
					
						posts
						
					}
				})
			)).json()
		} catch(e){
			console.log(e,p,w)
		}
		
		
		
	}

	if(!seriesDetails) return w;
	seriesInfo[sourceSeries] = seriesDetails;
	var startPostId = seriesDetails.posts[postStart]
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

	var endPostDetails = otherPostInfo[startPostId];
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
	var samePost = false
	if(endPostId != startPostId) {
		var startRefs = startPostDetails?.dayuh?.sections.slice(
			sectionStart
		)
		samePost
		var endRefs = endPostDetails?.dayhu?.sections.slice(
			0, sectionEnd
		);
		refs = [startRefs, endRefs].flat()
	} else {
		refs = startPostDetails?.dayuh?.sections.slice(
			sectionStart, sectionEnd
		)
	}
	return {
		texts: refs,
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
function generateSection({
	sectionText, sectionId,
	allSections, isReference=false,
	referenceData
}) {
	if(!window.sectionData) {
		window.sectionData = []
	}
	var a = allSections;
	var w = sectionText;
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
		sectionInfo.referenceData = referenceData
	}
	
	var content = document
		.createElement("div")

	content.classList.add("toichen")
	
	el.appendChild(content)
	realPost
		.appendChild(
			el
		);
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
			h(w, i,
				a
			)
		appendHTML
			(r,
				content
			)
		
	} else {
		appendHTML
			(w,
				content
			)
		
	}
	window.sections = Array.from(document.querySelectorAll(".section"));
	makeSectionActive(0);
}
export {
	getLinkHrefOfEditing,
	makeNavBars,
	addTab,
	
	appendHTML,

	makeInfoHTML,
	makeSectionActive,
	loadFontSize,
	adjustFontSize,
	startHighlighting,
	updateQueryStringParameter,
	interpretPostDayuh,
	scrollToActiveEl,
	highlightActiveDiv
  
}
