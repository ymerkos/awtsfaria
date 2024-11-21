//B"H
import {

	getCommentsByAlias, 
	getCommentsOfAlias,
	getComment,
	AwtsmoosPrompt
	
} from "/scripts/awtsmoos/api/utils.js";
import playText from "/heichelos/post/playText.js"

import {sendIt} from
	"/scripts/awtsmoos/api/helperScripts/s3-manager.js"

import {
	addTab,
	updateQueryStringParameter,
	getLinkHrefOfEditing
	
} from "/heichelos/post/postFunctions.js";


import {
	markdownToHtml
} from "/heichelos/post/parsing.js"

var loadingHTML = /*html*/`<div class="center loading">
<div class="loading-circle"></div>
</div>`;


var currentVerse = 0;

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

async function makeHTMLFromComment({
	comment,
	aliasId,
	tab
}) {
	console.log("Comment", comment);

	// Create main comment container
	var cmCont = document.createElement("div");
	cmCont.className = "comment-content";
	tab.appendChild(cmCont);

	// Add the comment text
	var commentText = document.createElement("div");
	commentText.className = "comment-text";
	commentText.innerHTML = markdownToHtml(sanitizeComment(comment.content));
	cmCont.appendChild(commentText);

	// Optional sections
	var d = comment.dayuh;
	var sc = d ? d.sections : null;
	if (sc) sc.forEach(q => {
		var cs = document.createElement("div");
		cs.className = "comment-section";
		cs.innerHTML = markdownToHtml(sanitizeComment(q));
		cmCont.appendChild(cs);
	});

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
		opts = opts.concat(["Edit", "Add Audio"])
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
		/*
		var pl = document.createElement("div")
		pl.classList.add("btn")
		pl.textContent="Play";
  
		cmCont.appendChild(pl);
  */
		// Create the audio element
		var audio = document.createElement("audio");
		audio.controls = true; // Adds play, pause, volume controls
		audio.src = `https://${bucket}.awtsmoos.com/${path}`;
		audio.style.display = "none"; // Initially hidden
		audio.dataset.awtsmoosAudio = comment.id
		// Append the audio player to the DOM
		cmCont.appendChild(audio);
		/*
		// Handle button click to play/pause the audio
		pl.addEventListener("click", () => {
		    if (audio.paused) {
			audio.play();
			pl.textContent = "Pause"; // Change button text to indicate action
		    } else {
			audio.pause();
			pl.textContent = "Play";
		    }
		});*/
	
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
	};

	

	return comment;
}
var timesheet = null;
var loop = null;
async function handleMenuOption(option, comment, el) {
	console.log("Selected:", option, "on comment:", comment);
	switch(option) {
		case "Edit": 
			alert("Coming soon iyh!") 
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
				if(!loop) {
				var lastText = null;
				loop = () => {
					var t = aud?.currentTime;
					
					if(t) {
						
						var letter = getElementForCurrentTime(t,els)
					
						if(letter != lastText) {
							lastText = letter;
							console.log(letter, t)
							playText(letter)
						} else {
							console.log("WHAT again",letter)
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

			//B"H
			
			//B"H


// Function to map current time to a block and check the corresponding elements
function getElementForCurrentTime(t, elements) {
    //const blockIndex = Math.floor(t / blockSize); // Map time to block index
    
    let result = null;

    // Loop through elements and check if they fit into the current block
    for (let i = 0; i < elements.length; i++) {
        const current = elements[i];
        const prev = elements[i - 1];  // Previous element
        const next = elements[i + 1];  // Next element

        // Handle text elements
        if (current.type === "text") {
            // Match text if the current time is within the ts and end_ts range
            if (current.ts <= t && current.end_ts >= t) {
		    
		    result = current.value;
		    if(next && next.type=="punct") {
			result += next.value    
		    }
		    /*
                if(i != lastIndex) {
                    
                   lastIndex = i;
                } else {
                    result = null;
                }*/
                   break;
            }
        }

        // Handle punctuation (and whitespace) without ts/end_ts
        if (current.type === "punct") {
            let start = 0;
            let end = Infinity;

            // Calculate timing for punctuation based on neighboring text elements
            if (prev && prev.type === "text") {
                start = prev.end_ts; // Start after the previous text element
            }

            if (next && next.type === "text") {
                end = next.ts; // End before the next text element
            }

            // If the current time is within the range of start and end
            if (t >= start && t < end) {
		    result = current.value;
		    /*
                if(i != lastIndex) {
                    
                   lastIndex = i;
                } else {
                    result = null;
                }*/
                break; // Stop when a match is found
            }
        }
    }

    return result; // Return matched element or null if no match
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



async function showAllComments({
	alias,
	post,
	tab /*actualTab parent*/,
	withCurrentVerse = true
}) {
	
	var coms = await getCommentsOfAlias({
		postId: getPostId(currentVerse),
		heichelId: post.heichel.id,
		aliasId: alias,
		get: withCurrentVerse?{
			verseSection: currentVerse	
		}:null
	});
	if(Array.isArray(coms)) {
		//    coms = coms.reverse();
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
		var GET = new URLSearchParams(location.search);
		var isInline = GET.get("inline");
		if(!isInline) {
			ri.textContent = "Hide inline"
			
			var sections= Array. from(document
				.querySelectorAll(".section"))
			sections. forEach(w=>{
				var idx=w. dataset.idx
				var com= comments. filter(c=>(
					c?.dayuh?.verseSection== idx
	
				))
				
				if(! com) return console. log("NOTHING");
				console. log("filtered",com)
				com. forEach(c=>{
					var incom= document
					.createElement("div")
					incom.className="inline-comment"
					w.appendChild(incom);
					incom.innerHTML=markdownToHtml(c. content) 
					
	
				})
				
			
			
			
	
			});
			updateQueryStringParameter("inline", alias);
		} else {
			var inline = document.querySelectorAll(".inline-comment")
			.forEach(w=>w.parentNode.removeChild(w))
			ri.textContent = "Read inline";
			 // Get the current URL
			const url = new URL(window.location);
			
			// Update the query parameter
			url.searchParams.delete("inline");
			
			// Push the new URL to the history
			window.history.pushState({ path: url.href }, '', url.href);
		}
		
		

	}
	tab.innerHTML = loadingHTML;
	

				
	for(var w of coms) {
		var postId = getPostId(currentVerse)
		var comment = await getComment({
			heichelId: post.heichel.id,
			commentId:w,
			postId,
			seriesId: getSeriesId(currentVerse),
			aliasId: alias,
			parentType: "post",
			parentId: postId,
		});
		comment.id = w;
		comments.push(comment);
	}
	
	tab.innerHTML = "";
	tab.appendChild(ri);
	for(var c of comments) {
		var com= await makeHTMLFromComment({
			comment: c,
			aliasId: alias,
			
			tab
		})
	}
}

function curVerse() {
	var p = new URLSearchParams(location.search);
	return p.get("idx")
}
/**
	the output of 
 getCOmmentsOfAlias with metadata something like
	
	dayuh: {verseSection: 0}
	id: "BH_1711417923141_commentBy_abarbanel"
	
	dayuh: {verseSection: 3}
	id: "BH_1711417950309_commentBy_abarbanel"

got to gather all objects with same verseSection and store 
the IDs in an array in order
**/
function organizeCommentData(cm) {
	var result = [];
	if(!Array.isArray(cm)) return result;
	cm.forEach(w => {
		var vs = w?.dayuh?.verseSection;
		if(vs || vs === 0) {
			if(!result[vs]) {
				result[vs] = []	
			}
			result[vs].push(w);
		}
	});
	return result;
}
async function showSectionMenu({
	alias, 
	tab, 
	actualTab,
	mainParent,
	post
}) {
	var sections = post?.dayuh?.sections;
	if(!Array.isArray(sections)) {
		return console.log("No sections provided")	
	}
	var sectionHolder = document.createElement("div")
	sectionHolder.className = "comment-holder";

	actualTab.innerHTML = "";
	
	/*first get all of the comment metadata organized by section*/
	var allCommentsMetadata = await getCommentsOfAlias({
		postId: getPostId(currentVerse),
		heichelId: post.heichel.id,
		aliasId: alias,
		get: {
			propertyMap: JSON.stringify({
				dayuh: {
					verseSection: true
				}
			})
		}
	});
	var organized = organizeCommentData(allCommentsMetadata);
	console.log("GOT!",window.a=organized)
	
	organized.forEach((q, i) => {
		if(!q) return;
		var length = q.length;
		if(!length) return;
		var sec = addTab({
			parent: mainParent,
			btnParent: actualTab,
			tabParent: tab,

			onswitch({tab}) {
				curTab = tab;
				console.log("par?",tab,tab.actual)
			},
			
			mainParent,
			
			header: "@" + 
			alias
			+" Section " + (i+1) + " (" + length + ")",
			content: "",
			async onopen({
				actualTab, tab
			}) {
				curTab = tab;
				actualTab.innerHTML = loadingHTML;
				var comments = []
				
				for(var w of q) {
					var comment = await getComment({
						heichelId: post.heichel.id,
						commentId:w.id,
						aliasId: alias,
						parentType,
						parentId,
					});
					comments.push(comment);
					

				}
				actualTab.innerHTML = loadingHTML;
				var comments = []
				
				
				actualTab.innerHTML = "";
				for(var comment of comments) {
					await makeHTMLFromComment({
						comment,
						tab: actualTab,
						
						aliasId,
					})
				}
				
			}
		})
	})
}

async function openCommentsOfAlias({
	alias, tab, actualTab, post, mainParent,
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
	/*
	if(hasSections) {
		var aliasCommentMenu = addTab({
			parent: mainParent,
			btnParent: actualTab,
			tabParent: tab,
			content: loadingHTML,
			
			header: "All comments of @"+alias,
			async onopen({actualTab, tab}) {
				curTab = tab;
				
				actualTab.innerHTML = loadingHTML
				await showAllComments({
					tab: actualTab,
					post,
					alias
				});
			}
			
		})
	
		var aliasCommentMenu = addTab({
			parent: mainParent,
			btnParent: actualTab,
			content: "Loading comments per section...",
			tabParent: tab,
			header: "Comments per section of @" + alias,
			async onopen({actualTab, tab}) {
				curTab = tab;
				actualTab.innerHTML = "";
				actualTab.innerHTML = "Loading comments per section"
				await showSectionMenu({
					alias, tab, actualTab,
					mainParent, post
					
				})
			}
			
		})
	} else {
		await showAllComments({
			tab: actualTab,
			post,
			alias
		});
	}*/
	return;
   
   
	
    
  }
async function indexSwitch(e) {
	var idxNum  = e?.detail?.idx?.dataset?.idx;
	currentVerse = idxNum;
	if(!currentVerse && idxNum !== 0) return;
	currentVerse = parseInt(currentVerse)
	if(curTab) {
		if(curTab == "root" ) {
			reloadRoot();
			rootTab?.onUpdateHeader("Comments for verse " + (+currentVerse + 1))
			return;
		}
		
		curTab?.awtsRefresh?.();	
	}
}
function getIdx() {
	var s = new URLSearchParams(location.search)
	var idx = s.get("idx")
	if(idx == null) return null;
	idx = parseInt(idx)
	return idx;
}
async function reloadRoot() {
	await loadRootComments({post, mainParent, parent, rootTab});
	var idx = getIdx();
	//rootTab?.onUpdateHeader("Comments for verse " + (idx + 1))
	
}
function makeAddCommentSection(el) {
	
	
    var d = document.createElement("div");
    d.classList.add("add-comment-area");
    el.appendChild(d);

    // Initial button that shows the comment box on click
    var btn = document.createElement("div");
    btn.classList.add("btn", "add-comment");
    btn.innerText = "Add a comment...";
    var currentAlias = null;
    btn.onclick = async function () {
	    currentAlias = window.curAlias;
	    if(!currentAlias) {
		await AwtsmoosPrompt.go({
			isAlert: true,
			headerTxt: "You need to be logged in "
				+"(with an alias that has permissions) to comment! See the top right of screen."
		});
		return;
	    }
	    var hasPermission = await (await fetch(`/api/social/alias/${
		    currentAlias
	    }/heichelos/ikar/ownership`)).json();
	    if(!hasPermission.yes) {
		await AwtsmoosPrompt.go({
			isAlert: true,
			headerTxt: "That alias, " +
				currentAlias + " doesn't have permission to post here."
		});
		return;
	    }
	    
        btn.style.display = "none";
        commentBox.style.display = "block";
    };
    d.appendChild(btn);

    // Comment box area
    var commentBox = document.createElement("div");
    commentBox.classList.add("comment-box");
    commentBox.contentEditable = true;
    commentBox.placeholder = "Add a comment...";
    commentBox.style.display = "none";
    d.appendChild(commentBox);

    // Buttons for "Cancel" and "Submit"
    var buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
   // buttonContainer.style.display = "none";
    d.appendChild(buttonContainer);

    var cancelBtn = document.createElement("button");
    cancelBtn.classList.add("btn", "cancel-comment");
    cancelBtn.innerText = "Cancel";
    cancelBtn.onclick = function () {
        commentBox.innerText = ""; // Clear the content
        commentBox.style.display = "none";
        buttonContainer.style.display = "none";
        btn.style.display = "block"; // Show initial "Add comment" button
	    submitBtn.disabled = true
    };
    buttonContainer.appendChild(cancelBtn);

    var submitBtn = document.createElement("button");
    submitBtn.classList.add("btn", "submit-comment");
    submitBtn.innerText = "Comment";
	submitBtn.disabled = true;
    submitBtn.onclick = async function () {
        // Add your submission logic here
	    var oh = submitBtn.textContent;
	    submitBtn.textContent = "Trying to submit comment..."
	    try {
		if(!currentAlias) {
			await AwtsmoosPrompt.go({
				isAlert: true,
				headerTxt: "Don't have current alias"
			});
			return;
		}
		var s = new URLSearchParams(location.search)
		var idx = s.get("idx")
		
		var ob = {
					
		}
		if(idx !== null) {
			idx = parseInt(idx);
			ob.verseSection = idx;
		}
		var json = await (await fetch(
			location.origin + `/api/social/heichelos/${
				window.post?.heichel?.id
			}/post/${
				window.post?.id
			}/comments/`, {
				method: "POST",
				body: new URLSearchParams({
					aliasId: currentAlias,
					content: commentBox.innerText,
					dayuh: JSON.stringify(ob)
				})
			}
					     
		)).json();
		console.log("cOMMENT",json);
		if(json.success) {
			await AwtsmoosPrompt.go({
				isAlert: true,
				headerTxt: "You did it! comments you made appear under your name section below."
			});
			return;
		} else if(json.error) {
			await AwtsmoosPrompt.go({
				isAlert: true,
				headerTxt: "There was an issue: " + json.error
			});
			return;
		}
	    } catch(e) {

		    console.log(e);
		    await AwtsmoosPrompt.go({
				isAlert: true,
				headerTxt: "Something is wrong"
			});
			return;
	    }
	    submitBtn.textContent = oh;
	    curTab?.awtsRefresh?.();
	    reloadRoot()
        console.log("Comment submitted:", commentBox.innerText);
        // Reset the UI
        commentBox.innerText = "";
        commentBox.style.display = "none";
        buttonContainer.style.display = "none";
        btn.style.display = "block";
    };
    buttonContainer.appendChild(submitBtn);

    // Show buttons when typing
    commentBox.oninput = function () {
        buttonContainer.style.display = "flex";
	    submitBtn.disabled = false;
    };
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

async function loadRootComments({
	post,
	mainParent,
	parent/*container for comments*/,
	rootTab
}) {
	var idx = getIdx();
	currentVerse = idx;
	removeEventListener("awtsmoos index", indexSwitch);
	addEventListener("awtsmoos index" , indexSwitch);
	window.post=post;
	window.rootTab=rootTab;
	window.mainParent=mainParent;
	window.parent = parent;
	
	
	curTab="root";
	var cm = parent
	if (!cm) {
		return console.log("Comments need parent el")
	}
	cm.innerHTML ="";
	
	
	
	makeAddCommentSection(cm);
	
	
	addTab({
		header: "All Comments for post",
		btnParent: cm,
		addClasses: true,
		
		parent:mainParent,
		tabParent: commentTab,

		
		
		async onopen({
			actualTab, tab
		}) {
			curTab = tab;
			
			makeCommentatorList(actualTab, tab, true)
		}
	})

	
	addTab({
		header: "Only Comments for Section #"+(+currentVerse + 1),
		btnParent: cm,
		addClasses: true,
		
		parent:mainParent,
		tabParent: commentTab,

		
		
		async onopen({
			actualTab, tab
		}) {
			curTab = tab;
			
			makeCommentatorList(actualTab, tab, false)
		}
	})
	
	
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
	var commentPost = getPostId(currentVerse)
	var aliases =
		await getCommentsByAlias({
			postId: commentPost,
			heichelId: post
				.heichel.id,
			get: all?null:{
				verseSection: currentVerse	
			}
		});
	commentorList.innerHTML = ""
	
	window.aliasesOfComments =
		aliases;
	
	if (!Array.isArray(aliases) || !
		aliases.length) {
		commentorList.innerHTML =
			"No commentators yet!"
		return;
	}
	aliases.forEach(w => {
		var com = document
			.createElement(
				"div")
		com.className =
			"comment"
		
		/*var hd = document.createElement("div")
		hd.className = "alias-name";
		com.appendChild(hd);
		hd.innerHTML = `
		    <a href="/@${
			w
		    }">@${
			w
		    }</a>
		`;*/
		var alias = w;
		/**
			parent: mainParent,
			btnParent: actualTab,
			tabParent: tab,

  		**/
		addTab({
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
				
				//commentorList.innerHTML = loadingHTML;
				openCommentsOfAlias({
					alias,
					tab, 
					actualTab,
					mainParent,
					post,
					all
				})
			}
		})
		
	})
}
async function selectAndUpload({heichel, series, postId, verseNum, author, type="audio"}) {
    // Create a file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
 //   fileInput.accept = "audio/*"; // Restrict to audio files
    fileInput.style.display = "none"; // Hide the input element

    // Append the input to the body to make it clickable
   // document.body.appendChild(fileInput);

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
export {
  loadRootComments
}
