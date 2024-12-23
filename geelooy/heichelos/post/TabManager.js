/*

B"H
Awtsmoos Powered tab manager
*/

import {
	appendHTML,
} from "/heichelos/post/postFunctions.js"

class TabManager {
	constructor({
		parent
		/*the general div
		    that holds the
		    root tab and all tabs*/
		,
		headerTxt = "Awtsmoos Info",
		onclose = ()=>{}
	}={}) {

		if (!parent) return;

		this.tabHolder = document.createElement("div")


		this.tabHolder.classList.add("all-tabs");
		this.parentEl = parent;

		var btnsRoot /*holder for root level buttons*/ = document.createElement("div");


		btnsRoot.classList.add("tab-buttons");
		var {
			actualTab,
			tab,
			backBtn
		} = makeTabContent({
			parent: btnsRoot,
			btnTxt:"Close",
			headerTxt,
			onclose
		})
		this.rootTabBtns = actualTab
		tab.classList.add("active")
		this.rootTab = tab;

		parent.appendChild(btnsRoot);
		parent.appendChild(this.tabHolder);

		

	}

	addTab({

		header,
		content,
		append,
		addClasses = false,
		parent = null,
		btnParent = null,
		tabParent = null,
		onswitch,
		onopen,
		onclose,
		oninit
	}) {
		if (!parent) parent = this.tabHolder;
		if (!btnParent) {
			btnParent = this.rootTabBtns;
		}
		if(!tabParent) {
			tabParent = this.rootTab;
		}
		if (

			!parent ||
			!btnParent
		) return console.log("Need to supply 'parent' and 'btnParent' params");

		var par = parent;
		var btnPar = btnParent;

		var btn = document.createElement(
			"div");
		btn.className = "tab-button"
		btnPar.appendChild(btn);
		btn.textContent = header;
		///tab.awtsTabBtn = btn;



		var tabHidden = true;
		var tabParent = (tabParent ||
			btnPar);
		btn.onclick = async () => {
			hideAllTabs()
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
			if (typeof(onopen) ==
				"function") {
				await onopen({
					tab,
					actualTab
				})
			}

		}

		var {
			info,
			actualTab,
			tab,
			hdr,
			backBtn
		} = makeTabContent({
			parent,
			content,
			headerTxt: header
		});
		tab.awtsTabBtn = btn;
		var bck = backBtn;

		bck.onclick = async () => {
         		hideAllTabs()
			tabParent.classList
				.remove(
					"backScreen");
			tabParent.classList.add(
				"active");
			onswitch?.({
				tab: tabParent
			})
			// if(addClasses) {
			tab.classList.remove(
				"active")
			if (typeof(onclose) ==
				"function") {
				await onclose({
					tab,
					actualTab
				})
			}
			actualTab.innerHTML = "";


		}
		oninit?.(tab);
		tab.awtsRefresh = () => {
			actualTab.innerHTML = "";
			onopen?.({
				tab,
				actualTab
			});
		};
		tab.onUpdateHeader = /*change header*/ (header) => {
			tab.awtsHeader.innerText = header;
			tab.awtsTabBtn.innerText = header;
		}
		tab.onopen = onopen;
		tab.onswitch = onswitch;
		tab.onclose = onclose;

		tab.open = async () => {
			btn.click();
		};
      tab.hide = () => {
         tab.classList.remove(
		"active"
         );
	par.classList.remove("active");
      }
      allTabs.push(tab);
		return tab;
	}
}

