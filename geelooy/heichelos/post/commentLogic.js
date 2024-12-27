//B"H
import {CommentSection} from "./CommentSection.js";
import {

	getCommentsByAlias, 
	getCommentsOfAlias,
	getComment,
	deleteComment,
	AwtsmoosPrompt
	
} from "/scripts/awtsmoos/api/utils.js";
import playText from "/heichelos/post/playText.js"

import {sendIt} from
	"/scripts/awtsmoos/api/helperScripts/s3-manager.js"

import {
	addTab,
	updateQueryStringParameter,
	getLinkHrefOfEditing,
	isFirstCharacterHebrew
	
} from "/heichelos/post/postFunctions.js";


import {
	markdownToHtml
} from "/heichelos/post/parsing.js"

var loadingHTML = /*html*/`<div class="center loading">
<div class="loading-circle"></div>
</div>`;


var currentVerse = 0;
var data = {
	aliases: null
}
function sanitizeComment(cnt) {
	try {
		var p = new DOMParser();
		var dc = p.parseFromString(cnt, "text/html")
		var cl = dc.querySelector(".links_in_title");
		if(!cl) return cnt;
		//cl.parentNode.parentNode.removeChild(cl.parentNode);
		return dc.body.innerHTML
	} catch(e) {
		return cnt;	
	}
}
var curTab = null;
function addImageGallery(images, parent) {
	if (images && Array.isArray(images)) {
		const imageGallery = document.createElement("div");
		imageGallery.className = "image-gallery";
		
		images.forEach(image => {
		    const img = document.createElement("img");
		    img.src = image.medium || image.img;
		    img.alt = "Comment Image";
		    img.dataset.fullImageUrl = image.img || "";
		    img.onclick = () => openImageViewer(img.dataset.fullImageUrl);
		    imageGallery.appendChild(img);
		});
		
		//cmCont
		parent.appendChild(imageGallery);
	}
}
async function makeHTMLFromComment({
	comment,
	aliasId,
	tab
}) {
	console.log("Comment", comment);

	// Create main comment container
	var cmCont = document.createElement("div");
	cmCont.className = "comment-content";
	cmCont.dataset.cid = comment.id;
	tab.appendChild(cmCont);

	function forEachTxt(content, title="", section=false) {
		// Add the comment text
		var commentTitle = null;
		if(title) {
			
			commentTitle = document.createElement("div");
			commentTitle.className="commentTitle"
			commentTitle.innerHTML = title
			cmCont.appendChild(commentTitle);
		}
		console.log("Section com",section,title,content);
		var commentText = document.createElement("div");
		commentText.className = "comment-text"+ (section?" section" : "");
		
		commentText.innerHTML = markdownToHtml(sanitizeComment(content));
		if(!isFirstCharacterHebrew(content)) {
			cmCont.classList.add("en")
		} else {
			cmCont.classList.add('heb')
		}
		cmCont.appendChild(commentText);
	}
	if(comment.content) {
		forEachTxt(comment.content)
	}
	if(Array.isArray(comment.dayuh.sections)) {
		comment.dayuh.sections.forEach(s => {
			forEachTxt(s?.text || s,s.title,true);
		})
		console.log("Sectionign",comment.dayuh.sections)
	}

	// Display images if available
	var d = comment?.dayuh;
	const images = d?.images;
	
	addImageGallery(images,cmCont);
	// Optional sections
	console.log("awts Comment",d);
	/*var sc = d ? d.sections : null;
	if (sc) sc.forEach(q => {
		var cs = document.createElement("div");
		cs.className = "comment-section";
		cs.innerHTML = markdownToHtml(sanitizeComment(q));
		cmCont.appendChild(cs);
	});*/

	// Three-dot menu
	var menuContainer = document.createElement("div");
	menuContainer.className = "menu-container";
	cmCont.appendChild(menuContainer);

	var menuButton = document.createElement("div");
	menuButton.className = "menu-button";
	menuButton.innerText = "⋮";
	menuContainer.appendChild(menuButton);

	var menuOptions = document.createElement("div");
	menuOptions.className = "menu-options";
	menuOptions.style.display = "none"; // Hidden by default
	menuContainer.appendChild(menuOptions);

	// Menu options

	
	var opts = ["Reply", "Copy"];
	if(window?.curAlias == comment.author) {
		opts = opts.concat(["Edit", "Add Audio", "Delete"])
	}
	var tr = comment?.dayuh?.transcripted;
	if(tr) {
		if(window?.curAlias == comment.author) {
			opts.push("Add Timesheet")
		}
		opts.push("Play");
		
		
		var bucket = tr["bucket"]
		var path = tr["path"]
		if(!bucket || !path) {
			console.log("No bucket",comment)
			return
		}
		// Create the audio element
		var audio = document.createElement("audio");
		audio.controls = true; // Adds play, pause, volume controls
		audio.src = `https://${bucket}.awtsmoos.com/${path}`;
		audio.style.display = "none"; // Initially hidden
		audio.dataset.awtsmoosAudio = comment.id
		// Append the audio player to the DOM
		cmCont.appendChild(audio);
	
	
	}
	opts.forEach(option => {
		var menuItem = document.createElement("div");
		menuItem.className = "menu-item";
		menuItem.innerText = option;
		menuItem.onclick = () => handleMenuOption(option, comment, menuItem); // Call a function for each option
		menuOptions.appendChild(menuItem);
	});

	// Toggle the menu when clicking the three dots
	menuButton.onclick = (e) => {
		e.stopPropagation(); // Prevent other click handlers from triggering
		menuOptions.style.display = menuOptions.style.display === "none" ? "block" : "none";
	};

	// Close menu when clicking outside
	document.addEventListener("click", (e) => {
		if (!menuContainer.contains(e.target)) {
			menuOptions.style.display = "none";
		}
	});
/*
	// Handle single-click and long-click on the comment text
	let clickTimeout;
	commentText.onmousedown = (e) => {
		clickTimeout = setTimeout(() => {
			// Long-click action
			handleLongClick(comment);
		}, 500); // Long-click delay (500ms)
	};

	commentText.onmouseup = (e) => {
		clearTimeout(clickTimeout); // Cancel long-click if released early
		// Single-click action
		handleClick(comment);
	};*/

	

	return comment;
}

