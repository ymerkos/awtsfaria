//B"H
let tabId;
document.getElementById('startBtn').addEventListener('click', () => {
    const port = chrome.runtime.connect({name: "tabAudioVideoCapturePopup"});
    
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        tabId = tabs[0].id;
    
        chrome.tabCapture.getCapturedTabs((ci) => {
        if (!ci.some(e => e.tabId == tabId)) {
            chrome.tabCapture.getMediaStreamId({ consumerTabId: tabId }, (streamId) => {
                port.postMessage({command: "startCapture", streamId});
            });
        }
        });
    });
    port.onMessage.addListener((msg) => {
      if (msg.status === "capturing") {
        console.log('Capturing started', msg.streamId);
      }
    });
  });
  