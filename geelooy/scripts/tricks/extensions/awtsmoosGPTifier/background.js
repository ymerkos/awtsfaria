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

                    //B"H
                    function myEval(code){
                        let elem = document.createElement('script') ;
                        elem.textContent = code ;
                        document.head.appendChild(elem) ;
                    }
                    console.log("trying",code);
                    try {
                        myEval(code )
                    } catch(e) {
                        console.log(e);
                    }
                
                },
                args: [request.code]
            });
        });
    }
});