function openImageViewer(url) {
    if (url) {
        window.open(url, "_blank");
    }
}	
var timesheet = null;
var loop = null;
async function handleMenuOption(option, comment, el) {
	console.log("Selected:", option, "on comment:", comment);
	switch(option) {
		case "Edit": 
			alert("Coming soon iyh!") 
		break;
		case "Delete":
			try {
				var h = await deleteComment({
					heichelId: post.heichel.id,
					parentType: "post",
					parentId: post.id,
					seriesId: series.id,
					postId: post.id,
					aliasId: window.curAlias,
					commentId: comment.id
				})
				console.log(h) 
				await AwtsmoosPrompt.go({
		                    isAlert: true,
		                    headerTxt: "Successfully deleted that comment",
		                });
			} catch(e) {
				console.log(e.stack);
				await AwtsmoosPrompt.go({
		                    isAlert: true,
		                    headerTxt: "There was an issue deleting. " + e.stack,
		                });
			}
		break;
		case "Reply": 
			alert("Coming soon iyh!") 
		break;
		case "Play":
			var aud = document.querySelector("audio[data-awtsmoos-audio='" + comment.id + "'");
			if(!aud) return alert("Issue");
			var isPlaying = false;
			var tm = comment?.dayuh?.timesheet;
			var sheet = null;
			window.audio = aud;
			if(tm) {
				
				sheet = await (
					await fetch(
						"https://" + 
						tm.bucket + 
						".awtsmoos.com/"
						+ tm.path
					)
				).json()
				window.timesheet = tm;
			}
			if(sheet) {
				var els = sheet.monologues[0].elements
				if(!els) return alert("Something's weird")
				var map = createTimeHashMap(els);
				
				if(!loop) {
				var lastText = null;
				loop = () => {
					var t = aud?.currentTime;
					
					if(t) {
						
						var entry = findCurrentElementHashMap(t,map)
						if(entry !== null) {
							var letter = entry.value;
							if(
								letter != lastText &&
								letter !== null
							) {
								lastText = letter;
								console.log(letter, t)
								playText(letter)
							} else {
								console.log("WHAT again",letter)
							}
						}
						
					} else {
						console.log("WHAT", sheet)	
					}
					requestAnimationFrame(loop);
				};
				loop()
				console.log("Started loop",sheet,sheet?.monologues?.[0])
				}
			}

			function createTimeHashMap(array, resolution = 0.01) {
			    var gro = groupTimedData(array);
			    const hashMap = new Map();
			
			    gro.forEach(item => {
				for (let t = item.ts; t <= item.end_ts; t += resolution) {
				    const roundedTime = Math.round(t * (1 / resolution)) / (1 / resolution); // Match the resolution
				    hashMap.set(roundedTime, item);
				}
			    });
			
			    return hashMap;
			}
			
			// Lookup in the hash map
			function findCurrentElementHashMap(time, hashMap, resolution = 0.01) {
			    const roundedTime = Math.round(time * (1 / resolution)) / (1 / resolution);
			    var val = hashMap.get(roundedTime);
			   return val || null;
			}

			function groupTimedData(input) {
			    let groupedData = [];
			    let currentGroup = null;
			
			    input.forEach(item => {
			        if (item.ts !== undefined && item.end_ts !== undefined) {
			            // Save the current group if it exists
			            if (currentGroup) {
			                groupedData.push(currentGroup);
			            }
			            // Start a new group
			            currentGroup = { 
			                type: "text",
			                value: item.value,
			                ts: item.ts,
			                end_ts: item.end_ts
			            };
			        } else {
			            // Append to the current group
			            if (currentGroup) {
			                currentGroup.value += item.value;
			            } else {
			                // In case of no prior timed data
			                throw new Error("Encountered punctuation or text without timing before any valid timed data.");
			            }
			        }
			    });
			
			    // Push the last group if it exists
			    if (currentGroup) {
			        groupedData.push(currentGroup);
			    }
			
			    return groupedData;
			}


			
			
			if(!aud.paused) {
				aud.pause()
				el.textContent = "Play"
				isPlaying = false;
			} else {
				aud.play();
				el.textContent = "Pause"
				isPlaying = true;
			}
		break;
		case  "Add Timesheet": 
			//B"H
			var auth = comment.author;
			
			if(window?.curAlias != auth) {
				alert("You're current alias " + window?.curAlias + 
				      	"is not the author of that comment!")
				return;
			}
			var search = new URLSearchParams(location.search)
			var verseNum = search.get("idx")
			if(!verseNum && verseNum !== 0) {
				verseNum = "root"
			}
			var r = null;
			try {
				r = await  selectAndUpload({
					type: "timesheet",
					heichel: post.heichel.id,
					series: series.id,
					postId: post.id,
					verseNum,
					author: auth
				})
				alert("Did we upload? " + JSON.stringify(r));
			} catch(e) {
				alert("Issue upladoing " + e.stack)
				console.log(e);
				return;
			}
			var a  = await (await 
			        fetch(`/api/social/heichelos/ikar/post/${
				      post.id
				}/comments/`, {
			     method: "PUT",
			      "body": new URLSearchParams({
			        aliasId:window?.curAlias,
			        commentId: comment.id,
			        
			        dayuh: JSON.stringify({
			           
			            timesheet: {
					BH: "Boruch Hashem",
					time: Date.now(),
					...r
				    }
			        })
			      }),
			   
			    })
			).json()
			if(a.message) alert(a.message)
			if(a.error) alert("An erro!" + a.error.message)
		break;
		case  "Add Audio": 
			//B"H
			var auth = comment.author;
			
			if(window?.curAlias != auth) {
				alert("You're current alias " + window?.curAlias + 
				      	"is not the author of that comment!")
				return;
			}
			var search = new URLSearchParams(location.search)
			var verseNum = search.get("idx")
			if(!verseNum && verseNum !== 0) {
				verseNum = "root"
			}
			var r = null;
			try {
				r = await  selectAndUpload({
					type: "audio",
					heichel: post.heichel.id,
					series: series.id,
					postId: post.id,
					verseNum,
					author: auth
				})
				alert("Did we upload? " + JSON.stringify(r));
			} catch(e) {
				alert("Issue upladoing " + e.stack)
				console.log(e);
				return;
			}
			var a  = await (await 
			        fetch(`/api/social/heichelos/ikar/post/${
				      post.id
				}/comments/`, {
			     method: "PUT",
			      "body": new URLSearchParams({
			        aliasId:window?.curAlias,
			        commentId: comment.id,
			        
			        dayuh: JSON.stringify({
			           
			            transcripted: {
					time: Date.now(),
					...r
				    }
			        })
			      }),
			   
			    })
			).json()
			if(a.message) alert(a.message)
			if(a.error) alert("An erro!" + a.error.message)
		break;
		case "Copy":
			try {
				navigator.clipboard.writeText(comment?.content)
			} catch(e) {
				alert("ISsue copying " + e.stack)
				console.log(e)
			}
		break;
	}
	// Define actions for each option: Reply, Copy, Edit, etc.
}