var allTabs = [];
function hideAllTabs() {
   allTabs.forEach(w=>w.hide())
}
function makeTabContent({
	parent,
	headerTxt,
	btnTxt = "Back",
	content,
	onclose=(()=>{})
}) {
	var par = parent;
	var tab = document.createElement(
		"div");

	tab.className = "tab-container";
	par.appendChild(tab);

	var info = document.createElement(
		"div")
	info.className = "post-info";
	tab.appendChild(info)


	var commentHeader = document.createElement("div")
	commentHeader.classList.add("comment-header")
	info.appendChild(commentHeader);

	var bck = document.createElement(
		"div");
	bck.className = "back-btn";
	bck.textContent = btnTxt;
	commentHeader.appendChild(bck);

	if(onclose) {
		bck.addEventListener("click", () => {
			onclose?.();
		})
	}
	var hdr = document.createElement(
		"div");
	hdr.className = "info-header";
	hdr.textContent = headerTxt;
	commentHeader.appendChild(hdr);

	
	tab.awtsHeader = hdr;

	var actualTab = document
		.createElement("div");
	actualTab.className = "tab-content";
	tab.actual = actualTab;
	if (content)
		appendHTML(content, actualTab);
	if (typeof(append) == "function") {
		append(actualTab)
	}

	info.appendChild(actualTab);
	makeDraggable({
		header:commentHeader,
		onclose,
		tabContent: actualTab
	})
	return {
		info,
		actualTab,
		tab,
		hdr,
		backBtn: bck
	}
}

function makeDraggable({
	header, onclose = (() => {}),
	tabContent
}) {
	// Select the sidebar and header
	const sidebar = document.querySelector('.sidebar');

	// Variables for dragging
	let isDragging = false;
	let startY = 0;
	let startTop = 0;

	const parent = sidebar.parentNode;

	// Start dragging (mouse or touch)
	function startDrag(event) {
		isDragging = true;
		startY = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY;
		startTop = parseInt(window.getComputedStyle(sidebar).top, 10);
		document.body.style.userSelect = 'none'; // Prevent text selection while dragging
	}

	// Handle drag movement (mouse or touch)
	function dragMove(event) {
		if (!isDragging) return;

		const currentY = event.type === 'mousemove' ? event.clientY : event.touches[0].clientY;
		const deltaY = currentY - startY; // Calculate drag distance
		const newTop = Math.min(
			parent.clientHeight - 50,
			Math.max(0, startTop + deltaY)
		); // Restrict dragging within bounds

		sidebar.style.top = `${newTop}px`;

		// Trigger onclose callback if dragged too far down
		if (newTop > parent.clientHeight - 100) {
			//onclose?.();
		}
	}

	// End dragging (mouse or touch)
	function endDrag() {
		if (!isDragging) return;
		isDragging = false;
		document.body.style.userSelect = ''; // Re-enable text selection

		// Collapse if dragged too far down
		const currentTop = parseInt(window.getComputedStyle(sidebar).top, 10);
		if (currentTop > parent.clientHeight - 100) {
			//sidebar.style.top = '100%'; // Fully collapse
			//onclose?.();
		}
	}

	// Detect scroll on .tab-content
	function handleScroll(event) {
		const scrollTop = tabContent.scrollTop;
	
		// Check if .tab-content is scrolled to the top
		if (scrollTop <= 0) {
			var deltaY = event.deltaY || event.touches?.[0]?.clientY - startY;
	
			// If scrolling upwards (positive deltaY), start collapsing sidebar
			if (deltaY > 0) {
				deltaY *= 0.4
				const currentTop = parseInt(window.getComputedStyle(sidebar).top, 10);
				const newTop = Math.min(parent.clientHeight - 50, currentTop + deltaY);
	
				sidebar.style.top = `${newTop}px`;
			}
		}
	}

	// Attach mouse and touch event listeners
	header.addEventListener('mousedown', startDrag);
	document.addEventListener('mousemove', dragMove);
	document.addEventListener('mouseup', endDrag);

	header.addEventListener('touchstart', startDrag, {
		passive: true
	});
	document.addEventListener('touchmove', dragMove, {
		passive: false
	}); // preventDefault might be used
	document.addEventListener('touchend', endDrag);
/*
	// Attach scroll and wheel listeners to .tab-content
	tabContent?.addEventListener('scroll', handleScroll);
	tabContent?.addEventListener('wheel', handleScroll); // For mouse scrolling
	tabContent?.addEventListener('touchmove', handleScroll, { passive: false }); // For touch scrolling
*/
}

export default TabManager;
