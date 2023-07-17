//B"H
// content.js
window.addEventListener('message', function(event) {
    if (event.source != window) return;
    if (event.data.type && (event.data.type === "callAwtsmoos")) {
        
        chrome.runtime.sendMessage(event.data, function(response) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                return;
            }
            
            window.postMessage(response, "*");
        });
    }
}, false);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "awtsmoosResult") {
        window.postMessage(request, "*");
    }
});