function handleClick(comment) {
	console.log("Comment clicked:", comment);
	// Action for single-click
}

function handleLongClick(comment) {
	console.log("Long-click on comment:", comment);
	// Action for long-click
}

async function countCommentsOfAlias(alias) {
	var subSec = getSubSecIdx();
	var comCount = await getCommentsOfAlias({
		postId: post.id,
		heichelId: post.heichel.id,
		aliasId: alias,
		get: {
			verseSection: currentVerse,
			map: true,
			count: true,
			propertyMap: JSON.stringify({
				//var subSec = getSubSecIdx();
				...(
					subSec || subSec === 0 ? {
						dayuh: {
							subSectionIndex: {
								equals: subSec
							}
						}
					} : {}
				)
			})
				
		}
	});
}

async function showAllComments({
	alias,
	post,
	tab /*actualTab parent*/,
	withCurrentVerse = true
}) {
	var subSec = getSubSecIdx();
	var coms = await getCommentsOfAlias({
		postId: post.id,
		heichelId: post.heichel.id,
		aliasId: alias,
		get: {
			verseSection: currentVerse,
			map: true,
			propertyMap: JSON.stringify({
				content: true,
				author,
				dayuh: {
					verseSection: true,
					sections: true,
					images: true,
					...(
						subSec || subSec === 0 ? {	
							subSectionIndex: {
								equals: subSec
							}
						} : {}
					)
				}
			})
				
		}
	});
	if(Array.isArray(coms)) {
	  coms = coms.reverse()
      
    
	} else {
		return console.log("No comments")
	}
	if(coms.length == 0) {
		tab.innerHTML = "No comments yet from this user";
		return
	}
	tab.innerHTML = "";
	var ri = document. createElement("div")
	ri.className = "btn"
	//
	var comments= []
	console. log("got", window.j=comments)

	ri. textContent = "read inline"
	ri. onclick = ()=>{
		
		toggleInlineForComments(
			comments, alias  
		);
		if(isAliasInline(alias)) {
			ri.textContent = "Hide inline";
		
		} else {
			ri.textContent = "Read inline";
		}
		

	}
	tab.innerHTML = loadingHTML;
	

	
	for(var comment of coms) {
		//var postId = getPostId(currentVerse)
		/*
		var comment = await getComment({
			heichelId: post.heichel.id,
			commentId:w,
			postId,
			seriesId: getSeriesId(currentVerse),
			aliasId: alias,
			parentType: "post",
			parentId: postId,
		});
		comment.id = w;*/
		
	//	if(comment?.content?.trim() || comment?.dayuh?.images?.length)
			comments.push(comment);
		
	}
	
	tab.innerHTML = "";
	tab.appendChild(ri);
	comments = comments.reverse()
	for(var c of comments) {
		var com= await makeHTMLFromComment({
			comment: c,
			aliasId: alias,
			
			tab
		})
	}

	
  if(isAliasInline(alias)) {
    ri.textContent = "Hide inline";
    
  } else {
    ri.textContent = "Read inline";
  }
}

