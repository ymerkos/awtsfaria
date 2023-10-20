//B"H
// background.js
console.log("B\"H");

const awtsmoosWebsites = ['awtsmoos.com', 'chabad.org', 'chabadlibrary.org', 'lahak.org'];

chrome.runtime.onInstalled.addListener(() => {
  findAndInjectOpenAIChat();
});

chrome.webNavigation.onCompleted.addListener(details => {
  for (let website of awtsmoosWebsites) {
    if (details.url.includes(website)) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ['awtsmoosContent.js']
      });
      findAndInjectOpenAIChat();
      break;
    }
  }
});

function findAndInjectOpenAIChat() {
  chrome.tabs.query({ url: 'https://chat.openai.com/*' }, tabs => {
    if (tabs.length === 0) {
      chrome.tabs.create({ url: 'https://chat.openai.com/', active: false }, tab => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
      });
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      });
    }
  });
}

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener((message) => {
    console.log("Start", message);
    if (message.action === 'startChatGPT') {
      findAndInjectOpenAIChat();
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
      sendResponse("Not open");
    }
    return true; // Indicates async response
  }
});
