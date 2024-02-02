//B"H

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed and running on Manifest V3');
  });
  
  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
      if (msg.command === "startCapture") {
        // Start capturing the tab audio
        // Find the current active tab to inject the content script into
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs.length > 0) {
            let currentTabId = tabs[0].id;
                console.log("got")
            // Dynamically inject the content script into the current tab
            chrome.scripting.executeScript({
                target: {tabId: currentTabId},
                files: ['content.js']
            }, () => {
                console.log("Content script injected");
            });
            }
        });
        console.log("Capturing!")
      }
    });
  
    port.onDisconnect.addListener(() => {
      console.log('Disconnected', port);
    });
  });

  