var inlineComments = {}//arrays by alias

function addCommentsInline(comments, alias) {
    
    	console.log("adding inline comments",comments,alias)
	var sections= Array. from(document
	.querySelectorAll(".section"))
	sections. forEach(w=>{
		var idx=w. dataset.idx
		var com= comments. filter(c=>(
			c?.dayuh?.verseSection== idx
		
		))
		
		if(!com?.length) return// console. log("NOTHING");
		console.log("Doing comments",com)
		var commentHolder = null
		var subSecs = {}
		var inlineCommentHolder = null;
		com. forEach(c=>{
			if(!inlineComments[alias]) {
				inlineComments[alias] = [];
			}
			var ind = inlineComments[alias].find(w => w.id == c.id)
			
			if(!ind) {
				inlineComments[alias].push(c);
				var incom = makeInlineComment(alias, c);
				
				var sub = c?.dayuh.subSectionIndex;
				console.log("Comment?",c,sub)
				if(sub || sub === 0) {
					
					if(!subSecs[sub]) {
						subSecs[sub] = []

						var ob = {
							div: document.createElement(
								"div"
							),
							sub,
							first: c
						}
						ob.div.classList.add("sub-section");
						ob.div.dataset["subSectionComments"]
						=sub;
						subSecs[sub].push(ob);
						var subSecDiv = w.querySelector(
							".sub-awtsmoos[data-idx='"
								+sub+
							"']"	
						);
						if(subSecDiv) {
							inlineCommentHolder = 
								makeInlineCommentHolder(
									alias, subSecDiv
								);
						}
						
					}
					if(inlineCommentHolder) {
						inlineCommentHolder.appendChild(incom);
					}
				} else {
					if(!commentHolder) {
						commentHolder = makeInlineCommentHolder(alias, w);
					}
					commentHolder.appendChild(incom);
					console.log(window.ch=commentHolder,window.inc = incom);
				}
			}
	
		})
      
    
    
    

    });
    var p = getInlineAliases();
	var ali = p.indexOf(alias);
	if(ali < 0) {
	  p.push(alias);
	  
	}
	if(p.length) {
		updateQueryStringParameter("inline", JSON.stringify(p));
	}
	//console.log("Looking",p,alias);
}

