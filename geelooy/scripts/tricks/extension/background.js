//B"H
// background.js
chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(message => {
      if (message.action === 'startChatGPT') {
        // Find or open chat.openai.com tab
        chrome.tabs.query({ url: 'https://chat.openai.com/*' }, tabs => {
          if (tabs.length === 0) {
            chrome.tabs.create({ url: 'https://chat.openai.com/', active: false });
          }
        });
      }
    });
  });
  
  chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    if (sender.url.includes('awtsmoos.com') || sender.url.includes('chabad.org')) {
      if (message.command === 'awtsmoosTseevoy') {
        chrome.tabs.query({ url: 'https://chat.openai.com/*' }, tabs => {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, { command: 'awtsmoosTseevoy', data: message.data }, sendResponse);
          }
        });
        return true; // Indicates async response
      }
    }
  });
  