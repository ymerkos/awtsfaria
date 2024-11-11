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
	makeInfoHTML,
	makeSectionActive,
	loadFontSize,
	adjustFontSize,

	updateQueryStringParameter,
	scrollToActiveEl,
	
	startHighlighting,
	highlightActiveDiv,
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


try {
	(async () => {
		await startItAll()
		loadFontSize()
		scrollToActiveEl();
		startHighlighting('realPost','section', div => {
			var idx = div?.dataset.idx
			//console.log("LOADED",div,idx);
			if(!idx) return;
			//var search = new URLSearchParams(location.search);
			//search.set("awtsIdx", div.dataset.idx);
			updateQueryStringParameter("idx", div.dataset.idx);
		});
			
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
