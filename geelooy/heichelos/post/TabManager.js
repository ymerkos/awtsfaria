/* B"H
   Awtsmoos-Inspired Tab Manager
*/

import { appendHTML } from "/heichelos/post/postFunctions.js";

class TabManager {
    constructor({ parent, headerTxt = "Awtsmoos Info", onclose = () => {} } = {}) {
        if (!parent) throw new Error("Parent element is required.");

        this.parentEl = parent;

        // Create the main structure for tabs
        this.tabHolder = this.createElement("div", "all-tabs");
        this.rootTabBtns = this.createElement("div", "tab-buttons");

        // Initialize the root tab
        const { tab } = this.createTab({
            parent: this.rootTabBtns,
            headerTxt,
            btnTxt: "Close",
            onclose,
        });

        this.rootTab = tab;
        this.rootTab.classList.add("active");

        // Append tab buttons and tab holder to the parent element
        parent.appendChild(this.rootTabBtns);
        parent.appendChild(this.tabHolder);
    }

    /**
     * Add a new tab with exactly the same `addTab` API and behavior as requested.
     */
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
        oninit,
    }) {
        // Set default parent and button parent if not provided
        if (!parent) parent = this.tabHolder;
        if (!btnParent) btnParent = this.rootTabBtns;
        if (!tabParent) tabParent = this.rootTab;

        // Ensure mandatory parameters are present
        if (!parent || !btnParent) {
            console.error("Need to supply 'parent' and 'btnParent' params");
            return null;
        }

        // Create button for the tab
        const btn = this.createElement("div", "tab-button", header);
        btnParent.appendChild(btn);

        // Create the tab content
        const { info, actualTab, tab, hdr, backBtn } = this.createTab({
            parent,
            content,
            headerTxt: header,
        });

        tab.awtsTabBtn = btn;

        // Define behavior for button click (open the tab)
        btn.onclick = async () => {
            // Deactivate all other tabs
            this.deactivateAllTabs();

            // Manage active states for current tab and its parent
            tabParent.classList.add("backScreen");
            if (!addClasses) btnParent.classList.remove("active");
            parent.classList.add("active");

            if (!addClasses) {
                Array.from(parent.children).forEach((child) =>
                    child.classList.remove("active")
                );
            }

            tab.classList.add("active");

            // Call `onopen` if provided
            if (typeof onopen === "function") {
                await onopen({ tab, actualTab });
            }
        };

        // Define behavior for back button click (close the tab)
        backBtn.onclick = async () => {
            tabParent.classList.remove("backScreen");
            tabParent.classList.add("active");

            onswitch?.({ tab: tabParent });

            tab.classList.remove("active");

            // Call `onclose` if provided
            if (typeof onclose === "function") {
                await onclose({ tab, actualTab });
            }

            actualTab.innerHTML = "";
        };

        // Initialize the tab
        oninit?.(tab);

        // Add utility functions to the tab object
        tab.awtsRefresh = () => {
            actualTab.innerHTML = "";
            onopen?.({ tab, actualTab });
        };

        tab.onUpdateHeader = (newHeader) => {
            tab.awtsHeader.innerText = newHeader;
            tab.awtsTabBtn.innerText = newHeader;
        };

        tab.open = async () => {
            btn.click();
        };

        tab.onopen = onopen;
        tab.onswitch = onswitch;
        tab.onclose = onclose;

        return tab;
    }

    // Deactivates all tabs in the tab holder
    deactivateAllTabs() {
        Array.from(this.tabHolder.children).forEach((tab) =>
            tab.classList.remove("active")
        );
    }

    // Helper to create a tab with content and back button
    createTab({ parent, headerTxt, content, btnTxt = "Back", onclose }) {
        const tab = this.createElement("div", "tab-container");
        parent.appendChild(tab);

        const info = this.createElement("div", "post-info");
        tab.appendChild(info);

        const header = this.createElement("div", "comment-header");
        info.appendChild(header);

        const backBtn = this.createElement("div", "back-btn", btnTxt);
        header.appendChild(backBtn);
        backBtn.onclick = onclose;

        const hdr = this.createElement("div", "info-header", headerTxt);
        header.appendChild(hdr);

        const actualTab = this.createElement("div", "tab-content");
        info.appendChild(actualTab);

        if (content) appendHTML(content, actualTab);

        // Attach header and content for easier access
        tab.awtsHeader = hdr;
        tab.actual = actualTab;

        return { info, actualTab, tab, hdr, backBtn };
    }

    // Utility method to create DOM elements
    createElement(tag, className, textContent = "") {
        const el = document.createElement(tag);
        el.className = className;
        el.textContent = textContent;
        return el;
    }
}

export default TabManager;
