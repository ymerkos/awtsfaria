//B"H
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ scripts: [] });
  });
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "executeCode") {
        console.log("Getting!",request)
        // Execute the code in the current tab
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log("Got tabs",tabs)
            chrome
            .scripting
            .executeScript({
                target: {
                    tabId: tabs[0].id,
                    allFrames:true
                },
                func: function (code) {
                    console.log("Hi!",code)
                
                },
                args: [request.code]
            });
        });
    }
});
