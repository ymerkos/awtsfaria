//B"H
// content.js
window.addEventListener('message', function(event) {
    if (event.source != window) return;
    if (event.data.type && (event.data.type === "callAwtsmoos")) {
        console.log("Content script received message: " + event.data.type);
        chrome.runtime.sendMessage(event.data, function(response) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                return;
            }
            console.log("Response: ", response);
            window.postMessage(response, "*");
        });
    }
}, false);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "awtsmoosResult") {
        window.postMessage(request, "*");
    }
});
