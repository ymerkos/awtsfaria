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

var ports = {};

chrome.runtime.onConnect.addListener(port => {
  console.log("New connection", port)
  var nm = port.name;
  if(!ports[nm]) {
    ports[nm] = port;
    console.log("Added",nm)
    console.log(ports)
  }
  port.onMessage.addListener((message) => {
    console.log("portable", message);
    if (message.action === 'startChatGPT') {
      findAndInjectOpenAIChat();
  
    }

    if(message.name) {
      
      if(!ports[message.name]) {
        console.log("new name",message)
        ports[message.name] = port;
      }
    }

    if(message.to) {
      var p = ports[message.to];
      if(p) {
        
        console.log("found",p)
        console.log("Sending",message,p)
        try {
          p.postMessage({
            ...message,
            from: message.name
          })
        } catch(e) {
          console.log(e)
        }
      }
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