function makeTooltip(msg=null) {
	var toolTip = document.createElement("div")
	toolTip.classList.add("awtsmoosTooltip")
	var icon = document.createElement("div")
	icon.textContent = "i"
	toolTip.appendChild(icon)
	icon.classList.add("tooltipIcon")

	if(msg) {
		var m = document.createElement("div")
		m.textContent = msg
		toolTip.appendChild(m)
		m.classList.add("tooltipContent")
	}
	return toolTip
	
}

function makeInlineComment(alias, comment) {
	var content = comment.content
	var incom= document
	.createElement("div")
	
	
	incom.className="inline-comment"
	if(!isFirstCharacterHebrew(content)) {
		incom.classList.add("en")
	}
	//commentHolder.appendChild(incom);
	var comContent = document.createElement("div")
	
	comContent.innerHTML=markdownToHtml(content)
	var tool = makeTooltip("Open Comment");
	tool.addEventListener("click", async () => {
		console.log("Trying",alias)
		var c = await openCommentsPanelToAlias(alias)
		if(!c) return console.log("Strange",c,alias,comment);
		var con = c.querySelector(`.comment-content[data-cid="${
			comment.id
		}"]`);
		if(con) {
			console.log("Doing",window.con = con,window.comm = comment);
			con?.scrollIntoView();
		} else {
			
			console.log("Didn't get",c,comment,window.c=c,window.comment=comment)
		}
	})
	incom.appendChild(tool);
	incom.appendChild(comContent);
	var images = comment?.dayuh?.images;
	addImageGallery(images,incom);
	
	return incom;
}
function makeInlineCommentHolder(alias, parent) {
	var inlineHolder = document.createElement("div")
	inlineHolder.classList.add("commentator","inline");
	inlineHolder.dataset.alias = alias;
	parent.appendChild(inlineHolder);

	var inHeader = document.createElement("div")
	var a = document.createElement("a")
	a.href = "/@"+alias;
	if(!isFirstCharacterHebrew(alias)) {
		inHeader.classList.add("en")
	}
	
	a.textContent = "@" + alias;
	inHeader.appendChild(a);
	inHeader.classList.add("alias-name");
	inlineHolder.appendChild(inHeader);

	var commentHolder = document.createElement("div")
	
	commentHolder.classList.add("comments-holder-inline");
	inlineHolder.appendChild(commentHolder);
	return commentHolder;
}

function getInlineAliases() {
  var url = new URL(window.location);
  var inlineParam = url.searchParams.get("inline");
  var p = null;
  try {
    p = JSON.parse(inlineParam);
    if(p && Array.isArray(p)) {
      return p;
    } else return []
  } catch(e) {
      return [];
  }
}

