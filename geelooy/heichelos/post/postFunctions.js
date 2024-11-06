//B"H


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
	return `&editingAlias=${
		window.curAlias
	    }&parentSeriesId=${
		series.id
	    }&indexInSeries=${
		indexInSeries
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
	appendHTML
  
}
