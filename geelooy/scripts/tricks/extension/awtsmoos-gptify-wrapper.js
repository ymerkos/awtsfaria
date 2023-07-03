//B"H
let awtsmoosInstance = new AwtsmoosGPTify();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "callAwtsmoos") {
        console.log("AwtsmoosGPTify wrapper received callAwtsmoos");
        awtsmoosInstance.go(request.data.prompt)
            .then(result => {
                // Send the result back to the sender
                console.log("AwtsmoosGPTify generated result, sending response");
                sendResponse({ type: "awtsmoosResult", data: result });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    return true;  // Will respond asynchronously
});
