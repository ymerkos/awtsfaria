//B"H
  console.log("B\"H");
import {
	getHeichelDetails,
	getAliasName,
	getSeries,
	getPost,
	getAPI,
	aliasOwnership,
	getCommentsByAlias,
	getCommentsOfAlias,
	getComment,
	
	
	
} from "/scripts/awtsmoos/api/utils.js";
		    
import {
	getLinkHrefOfEditing,
	makeNavBars,
	addTab,
	appendHTML
} from "/heichelos/post/postFunctions.js"

import {
	loadRootComments
} from "/heichelos/post/commentLogic.js"

var letters = "קראטוןםפשדגכעיחלךףזסבהנמצתץ";
var endMarker = '׃'
var pth = location.pathname.split("/");
var heichel = pth[2];
var parentSeries = pth[4];
var indexInSeries = pth[pth.length - 1]
var num = parseInt(indexInSeries);
if (!isNaN(num)) {
	indexInSeries = num;
}
var alias = null;
async function startItAll() {
	var curAlias = window.curAlias;
	
	var series = await getSeries(
		parentSeries, heichel);
	var post = await getPost(series,
		indexInSeries, heichel);
	var doesOwn =
		await hasHeichelAuthority(
			heichel, curAlias);
	window.doesOwn = doesOwn;
	window.post = post;
	window.series = series;
	if (post) {
		
		var heichelDetails =
			await getHeichelDetails(
				heichel)
		post.heichel = {
			id: heichel,
			...heichelDetails
		};
		
		
		window.post = post;
		var aliasDetails =
			await getAliasName(post
				.author)
		alias = {
			id: post.author,
			...aliasDetails
		};
		addTab({
			header: "Post Info",
			content: "Loading post info...",
			async onopen({actualTab}) {
				var html = makeInfoHTML()
				actualTab.innerHTML = "";
				appendHTML(html, actualTab);
			},
			parent: allTabs,
			btnParent: allTabBtns,
			
			
			
			
		});
		
		
		var commentParams =
			new URLSearchParams({
				type: "comment",
				parentType: "post",
				parentId: post
					.id
			});
		window.commentParams =
			commentParams;
		window.commentTab = addTab({
			header: "Comments",
			parent: allTabs,
			btnParent: allTabBtns,
			append(par) {
				
			},
			async onopen({actualTab}) {
				actualTab.innerHTML = "";
				var content = /*html*/ `
	                                <div id="comments">Loading..</div>
	                            
	                                <a href="${
	                                    `/heichelos/${
	                                        post.heichel.id
	                                    }/submit?${
	                                        commentParams
	                                    }&returnURL=${
	                                    location.href
	                                }`
	                                }">Add new Comment</a>
	                            `;
				appendHTML(content, actualTab);
				await loadRootComments({
					post,
					mainParent: allTabs,
					parent: window.comments
				})
				
			},
			content: "Loading comment aliases..."
		});
		
		var html = makeNavBars(post,
			series,
			indexInSeries)
		var ct = post.content;
		realPost.innerHTML = "";
		if (ct) {
			appendHTML(ct, realPost)
			
		}
		if (post.dayuh) {
			var sec = post.dayuh
				.sections;
			if (Array.isArray(
					sec)) {
				sec.forEach((w, i,
					a) => {
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
					/*var txt = Array
						.from(content.childNodes)
						.map(w=>w.textContent.split("\n").join(" ")
						.split("\r").join(" ")).join(" ");
					console.log(txt)
					content.innerText=""
					var words = []
					var words = txt.split(" ").filter(Boolean)
						.map(w => {
							var wordsAndPunctuation = w.split(endMarker)
							wordsAndPunctuation.forEach(wd => {
								var deeboor = document.createElement("div")
								// Check if it's a word or punctuation
								
								deeboor.classList.add("deeboor")
								if (!wd.trim()) {
									deeboor.classList.add("punctuation")
									deeboor.textContent = endMarker
								} else
									deeboor.textContent = wd;
								content.appendChild(deeboor)
		    					})
							return w
						})
      					
					/*
						
					// Regular expression to match words (including Hebrew) and punctuation separately
					var wordsAndPunctuation = txt.match(/[\w\u0590-\u05FF]+|[^\s\w\u0590-\u05FF]+/g);
					
					wordsAndPunctuation.forEach(item => {
						var deeboor = document.createElement("div");
						
						// Check if it's a word or punctuation
						if (/[\w\u0590-\u05FF]/.test(item)) {
							deeboor.classList.add("deeboor"); // class for words
							words.push(item)
						} else {
							deeboor.classList.add("punctuation"); // class for punctuation
						}
						
						deeboor.textContent = item;
						content.appendChild(deeboor);
					});*/
					/*window.words=words
					if(letters.includes(words[0][0])) {
						el.classList.add("heb")
					}*/
					
				})
			}
		}
		
		appendHTML(html, realPost)
		postTitle.textContent = post
			.title;
		var t = document
			.getElementsByTagName(
				"title")[0]
		if (t) {
			t.innerHTML += "| " +
				post.title
		}
	} else {
		post.innerHTML =
			"Couldn't load post"
	}
	
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





var hidSettings = true;
var hidCom = true;
var sidebar = document.querySelector(
	".sidebar");

var allTabs = document.querySelector(
	".all-tabs");
var allTabBtns = document.querySelector(
	".tab-buttons");




minMax.onclick = () => {
	// postFrame.classList.toggle("with-details")
	postDetails.classList.toggle(
		"hidden-details")
	hidSettings = !hidSettings;
	minMax.classList.toggle(
		"pushed")
	//   minMax.textContent = hid ? "+" : "-"
}

commentaryBtn.onclick = () => {
	hidCom = !hidCom;
	commentaryBtn.classList.toggle(
		"pushed")
	
	///.innerHTML = hidCom ? "+" : "-";
	sidebar.classList.toggle(
		"hidden-comments")
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

  
  if(nm)
    return console.log ("something's up",nm, num);
  nm.classList.add("active")
}

try {
	(async () => {
		await startItAll()
		loadFontSize()
		
			
	})();
} catch (e) {
	realPost.innerHTML =
		"Problem loading! Check console (CTRL+SHIFT+I)"
	console.log(e)
}
async function hasHeichelAuthority(
	heichel, alias) {
	return !!(await (await fetch(`/api/social/alias/${
			alias
		}/heichelos/${
			heichel	
		}/ownership`))
			.json())
		.yes
}