function hideCommentsInline(comments, alias) {
	var inl = inlineComments[alias]
	if(inl) {
		inlineComments[alias] = null;
	}
  const url = new URL(window.location);
  var inline = document.querySelectorAll(
    ".commentator.inline[data-alias='" + alias + "']"
  )
  .forEach(w=>w.parentNode.removeChild(w));
  
  var p = getInlineAliases();
  if(!p.length) {
     // Get the current URL
    
    
    // Update the query parameter
    url.searchParams.delete("inline");
  } else {
     var idx = p.indexOf(alias);
     if(idx > -1) {
       p.splice(idx, 1);
       updateQueryStringParameter("inline", JSON.stringify(p));
     }
  }

  
  // Push the new URL to the history
  //window.history.pushState({ path: url.href }, '', url.href);
}

function areCommentsInline() {
  var GET = new URLSearchParams(location.search);
  return  GET.get("inline");
}

function isAliasInline(alias) {
	var GET = new URLSearchParams(location.search);
 	var inline = GET.get("inline")
	var p = null;
	try {
		p  = JSON.parse(inline);
		return Array.isArray(p) ?
			p.indexOf(alias) >= 0
			: false
	} catch(e) {}
	return false;
}
function currentCommentsInline() {
  
}

function toggleInlineForComments(comments, alias) {
  var isInline = isAliasInline(alias);
  if(!isInline) {
    addCommentsInline(comments, alias)
    
  } else {
    hideCommentsInline(comments, alias)
  }
}

function curVerse() {
	var p = new URLSearchParams(location.search);
	return p.get("idx")
}

async function openCommentsOfAlias({
	alias, actualTab, post, mainParent,
	all=false
}) {

	var commentors = actualTab.querySelector(".commentors")
	console.log("GOT",commentors)
	if(commentors) actualTab = commentors;
	var parTab = actualTab;

	var hasSections = Array.isArray(post?.dayuh?.sections);
	await showAllComments({
		tab: actualTab,
		post,
		alias,
		withCurrentVerse: !all
	});
	var ld = actualTab.querySelector(".loading")
	console.log("LOADIN",ld)
	if(ld) ld.parentNode.removeChild(ld)

	return;
   
   
	
    
  }
/*
function getIdx() {
	var sp = new URLSearchParams(location.search);
	
	var idxNum  = sp.get("idx");
	return idxNum
}*/
async function updateCommentHeader() {
	
	var aliases = await getAndSaveAliases()
	console.log("Updating",aliases)
	window?.tabComment?.onUpdateHeader(
		(aliases.length) + " Commentators for verse: "
		+ (+currentVerse)
	)
}
async function indexSwitch() {
	var idxNum = getIdx();
	currentVerse = idxNum;
	if(!currentVerse && idxNum !== 0) return;
	currentVerse = parseInt(currentVerse);
	var al = getInlineAliases()
	var subSec = null;
	for(var alias of al) {
		var comments = await getCommentsOfAlias({
			postId: post.id,
			heichelId: post.heichel.id,
			aliasId: alias,
			get: {
				verseSection: currentVerse,
				map: true,
				propertyMap: JSON.stringify({
					//var subSec = getSubSecIdx();
					
					content: true,
					dayuh: true,
					...(
						subSec || subSec === 0 ? {
							dayuh: {
								subSectionIndex: {
									equals: subSec
								}
							}
						} : {}
					)
				})
					
			}
		})
		console.log("trying to add",comments)
		addCommentsInline(comments, alias)
	}
	if(curTab) {
		if(curTab == "root" ) {
			reloadRoot();
			
			await updateCommentHeader();
			return;
		}
		
		curTab?.awtsRefresh?.();	
	}
}

function getIdx() {
	var s = new URLSearchParams(location.search)
	var idx = s.get("idx")
	if(idx === null) return null;
	idx = parseInt(idx)
	return idx;
}


function getSubSecIdx() {
	var s = new URLSearchParams(location.search)
	var idx = s.get("sub")
	if(idx === null) return null;
	idx = parseInt(idx)
	return idx;
}
async function reloadRoot() {
	return await loadRootComments({
		post, 
		mainParent, 
		parent, 
		rootTab,
		tab: tabComment
	});
	
}


