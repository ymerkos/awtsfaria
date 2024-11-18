/*
B"H
Awtsmoos Powered tab manager
*/

import {
    appendHTML,
} from "/heichelos/post/postFunctions.js";

class Tab {
    constructor({ tabParent, headerTxt, onclose = () => {} }) {
        this.tabParent = tabParent;
        this.headerTxt = headerTxt;
        this.onclose = onclose;

        this.tab = this.createTab();
        this.actualTab = this.tab.actualTab;
        this.backBtn = this.tab.backBtn;
	this.tabInstance = this.tab;
    }

    createTab() {
        const tab = document.createElement("div");
        tab.classList.add("tab-container");
        this.tabParent.appendChild(tab);

        const info = document.createElement("div");
        info.classList.add("post-info");
        tab.appendChild(info);

        const commentHeader = document.createElement("div");
        commentHeader.classList.add("comment-header");
        info.appendChild(commentHeader);

        const backBtn = document.createElement("div");
        backBtn.classList.add("back-btn");
        backBtn.textContent = "Back";
        commentHeader.appendChild(backBtn);

        backBtn.addEventListener("click", this.onclose);

        const hdr = document.createElement("div");
        hdr.classList.add("info-header");
        hdr.textContent = this.headerTxt;
        commentHeader.appendChild(hdr);

        const actualTab = document.createElement("div");
        actualTab.classList.add("tab-content");
        tab.appendChild(actualTab);

        return { info, actualTab, tab, hdr, backBtn };
    }

    updateHeader(newHeader) {
        this.tab.hdr.textContent = newHeader;
    }

    refreshContent(content) {
        this.actualTab.innerHTML = "";
        appendHTML(content, this.actualTab);
    }
}

class TabManager {
    constructor({ parent, headerTxt = "Awtsmoos Info", onclose = () => {} }) {
        if (!parent) return;

        this.tabHolder = document.createElement("div");
        this.tabHolder.classList.add("all-tabs");
        this.parentEl = parent;

        this.tabs = new Map(); // Store tabs by unique ID for quick access

        const btnsRoot = document.createElement("div");
        btnsRoot.classList.add("tab-buttons");

        const { actualTab, tab, backBtn, tabInstance } = this.createTab({
            parent: btnsRoot,
            btnTxt: "Close",
            headerTxt,
            onclose,
        });

        this.rootTabBtns = actualTab;
        tabInstance.tab.classList.add("active");
        this.rootTab = tab;

        parent.appendChild(btnsRoot);
        parent.appendChild(this.tabHolder);
    }

    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    addTab({
        header,
        content,
        append,
        addClasses = false,
        parent = null,
        btnParent = null,
        tabParent = null,
        onSwitch,
        onOpen,
        onClose,
        onInit,
        id = null, // Optional ID
    }) {
        if (!parent) parent = this.tabHolder;
        if (!btnParent) btnParent = this.rootTabBtns;
        if (!tabParent) tabParent = this.rootTab;

        const tabId = id || this.generateUniqueId();
        if (this.tabs.has(tabId)) {
            console.warn(`Tab ID "${tabId}" already exists! Generating a new ID.`);
        }

        const btn = document.createElement("div");
        btn.classList.add("tab-button");
        btn.textContent = header;
        btnParent.appendChild(btn);

        // Create tab content using Tab class
        const tabInstance = new Tab({
            tabParent: parent,
            headerTxt: header,
            onclose: () => {
                if (onClose) onClose();
            },
        });

        const tab = tabInstance.tab;

        this.tabs.set(tabId, { tab, btn, tabInstance });

        btn.onclick = async () => {
            tabParent.classList.add("backScreen");
            if (!addClasses) btnParent.classList.remove("active");
            parent.classList.add("active");

            Array.from(parent.children).forEach(n => {
                n.classList.remove("active");
            });

            tab.classList.add("active");

            if (typeof onOpen === "function") {
                await onOpen({ tab, tabInstance });
            }
        };

        tabInstance.backBtn.onclick = async () => {
            tabParent.classList.remove("backScreen");
            tabParent.classList.add("active");
            onSwitch?.({ tab: tabParent });

            tab.classList.remove("active");

            if (typeof onClose === "function") {
                await onClose({ tab, tabInstance });
            }

            tabInstance.actualTab.innerHTML = "";
        };

        onInit?.(tab);

        // Method to refresh tab content dynamically
        tabInstance.refreshContent(content);

        // Method to update the header text dynamically
        tabInstance.updateHeader(header);

        return { tab, id: tabId, tabInstance };
    }

    // Helper method to locate a tab by its ID
    getTabById(id) {
        return this.tabs.get(id);
    }
    
    createTab({
        parent,
        headerTxt,
        btnTxt = "Back",
        content,
        onclose = () => {}
    }) {
        const tab = new Tab({
            tabParent: parent,
            headerTxt,
            onclose,
        });

        const { actualTab, backBtn, tabInstance} = tab;

        if (content) appendHTML(content, actualTab);

        return { actualTab, tab, backBtn, tabInstance};
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
