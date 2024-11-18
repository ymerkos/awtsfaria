/*

B"H
Awtsmoos Powered tab manager
*/

class TabManager {
	constructor(
		parent
		/*the general div
		    that holds the
		    root tab and all tabs*/
	) {

    if(!parent) return;
    this.tabHolder = document.createElement("div")
    

    this.tabHolder.classList.add("all-tabs");
    this.parentEl = parent;

    this.rootTabBtns /*holder for root level buttons*/
      = document.createElement("div");

    
    this.rootTabBtns.classList.add("tab-buttons");
    
    parent.appendChild(this.rootTabBtns);
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
    if(!parent) parent = this.tabHolder;
    if(!btnParent) {
      btnParent = this.rootTabBtns;
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

		bck.onclick = async () => {
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
      var {
        info, actualTab, tab, hdr,
        backBtn
      } = makeTabContent({parent, headerTxt})
      var bck = backBtn;
			// par.classList.remove("active");

			/*setTimeout(()=>{
			    tab.classList.remove("active")

			}, 1000)*/
			;
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
		return tab;
	}
}

function makeTabContent({parent, headerTxt, btnTxt="Back"}) {
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
		bck.textContent =  btnTxt;
		commentHeader.appendChild(bck);

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
    return {
      info, actualTab, tab, hdr,
      backBtn: bck
    }
}


export default TabManager;