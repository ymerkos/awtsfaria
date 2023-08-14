//B"H
// background.js
console.log("B\"H")
chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener((message) => {
        console.log("Start",message)
      if (message.action === 'startChatGPT') {
        // ... rest of your code ...
        chrome.tabs.query({ url: 'https://chat.openai.com/*' }, tabs => {
        if (tabs.length === 0) {
          chrome.tabs.create({ url: 'https://chat.openai.com/', active: false }, tab => {
            // Inject content script
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js']
            });
          });
        } else {
          // Inject content script into existing tab
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
          });
        }
      });
      }
    });
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.command === 'awtsmoosTseevoy') {
        try {
            chrome.tabs.query({ url: 'https://chat.openai.com/*' }, tabs => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, { command: 'awtsmoosTseevoy', data: message.data }, res => {
                    console.log("Got response!", res);
                    sendResponse(res);
                });
            }
            });
        } catch(e) {
            sendResponse("Not open")
        }
        return true; // Indicates async response
      }
  });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Got", message)
    
  
    
  });