function getPostId(currentVerse) {
	var sectionInfo = window?.sectionData[currentVerse];
	var commentPost = post.id;
	var sp = sectionInfo?.referenceInfo?.postId
	if(sp) {
		commentPost = sp;
	}
	return commentPost
}
function getSeriesId(currentVerse) {
	var sectionInfo = window?.sectionData[currentVerse];
	var commentPost = window?.series?.id
	var sp = sectionInfo?.referenceInfo?.sourceSeries
	if(sp) {
		commentPost = sp;
	}
	return commentPost
}
//window.series.id

function openPanel() {
	
	var hid = document.querySelector(".hidden-comments")
	if(hid) hid.classList.remove("hidden-comments")
	var cb = document.getElementById("commentaryBtn");
	if(cb) {
		cb.classList.add("pushed");
	}
}
async function openCommentsPanelToAlias(alias, open=true) {
	var tabs = await reloadRoot();
	var tab = tabs.find(q=>
		q.awtsHeader.textContent.trim().substring(1) == alias
	);
	if(!tab) return null;
	tab?.open();
	if(open) {
		openPanel()
	}
	return tab;
}
async function showAllInlineComments() {
	var inlines = getInlineAliases();
	if(inlines.length == 0) return;
	var tabs = await reloadRoot();
	tabs.forEach(q => {
		inlines.forEach(inl => {
			var hd = q
				.awtsHeader
				.textContent.substring(1).trim();
			if(inl?.includes(hd)) {
				q.open();
			}
		})
	});
	return tabs;
}
window.showAllInlineComments = showAllInlineComments;
window.openCommentsPanelToAlias = openCommentsPanelToAlias;
async function loadRootComments({
	post,
	mainParent,
	parent/*container for comments*/,
	rootTab,
	tab
}) {
	var idx = getIdx();
	currentVerse = idx;
	removeEventListener("awtsmoos index", indexSwitch);
	addEventListener("awtsmoos index" , indexSwitch);
	
	window.post=post;
	window.rootTab=rootTab;
	window.mainParent=mainParent;
	window.parent = parent;
	window.tabComment = tab;
	
	//window.commentTab = tab;
	
	curTab="root";
	var cm = parent
	if (!cm) {
		return console.log("Comments need parent el")
	}
	cm.innerHTML ="";
	
	await updateCommentHeader();
	//await indexSwitch();
	makeAddCommentSection(cm);
	return await makeCommentatorList(cm, tab);
	
	

	
	
	
}

async function getAndSaveAliases(full=false) {
	
	var verseSection = getIdx();
	
	if(!verseSection) {
		verseSection = 0;	
	}
	var commentPost = window?.post?.id;
	if(!data.aliases) {
		data.aliases = {}	
	}
	var savedAliases = data?.aliases?.[verseSection];
/*	if(savedAliases) return full ? 
		savedAliases.aliases : savedAliases.map(;*/
	var subSec = getSubSecIdx();
	var aliases = await getCommentsByAlias({
		postId: window?.post?.id,
		heichelId: window?.post?.heichel.id,
		get: {
			verseSection,
			map: true,
			propertyMap: JSON.stringify({
				...(
					subSec || subSec === 0 ? {
						dayuh: {
							subSectionIndex: {
								equals: subSec
							}
						}
					} : {}
				)
			})
		}
	});
	var aliasIDs = Array.isArray(aliases) ? aliases.map(w=>w.id) : [];
	if(!data.aliases[verseSection]) {
		data.aliases[verseSection] = {
			aliases,
			lastModified: Date.now()
		}
	}
	return aliasIDs;
}

