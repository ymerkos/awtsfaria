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
	loadFontSize,
	adjustFontSize,

	updateQueryStringParameter,
	scrollToActiveEl,
	
	startHighlighting,
	
	appendHTML,
	interpretPostDayuh
} from "/heichelos/post/postFunctions.js"

import {
	loadRootComments,
	init
} from "/heichelos/post/commentLogic.js"

var letters = "קראטוןםפשדגכעיחלךףזסבהנמצתץ";
var endMarker = '׃'
var pth = location.pathname.split("/");
var heichel = pth[2];
var parentSeries = pth[4];
window.parentSeries = parentSeries;
var indexInSeries = pth[pth.length - 1]
var num = parseInt(indexInSeries);
if (!isNaN(num)) {
	indexInSeries = num;
}
var alias = null;
var rootCommentTab = null;
async function startItAll() {
	var curAlias = window.curAlias;
	
	/*var series = await getSeries(
		parentSeries, heichel);
	window.series = series;
	var post = await getPost(series,
		indexInSeries, heichel);*/
	var doesOwn =
		await hasHeichelAuthority(
			heichel, curAlias);
	window.doesOwn = doesOwn;
	window.post = post;
	window.series = series;
	if (post) {
		window.post = post;
		window.series = series;
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
		window.alias = alias;
		window.aliasDetails = alias;
		window.author = alias;
		addTab({
			header: "Post Info",
			content: `<?Awtsmoos return $a("loading.html") ?>`,
			name: "postInfo",
			async onopen({actualTab}) {
				var html = makeInfoHTML()
				actualTab.innerHTML = "";
				appendHTML(html, actualTab);
			},
			rootParent:sidebar
			
			
			
			
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
			name: "comments",
			append(par) {
				
			},
			async onopen({actualTab, tab}) {
				var s = new URLSearchParams(location.search)
				var idx = s.get("idx")
				if(idx != null) {
				//	tab.onUpdateHeader("Comments for verse " + (idx))
				}
				actualTab.innerHTML = "";
				var content = `
	                                <?Awtsmoos return $a("loading.html") ?>
	                            `;
				appendHTML(content, actualTab);
				await loadRootComments({
					post,
					mainParent: allTabs,
					parent: actualTab,
					tab
					
				})
				
			},
			content: `<?Awtsmoos return $a("loading.html") ?>`
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
			await interpretPostDayuh(post)
			
		}
		
		appendHTML(html, realPost)
		postTitle.innerHTML = series.prateem.name + " | " +post
			.title;
		await init/*comments*/({
			post,
			mainParent: allTabs,
			parent: commentTab.actual,
			tab: commentTab
		})
		
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
		startHighlighting('realPost','section', ({main, sub}={}) => {
			var div = main;
			if(div) {
				var idx = div?.dataset.idx
				console.log("doing",idx)
				if(!idx && idx !== 0) return;
				updateQueryStringParameter("idx", div.dataset.idx);
				var ce = new CustomEvent("awtsmoos index", {
					detail: {
						idx: div,
						awtsmoos: "Awtsmoos",
						time: Date.now()
					}
				});
				idx = parseInt(idx)
				
				//commentTab.onUpdateHeader("Comments for verse " + (idx + 1))
				window.dispatchEvent(ce);
			} else if(sub) {
				
				var subIdx = sub?.dataset.idx;
				
				console.log(sub,"yes", subIdx)
				
				if(!subIdx && subIdx !== 0) return;
				updateQueryStringParameter("sub", subIdx);
				var ce = new CustomEvent("awtsmoos index", {
					detail: {
						subIdx: sub,
						awtsmoos: "Awtsmoos",
						time: Date.now()
					}
				});
				subIdx = parseInt(idx)
				
				//commentTab.onUpdateHeader("Comments for verse " + (idx + 1))
				window.dispatchEvent(ce);
			}
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
