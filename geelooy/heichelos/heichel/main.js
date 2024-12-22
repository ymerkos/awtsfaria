//B"H
console.log("B\"H");


import {
	AwtsmoosPrompt,
	addNewEditor
} from "/scripts/awtsmoos/api/utils.js";
var heichelID = location.pathname.split("/").filter(Boolean)[1];
var isEditing = false;
window.heichelID = heichelID;
window.heichelId = heichelID;
window.AwtsmoosPrompt = AwtsmoosPrompt
console.log(AwtsmoosPrompt)



var POST_LENGTH = 256;
try {

	var postsTab = document.getElementById('postsTab');
	var seriesTab = document.getElementById('seriesTab');
	var postsList = document.getElementById('postsList');
	var seriesList = document.getElementById('seriesList');
	var v = sp()
		.get("view");
	var pnt = sp()
		.get("path");
	var srss = sp()
		.get("series") || "root";
	if (srss == "null") {
		srss = "root"
	}
	var postLength = 0;
	var seriesLength = 0;
	var p = new DOMParser();
	try {
		load(srss);
	} catch (e) {
		alert("no" + e)

	}

	var firstPost = false;
	var firstSeries = false;
	var editors = null;
	var setupEditors = false;
	async function load(ss) {
		window.heichel = await getH(heichelID)
		if(!editors) {
			editors = await getEditors();
		}
		if(!setupEditors)
			await setupEditorHTML()
		window.currentSeries = ss;
		
		window.ownsIt = await doesOwn()
		if(ownsIt) {
			addSubmitButtons()
		}
		//;
		if (true) {

			parentS.classList.remove("hidden");
			var reqPars = await fetch(`/api/social/heichelos/${
				heichelID	
			}/series/${
				ss	      
			}/breadcrumb`);
			var breadcrumb = await reqPars.json();
			window.breadcrumb = breadcrumb;
			parentS.innerHTML = "";

			for (var i = breadcrumb.length - 1; i >= 0; i--) {
				var w = breadcrumb[i];
				(w => {
					var a = document.createElement("a")
					var href = newPath(v, w.id)
					a.onclick = () => goto(
						href

					);
					a.href = href;
					a.innerHTML = w?.prateem?.name;
					parentS.appendChild(a);
					var txt = document.createTextNode("/")
					//txt.className="slash"
					//txt.innerText="/"
					parentS.appendChild(txt)
				})(w)
			}


		}

		window.goto = goto;

		var rootP = `/api/social/heichelos/${
					heichelID
				}/series/${ss}/details`;
		console.log(rootP, heichelID, heichel)
		var r = await fetch(
			rootP

		);



		var root = await r.json();
		var js = JSON.stringify(root)

		if (!root || !Array.isArray(root.posts)) {
			if (ss == "root") return;
			return alert("Path not found:  " + ss +

				js + rootP);

		}

		var desc = root.prateem.description;
		if (!desc || desc == "undefined") {
			desc = ""
		}
		seriesNm.innerHTML = root.prateem.name;
		seriesDesc.innerHTML = desc

		if (ss != "root")
			seriesNameAndInfo.classList.remove("hidden");

		var pst = root.posts
		var srs = root.subSeries;

		if (!Array.isArray(srs)) {
			return alert("no sub")

		}

		var st = JSON.stringify(pst)

		var bd = new URLSearchParams({
			seriesId: root.id,
			propertyMap: JSON.stringify({
				content: 256,
				title: true,
				postId: true,
				author: true,
				id: true,
				seriesId: true,
				indexInSeries: true
			})

		});




		var rq = await fetch(
			`/api/social/heichelos/${
				heichelID

			}/posts/details?` + bd);
		var pjs = await rq.json();



		
		if (pjs.length) {
			var pst = mps(pjs, "post", ss, root);
			appendHTML(postsList, pst);
			if (v != "series")
				postsTab.click();
		} else appendHTML(postsList, "No posts here yet!", true);
		
		document.querySelector(".loadingPosts").classList.add("hidden")
		rq = await fetch(
			`/api/social/heichelos/${
				heichelID

			}/series/${ss}/details`, {
				method: "POST",
				body: new URLSearchParams({
					seriesIds: JSON.stringify(srs)

				}) + ""

			}

		);
		var sjs = await rq.json();



		if (sjs.length) {
			var sst = mps(sjs, "series", ss, root);

			appendHTML(seriesList, sst);
			if (!pjs.length) {
				seriesTab.click();
			}
			
		} else appendHTML(seriesList, "No series here yet!", true)
		document.querySelector(".loadingSeries").classList.add("hidden")

	}

	function mps(postsInHeichel, cl, sid, root) {
		var html = "";

		for (var i = 0; i < postsInHeichel.length; i++) {
			var indexInSeries = i;
			var pr = postsInHeichel[i];
			if(pr.error) continue;
			var baseURL = `/heichelos/${
					heichelID
				}`;


			var baseP = location.pathname;
			//
			var hasNext = i < postsInHeichel.length - 1 &&
				postsInHeichel.length > 1;
			var hasPrevious = i > 0 && postsInHeichel.length > 1;


			function generatePostURL(i) {

				var ob = {
					seriesParent: root.id


				}

				return (`${baseURL}/series/${root.id}/${indexInSeries}`)
			}
			var url = cl == "post" ?
				generatePostURL(i) : location.pathname +

				"?" +
				new URLSearchParams({
					view: v,
					series: pr.id
				});

			var returnURL = location.href;
			var editParams = new URLSearchParams({
				type: cl,
				id: pr.id,
				editingAlias: isEditing,
				parentSeriesId: sid,
				indexInSeries: i,
				returnURL
			})
			var dt = cl == "post" ? pr : pr.prateem;
			var desc = dt.description;
			if (!desc || desc == "undefined") {
				desc = ""
			}
			html += /*html*/ `
			<div class="post-card ${cl}" data-awtsmoosID="${
				pr.id
			}">
				<h2 class="${cl}-title"><a
					${
						cl=="post"?'':
					`onclick="goto(this.href)"`
					}
				href="${
					url
				}"
		
		
	>${dt[cl=="post"?
		"title":"name"]}    
				<` + `/a><` + `/h2>` +
				(cl == "post" ?
					`<div class="post-preview">${
						postsInHeichel[i]?.content?.substring(0, POST_LENGTH)
					}...</div> <a href="${url}" 
					class="post-link">Read more</a>`

					:
					(desc))


			if (isEditing) {
				html += /*html*/ `
					<div class="edit-section">
						<a href="${
							baseURL
						}/edit?${
							editParams
						}" class="edit-content">Edit Content</a>
						<a href="${
							baseURL
						}/delete?${
							editParams
						}">Delete</a>
					<` + `/div>
				`
			}

			html += `<` + `/div>`;

		}
		return html;

	}

	function appendHTML(par, html, raw = false) {
		if (!raw) {
			var dc = p.parseFromString(html, "text/html");

			Array.from(dc.body.children)
				.forEach(w => par.appendChild(w))
		} else {
			par.innerHTML = html
		}
	}

	function sp() {
		return new URLSearchParams(location.search);
	}

	function updateSearch(newSearchString) {
		// Get the current pathname
		var pathname = window.location.pathname;

		// Construct the new URL with the updated search string
		var newUrl = pathname + '?' + newSearchString;

		// Change the URL without refreshing
		window.history.replaceState({
			path: newUrl
		}, '', newUrl);
	}

	function setP(nm, vl) {
		var c = sp()
		c.set(nm, vl);
		updateSearch(c + "")

	}

	function goto(url) {
		location.href = url;
		location.reload(true)

	}

	function newPath(view, series) {
		return location.pathname +

			"?" + (isEditing ?
				(new URLSearchParams({
					editingAlias: isEditing

				})) + "&" : "") +

			new URLSearchParams({
				view,
				series



			});
	}
	var c$ = q => document.querySelector(q)
	async function doesOwn() {
		var curAlias = window.curAlias || null;
		if(!curAlias) return false;
		return !!(await (await fetch(`/api/social/alias/${
			curAlias	
		}/heichelos/${
			heichelID
		}/ownership`)).json()).yes;
	}
	addEventListener("awtsmoosAliasChange", async e => {
		window.curAlias = e?.detail?.id;
		var owns = await doesOwn();
		removeAdminButtons();
		if(owns)
			addSubmitButtons();
	});

	function removeAdminButtons() {
		var ab = window.adminBtns;
		if(!ab) return;
		ab.forEach(w => {
			w?.parentNode?.removeChild(w);	
		})
		ab = []
		window.adminBtns = []
		
	}
	function addSubmitButtons() {
		window.hasAdminButtons = true;
		var ps = document.createElement("button")
		ps.innerText = "Submit Post"
		if(!window.adminBtns) {
			window.adminBtns = [];
		}
		document.querySelector(".posts")?.appendChild(ps);
		adminBtns.push(ps);
		ps.onclick = () => {


			var p = new URLSearchParams({
				type: "post",
				returnURL: location.href,
				seriesId: srss

			});

			location.href = "/heichelos/" + heichelID + "/submit?" + p
		}
		var s = document.createElement("button")
		s.innerText = "Submit New Series"
		document.querySelector(".series")?.appendChild(s);
		adminBtns.push(s)

		s.onclick = () => {
			var p = new URLSearchParams({
				type: "series",
				returnURL: location.href,
				seriesId: srss
	
			});
			location.href = "/heichelos/" + heichelID + "/submit?" +
				p;
		};

		var ss = document.createElement("button")
		ss.innerText = "Edit Series"
		window?.seriesControls?.appendChild(ss);

		adminBtns.push(ss);
		ss.onclick = () => {
			var p = new URLSearchParams({
				type: "series",
				returnURL: location.href,
				id: srss
				
	
			});
			location.href = "/heichelos/" + heichelID + "/edit?" +
				p;
		};

		var heichelDetailsBtn = document.createElement("a");
		heichelDetailsBtn.innerText = "Edit Heichel Details";
					
		var k = new URL("https://awtsmoos.com/heichelos/manage-alias-heichelos")
		var pr = new URLSearchParams({
			alias: curAlias,
			returnURL: location.href,
			heichel: heichelID,
			action: "update"
		})
		k.search=pr;
		heichelDetailsBtn.href = k +"";	
		document.querySelector(".heichelDetails")?.appendChild(heichelDetailsBtn);
		adminBtns.push(heichelDetailsBtn);
		makeEditorBtn(".posts .editor-info");
		makeEditorBtn(".series .editor-info", {
			type: "series"	
		});
		function makeEditorBtn(selector, {
			type="post"	
		}={}) {
			var ei = document.querySelector(selector)
			if(!ei) return console.log("couldn't find it",ei);
			var d = document.createElement("div")
			ei.appendChild(d);
			d.classList.add("btn")
			d.innerHTML = "Edit "+type+"s";
			adminBtns.push(d);
	
			var isEditing = false;
			
			d.onclick = () => {
				/*toggling editor mode*/
				isEditing = toggleEditable(type=="post" ? 
				   window.postsList :
				   window.seriesList, 
				(child, ie) => {
					if(ie/*isEditing*/) {
						var id = child.dataset.awtsmoosid;
						var sid = currentSeries;
						
						var returnURL = location.href;
						var obj = {
							type,
							id,
							parentSeriesId: sid,
							returnURL
						}
						var editParams = new URLSearchParams(obj)
						var details = document.createElement("div")
						details.className = ("editor-details")
						child.appendChild(details);
	
						var editBtn =  document.createElement("a")
						editBtn.classList.add("btn")
						editBtn.style.backgroundColor = "yellow";
						editBtn.innerText = "Edit details"
						editBtn.href = location.origin + `/heichelos/${
							heichelId	
						}/edit?${
							editParams	
						}`
						details.appendChild(editBtn);
						
						var deleteBtn = document.createElement("div")
						deleteBtn.classList.add("btn")
						deleteBtn.style.backgroundColor = "red";
						deleteBtn.innerText = "delete"
						details.appendChild(deleteBtn);
						
						deleteBtn.onclick = async () => {
							try {
								var r = await fetch(
								`/api/social/heichelos/${
									heichelId
								}/deleteContentFromSeries`, {
								    method: "POST",
								    body: new URLSearchParams({
									aliasId: window.curAlias,
									seriesId:currentSeries,
									contentType: type,
									contentId: id,
									deleteOriginal: true,
									returnURL
								    })
								});
								if(r.error) {
									await AwtsmoosPrompt.go({
										isAlert: true,
										headerTxt: "Did NOT delete, error: "+JSON.stringify(r.error)
									});
									console.log(r);
									return;
								}
								await AwtsmoosPrompt.go({
									isAlert: true,
									headerTxt: "Deleted post successfully"
								});
								child.parentNode.removeChild(child);
							} catch(e) {
								alert("Error deleting")
								console.log(e)
							}
	
							
						};
					} else {
						var ed = child.querySelector(".editor-details")
						if(ed) {
							ed.parentNode.removeChild(ed)	
						}
					}
				})
				if(isEditing) {
					d.innerHTML = "Done"
					isEditing = false;
				} else {
					d.innerHTML = "Edit "+type+"s";
					isEditing = true;
				}
			}
		}
		

		var editorSection = document.querySelector(".editorSection")
		if(!editorSection) return console.log("Can't find editor section");
		var author = window?.heichel?.author;
		
		if(!author) return console.log("Can't find author")
		
		var addEditor = document.createElement("div")
		addEditor.classList.add("btn");
		adminBtns.push(addEditor);
		addEditor.innerText = "Add New Editor";
		editorSection.appendChild(addEditor);
		
		addEditor.onclick = async () => {
			var p = await AwtsmoosPrompt.go({
				headerTxt: "Enter an editor's alias"
			})
			if (p) {
				var r = await addNewEditor({
					aliasId: author,
					editorAliasId: p,
					heichelId: heichelID
				})
				if (r.success) {
					await AwtsmoosPrompt.go({
						isAlert: true,
						headerTxt: "Editor " + p + " added successfully"
					});
				} else {
					await AwtsmoosPrompt.go({
						isAlert: true,
						headerTxt: "Problem adding " + p + ". Check console."
					});
					console.log("ISsue adding alias editor", p, "Details:", r)
				}
				location.reload()
			}
			console.log(p)
		}

		
	}

	function toggleEditable(parent, callbackChild) {
		var wasEditing = parent.isAwtsmoosEditing;
		var isEditing = !wasEditing; // Toggle editing state
		parent.isAwtsmoosEditing = isEditing; // Set the new state
		
		var children = Array.from(parent.children);
			if (!children || !children.length) {
			return console.log("No child found", parent);
		}
		
		children.forEach(child => {
		if (typeof callbackChild === "function") {
		    callbackChild(child, isEditing);
		}
		
		
		})
		return isEditing;
        }
	postsTab.onclick = function () {

		postsTab.classList.add("Active")
		seriesTab.classList.remove("Active")
		var v = sp()
			.get("view");

		// if(v == "posts") return;
		setP("view", "posts");

		c$(".posts")
			.classList.remove("hidden");
		postsList.classList.remove("hidden");



		c$(".series")
			.classList.add("hidden");
		seriesList.classList.add("hidden");
		//  loadCurrent();
	};


	seriesTab.onclick = function () {

		seriesTab.classList.add("Active")
		postsTab.classList.remove("Active")
		var v = sp()
			.get("view");
		//if(v == "series") return;
		setP("view", "series")


		c$(".posts")
			.classList.add("hidden");
		postsList.classList.add("hidden");



		c$(".series")
			.classList.remove("hidden");
		seriesList.classList.remove("hidden");
		// loadCurrent();
	};

	if (v == "series") {
		seriesTab.click()
	} else {
		postsTab.click();

	}

	async function getEditors() {
		return await (await fetch(`/api/social/heichelos/${
			heichelID	
		}/editors`)).json()
	}

	async function setupEditorHTML() {
		if(!Array.isArray(editors)) {
			return console.log("NO editors")	
		}
		var author = window?.heichel?.author;
		if(!author) return console.log("Author",author);
		//return JSON.stringify(editors)

		var editorSection = document.querySelector(".editorSection");
		if(!editorSection) return console.log("Couldn't find editor section");
		

		
		// Assuming `author` and `editors` variables are already defined
		const tooBig = editors && editors.length > 10; // Example condition for "tooBig"
		
		// Create authorHolder div
		const authorHolder = document.createElement('div');
		authorHolder.className = 'authorHolder';

		editorSection.appendChild(authorHolder);
		console.log("Added",editorSection,authorHolder);
		// Create author label
		const authorLabel = document.createElement('div');
		authorLabel.className = 'author-label';
		authorLabel.textContent = 'Author: ';
		authorHolder.appendChild(authorLabel);
		
		// Create author link
		const authorLink = document.createElement('div');
		authorLink.className = 'author-link';
		const authorAnchor = document.createElement('a');
		authorAnchor.href = `https://awtsmoos.com/@${author}`;
		authorAnchor.textContent = "@"+author;
		authorLink.appendChild(authorAnchor);
		authorHolder.appendChild(authorLink);
		
		// Create editorsHolder div
		const editorsHolder = document.createElement('div');
		editorsHolder.className = 'editorsHolder';
		editorSection.appendChild(editorsHolder);
		if (editors && editors.length) {
		    // Create label for editors
		    const labelEditors = document.createElement('div');
		    labelEditors.className = 'label-editors';
		    labelEditors.textContent = 'Editors:';
		    editorsHolder.appendChild(labelEditors);
		
		    // Create editor-holder div
		    const editorHolder = document.createElement('div');
		    editorHolder.className = 'editor-holder';
		
		    // Determine which editors to display
		    const editorsToShow = tooBig ? editors.slice(0, 10) : editors;
		    
		    editorsToShow.forEach(ed => {
		        const editorName = document.createElement('div');
		        editorName.className = 'editor-name';
		        const editorAnchor = document.createElement('a');
		        editorAnchor.href = `/@${ed}`;
		        editorAnchor.textContent = `@${ed}`;
		        editorName.appendChild(editorAnchor);
		        editorHolder.appendChild(editorName);
		    });
		
		    // If too big, append ellipsis
		    if (tooBig) {
		        const ellipsis = document.createTextNode('...');
		        editorHolder.appendChild(ellipsis);
		    }
		
		    editorsHolder.appendChild(editorHolder);
		} else {
		    editorsHolder.textContent = 'No editors here!';
		}

		
		
	}


	async function hasHeichelEditAuthority(heichel, alias) {
		return (await (await fetch(`/api/social/alias/${
			alias	
		}/heichelos/${
			heichel	
		}/ownership`)).json()).yes	
	}

	function showSeriesDetails(seriesID) {
		var detailsDiv = document.getElementById(`seriesDetails-${seriesID}`);
		// Toggle display of the series details
		detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';
		if (detailsDiv.innerHTML === '') {
			// Load series details and posts if not already loaded
			// Use fetchAwtsmoos or similar to load the data
		}
	}


	async function start() {
		if (heichelID == "undefined") {
			var g = await AwtsmoosPrompt.go({
				isAlert: true,
				headerTxt: "That heichel doesn't exist!"
			})
			location.href = "/"
		}
		if (window.submitPgSeries)
			submitPgSeries.onclick = () => {
				var p = new URLSearchParams({
					type: "series",
					returnURL: location.href,
					seriesId: srss

				});
				location.href = "/heichelos/" + heichelID + "/submit?" +
					p;
			};


		if (window.submitPgPost)
			submitPgPost.onclick = () => {


				var p = new URLSearchParams({
					type: "post",
					returnURL: location.href,
					seriesId: srss

				});

				location.href = "/heichelos/" + heichelID + "/submit?" + p
			}
	}

	start();


} catch (e) {
	alert(e + " vh");

}
