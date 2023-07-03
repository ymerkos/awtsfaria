//B"H
// background.js
let tabIdForAwtsmoos = null;
let awtsmoosRequest = null;
let senderTabId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "callAwtsmoos") {
        console.log("received callAwtsmoos, checking for open tab");
        awtsmoosRequest = request;
        senderTabId = sender.tab.id;

        chrome.tabs.query({url: 'https://chat.openai.com/*'}, function(tabs) {
            if (tabs.length > 0) {
                tabIdForAwtsmoos = tabs[0].id;
                injectScriptAndSendMessage();
            } else {
                chrome.tabs.create({ url: 'https://chat.openai.com', active:false}, (tab) => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                        sendResponse({ type: "error", data: chrome.runtime.lastError.message });
                        return;
                    }
                    console.log("tab created, waiting for tab to load");
                    tabIdForAwtsmoos = tab.id;
                });
            }
        });

        return true;  // asynchronous response
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tabId === tabIdForAwtsmoos) {
        console.log("tab is loaded, injecting scripts");
        injectScriptAndSendMessage();
    }
});

function injectScriptAndSendMessage() {
    chrome.scripting.executeScript({
        target: { tabId: tabIdForAwtsmoos },
        files: ["awtsmoos-gptify.js"]
    }, () => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            console.log("scripts injected, sending callAwtsmoos message");
            chrome.tabs.sendMessage(tabIdForAwtsmoos, awtsmoosRequest, (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                } else {
                    console.log("received response:", response);
                    // Send the response back to the original sender
                    chrome.tabs.sendMessage(senderTabId, response);
                }
            });
        }
    });
}
