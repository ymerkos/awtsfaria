//B"H
import {

	getCommentsByAlias, 
	getCommentsOfAlias,
	getComment
	
} from "/scripts/awtsmoos/api/utils.js";

import {
	addTab,
	getLinkHrefOfEditing
	
} from "/heichelos/post/postFunctions.js"
var loadingHTML = /*html*/`<div class="center loading">
<div class="loading-circle"></div>
</div>`
function sanitizeComment(cnt) {
	try {
		var p = new DOMParser();
		var dc = p.parseFromString(cnt, "text/html")
		var cl = dc.querySelector(".links_in_title");
		if(!cl) return cnt;
		cl.parentNode.parentNode.removeChild(cl.parentNode);
		return dc.body.innerHTML
	} catch(e) {
		return cnt;	
	}
}
var curTab = null;
async function makeHTMLFromComment({
	comment,
	aliasId,
	parentType,
	parentId,
	tab
}) {
	
	
	
	//  console.log("Comment",comment)
	var cmCont = document.createElement("div");
	cmCont.className = "comment-content";
	tab.appendChild(cmCont);
	cmCont.innerHTML = sanitizeComment(comment.content);
	var d = comment.dayuh;
	var sc = d ? d.sections : null;
	if(sc) sc.forEach(q => {
		var cs = document.createElement("div");
		cs.className = "comment-section"
		cmCont.appendChild(cs);
		cs.innerHTML = sanitizeComment(q);
	});
	return comment;
}
async function showAllComments({
	alias,
	post,
	tab /*actualTab parent*/
}) {
	var coms = await getCommentsOfAlias({
		postId: post.id,
		heichelId: post.heichel.id,
		aliasId: alias,
		get: {
			verseSection: currentVerse	
		}
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
	//tab.appendChild(ri);
	var comments= []
	console. log("got", window.j=comments)

	ri. textContent = "read inline"
	ri. onclick = ()=>{
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
				incom.innerHTML=c. content 
				

			})
			
		
		
		

		});
		
		

	}
	tab.innerHTML = loadingHTML;
	

				
	for(var w of coms) {
		var comment = await getComment({
			heichelId: post.heichel.id,
			commentId:w.id,
			aliasId,
			parentType,
			parentId,
		});
		comments.push(comment);
	}
	
	actualTab.innerHTML = "";
	for(var c of comments) {
		var com= await makeHTMLFromCommentID({
			comment,
			aliasId: alias,
			parentType: "post",
			parentId: post.id,
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
		postId: post.id,
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
			content: loadingHTML,
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
						aliasId,
						parentType,
						parentId,
					});
					comments.push(comment);
					

				}
				actualTab.innerHTML = loadingHTML;
				var comments = []
				
				for(var w of q) {
					var comment = await getComment({
						heichelId: post.heichel.id,
						commentId:w.id,
						aliasId,
						parentType,
						parentId,
					});
					comments.push(comment);
					

				}
				actualTab.innerHTML = "";
				for(var comment of comments) {
					await makeHTMLFromComment({
						comment,
						tab: actualTab,
						parentType: "post",
						parentId: post.id,
						aliasId: alias,
					})
				}
				
			}
		})
	})
}

async function openCommentsOfAlias({alias, tab, actualTab, post, mainParent}) {

	var commentors = actualTab.querySelector(".commentors")
	console.log("GOT",commentors)
	if(commentors) actualTab = commentors;
	var parTab = actualTab;

	var hasSections = Array.isArray(post?.dayuh?.sections);
	await showAllComments({
		tab: actualTab,
		post,
		alias
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
var currentVerse = 0;
async function indexSwitch(e) {
	var idxNum  = e?.detail?.idx?.dataset?.idx;
	currentVerse = idxNum;
	if(curTab) {
		if(curTab == "root" ) {
			reloadRoot();
			rootTab?.onUpdateHeader("Comments for verse " + (currentVerse + 1))
			return;
		}
		
		curTab?.awtsRefresh?.();	
	}
}
async function reloadRoot() {
	await loadRootComments({post, mainParent, parent, rootTab});
	var s = new URLSearchParams(location.search)
	var idx = s.get("idx")
	if(idx == null) return;
	idx = parseInt(idx)
	rootTab?.onUpdateHeader("Comments for verse " + (idx + 1))
	
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

async function loadRootComments({
	post,
	mainParent,
	parent/*container for comments*/,
	rootTab
}) {
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
	var commentorList = document.createElement("div")
	commentorList.classList.add("commentors")
	parent.innerHTML = "";
	parent.appendChild(commentorList)
	
	
	makeAddCommentSection(parent);
	
	
	
	commentorList.innerHTML =
		loadingHTML
	var aliases =
		await getCommentsByAlias({
			postId: post.id,
			heichelId: post
				.heichel.id,
			get: {
				verseSection: currentVerse	
			}
		});
	commentorList.innerHTML = ""
	
	window.aliasesOfComments =
		aliases;
	
	if (!Array.isArray(aliases) || !
		aliases.length) {
		cm.innerHTML =
			"No comments yet!"
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
		addTab({
			header: "@" +
				alias,
			btnParent: cm,
			addClasses: true,
			
			parent:mainParent,
			tabParent: commentTab,
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
					tab, 
					actualTab,
					mainParent,
					post
			        })
			}
		})
		//  cm.appendChild(com);
		/*
                        var cnt = document.createElement("div");
                        cnt.className = "comment-content";
                        cnt.textContent = w;*/
	})
}

export {
  loadRootComments
}