function makeAddCommentSection(par) {
	var div = document.createElement("div")
	div.classList.add("comment-section")
	par.appendChild(div);
	var c = new CommentSection(div);
}
async function makeCommentatorList(actualTab, tab, all=false) {
	var commentorList = document.createElement("div")
	commentorList.classList.add("commentors")
	actualTab.innerHTML = "";
	makeAddCommentSection(actualTab);
	actualTab.appendChild(commentorList);
	commentorList.innerHTML =
		loadingHTML;
	var sectionInfo = window?.sectionData[currentVerse];
	console.log("Getting aliases")
	var aliases = await getAndSaveAliases()
	console.log("Got",aliases)
	commentorList.innerHTML = ""
	
	window.aliasesOfComments =
		aliases;
	
	if (!Array.isArray(aliases) || !
		aliases.length) {
		commentorList.innerHTML =
			"No commentators yet!"
		return [];
	}
	var tabs = [];
	aliases.forEach(w => {
		var com = document
			.createElement(
				"div")
		com.className =
			"comment"
		
	
		var alias = w;
		/**
			parent: mainParent,
			btnParent: actualTab,
			tabParent: tab,

  		**/
		var tab = addTab({
			header: "@" +
				alias,
			btnParent: actualTab,
			addClasses: true,
			
			parent:mainParent,
			tabParent: tab,
			content: "Hi",
			async onswitch({tab}) {
				curTab = "root"//tab;
				await reloadRoot()
				console.log("par?",tab,tab.actual)
			
			},
			
			async onopen({
				actualTab, tab
			}) {
				curTab = tab;
				
				commentorList.innerHTML = loadingHTML;
				openCommentsOfAlias({
					alias,
					//tab, 
					actualTab,
					mainParent,
					post,
					all
				})
			}
		})
		console.log("Adding tab",window.tabs=tabs,tab);
		tabs.push(tab);
		
	})
	return tabs;
}
async function selectAndUpload({heichel, series, postId, verseNum, author, type="audio"}) {
    // Create a file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
 //   fileInput.accept = "audio/*"; // Restrict to audio files

    // Create a promise to handle file selection
    const filePromise = new Promise((resolve, reject) => {
        fileInput.addEventListener("change", event => {
            const file = event.target.files[0];
            if (file) {
                resolve(file);
            } else {
                reject(new Error("No file selected"));
            }
        });
    });

    // Simulate a click to open the file selector
    fileInput.click();

    try {
        // Wait for the user to select a file
        const file = await filePromise;
       // document.body.removeChild(fileInput); // Clean up the input element

        // Upload the selected file
        const url = URL.createObjectURL(file);
        const result = await uploadBlobToS3(url, heichel, series, postId, verseNum, author, 
					    type=="audio"?"koyl.mp3" : 
					    type=="timesheet" ? "timesheet.json":null
					);

        // Revoke the object URL to free memory
        URL.revokeObjectURL(url);

        console.log("File uploaded successfully:", result);
        return result;
    } catch (error) {
        //document.body.removeChild(fileInput); // Ensure cleanup on error
        console.error("Error uploading file:", error);
        throw error;
    }
}
async function uploadBlobToS3(url, heichel, series, postId, verseNum, author, fileName) {
	if(!fileName) return alert("incorrect filename ")
    // Retrieve AWS credentials and bucket info from localStorage
    const storageKey = "awsCredentials";
    let awsConfig = JSON.parse(localStorage.getItem(storageKey));
    const requiredKeys = ["accessKeyId", "secretAccessKey", "accountId", "bucket"];

    // Check if all required keys are present, otherwise prompt the user
    if (!awsConfig || !requiredKeys.every(key => awsConfig[key])) {
        awsConfig = {};
        requiredKeys.forEach(key => {
            const value = window.prompt(`Enter ${key}:`);
            if (!value) throw new Error(`Missing value for ${key}`);
            awsConfig[key] = value;
        });
        // Save the updated config to localStorage
        localStorage.setItem(storageKey, JSON.stringify(awsConfig));
    }

    // Fetch the blob and prepare it for upload
    const blob = await (await fetch(url)).blob();
    const arr = await blob.arrayBuffer();
    const int = new Uint8Array(arr);

    // Generate the S3 key path
    const key = `heichelos/${heichel}/series/${series}/postId/${postId}/verse/${verseNum}/${author}/${fileName}`;

    // Call the sendIt function
    const result = await sendIt({
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
        accountId: awsConfig.accountId,
        bucket: awsConfig.bucket,
        key: key,
        content: int
    });

    // Return the bucket and path info
    return { bucket: awsConfig.bucket, path: key };
}
async function init({
	post,
	mainParent,
	parent/*container for comments*/,
	rootTab,
	tab
}) {
	window.post=post;
	window.rootTab=rootTab;
	window.mainParent=mainParent;
	window.parent = parent;
	window.tabComment = tab;
	await showAllInlineComments();
}
export {
	init,
	loadRootComments
}
