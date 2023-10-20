//B"H
console.log("B\"H");

let mediaRecorder;
let recordedChunks = [];

chrome.runtime.onMessage.addListener(async (q,s,sr) => {

    console.log("?WHAT?!")
    var t = await chrome.tabs.create({
        url: chrome.runtime.getURL("r.html"),
        pinned: true,
        active: true
    });
    chrome.tabs.onUpdated.addListener(async function j(tabId, inf)  {
        if(tabId == t.id && inf.status=="complete") {
            chrome.tabs.onUpdated.removeListener(j);

        }

        await chrome.tabs.sendMessage(tabId, {
            name: "What aren't you",
            body: {
                myTabloid: "Hi"
            }
        })
    })
})
    