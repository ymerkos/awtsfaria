//B"H
function highlightActiveDiv() {
  const parentDiv = document.getElementById('realPost'); // Replace 'scrollable-div' with your parent div's ID
  const targetClass = 'section'; // Replace 'my-div-class' with the actual class of your divs
  const targetDivs = Array.from(parentDiv.querySelectorAll(`.${targetClass}`));
    
    const scrollTop = parentDiv.scrollTop;
    const parentHeight = parentDiv.clientHeight;
    const middleThreshold = scrollTop + (parentHeight * 0.8); // Middle of the visible area
    const offset = 50; // Adjust this value to set how far below the middle threshold to activate
    const adjustedThreshold = middleThreshold + offset; // Adjusted threshold

    let activeDiv = null;

    // Find the first visible div with the target class
    for (const div of targetDivs) {
        const divTop = div.offsetTop;
        const divBottom = divTop + div.offsetHeight;

        // Check if the div's top is below the adjusted middle threshold
        if (divTop < adjustedThreshold && divBottom > middleThreshold) {
            activeDiv = div;
            break; // Exit loop once the active div is found
        }
    }

    // If no active div is found, check for the last div when scrolling down
    if (!activeDiv) {
        // Check if the last div is within the view
        const lastDiv = targetDivs[targetDivs.length - 1];
        const lastDivTop = lastDiv.offsetTop;

        if (scrollTop + parentHeight >= lastDivTop) {
            activeDiv = lastDiv; // Set last div as active if it’s in view
        }
    }

    // Remove the 'active' class from all divs with the target class
    targetDivs.forEach(div => div.classList.remove('active'));

    // Add the 'active' class to the active div if found
    if (activeDiv) {
        activeDiv.classList.add('active');
    }
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
	onopen,
	onclose
}) {
	if (
	
		!parent ||
		!btnParent
	) return console.log("Need to supply 'parent' and 'btnParent' params");
	
	var par = parent;
	var btnPar = btnParent
	var btn = document.createElement(
		"div");
	btn.className = "tab-button"
	btnPar.appendChild(btn);
	btn.textContent = header;
	
	var tab = document.createElement(
		"div");
	tab.className = "tab-container";
	par.appendChild(tab);
	
	var info = document.createElement(
		"div")
	info.className = "post-info";
	tab.appendChild(info)
	
	var bck = document.createElement(
		"div");
	bck.className = "back-btn";
	bck.textContent = "Back";
	info.appendChild(bck);
	
	var hdr = document.createElement(
		"div");
	hdr.className = "info-header";
	hdr.textContent = header;
	info.appendChild(hdr);
	
	var actualTab = document
		.createElement("div");
	actualTab.className = "tab-content";
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
	return tab;
}


export {
	getLinkHrefOfEditing,
	makeNavBars,
	addTab,
	
	appendHTML,

	makeInfoHTML,
	makeSectionActive,
	loadFontSize,
	adjustFontSize
  
}
