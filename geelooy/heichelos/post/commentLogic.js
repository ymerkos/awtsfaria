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

async function makeHTMLFromCommentID({
	commentId,
	tab
}) {
	var comment = await getComment({
		heichelId: post.heichel.id,
		commentId
	});
	//  console.log("Comment",comment)
	var cmCont = document.createElement("div");
	cmCont.className = "comment-content";
	tab.appendChild(cmCont);
	cmCont.innerHTML = comment.content;
	var d = comment.dayuh;
	var sc = d ? d.sections : null;
	if(sc) sc.forEach(q => {
		var cs = document.createElement("div");
		cs.className = "comment-section"
		cmCont.appendChild(cs);
		cs.innerHTML = q;
	});
}
async function showAllComments({
	alias,
	post,
	tab /*actualTab parent*/
}) {
	var coms = await getCommentsOfAlias({
		postId: post.id,
		heichelId: post.heichel.id,
		aliasId: alias
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
	
	for(var i = 0; i < coms.length; i++) {
		var c = coms[i] //the id;
		/**
		 * we have the IDS now.
		 * need comment content of each
		 */
		await makeHTMLFromCommentID({
			commentId: c,
			tab
		})
	}
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
			mainParent,
			btnParent: actualTab,
			mainParent,
			parent: sectionHolder,
			tabParent: tab,
			header: "Section " + (i+1) + " (" + length + ")",
			async onopen({
				actualTab
			}) {
				actualTab.innerHTML = "Loading comment for section"
			}
		})
	})
}

async function openCommentsOfAlias({alias, tab, actualTab, post, mainParent}) {

	
	var parTab = actualTab;

	var hasSections = Array.isArray(post?.dayuh?.sections);
	if(hasSections) {
		var aliasCommentMenu = addTab({
			parent: mainParent,
			btnParent: actualTab,
			content: "Loading all comments...",
			tabParent: tab,
			header: "All comments of @"+alias,
			async onopen({actualTab}) {
				actualTab.innerHTML = "";
				actualTab.innerHTML = "viewing ALL of his comments"
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
				actualTab.innerHTML = "";
				actualTab.innerHTML = "comments per section"
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
	}
	return;
   
   
	
    
  }

async function loadRootComments({
	post,
	mainParent,
	parent/*container for comments*/
}) {
	var cm = parent
	if (!cm) {
		return console.log("Comments need parent el")
	}
	cm.innerHTML =
		"Contining to load..."
	var aliases =
		await getCommentsByAlias({
			postId: post.id,
			heichelId: post
				.heichel.id
		});
	cm.innerHTML = ""
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
			async onopen({
				actualTab, tab
			}) {
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
