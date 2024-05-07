//B"H
// background.js
console.log("B\"H");
var hasAI = null;
var chat=
"chatgpt.com"
var awtsmoosWebsites = [
  'awtsmoos.com', 
  //'chabad.org', 
  //'chabadlibrary.org', 
  //'lahak.org',
  "awtsfaria.web.app"
];

chrome.runtime.onInstalled.addListener(() => {
  findAndInjectOpenAIChat();
});

chrome.webNavigation.onCompleted.addListener(async details => {

  for (let website of awtsmoosWebsites) {
    if (details.url.includes(website)) {
      findAndInjectOpenAIChat();
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ['awtsmoosContent.js']
      });
      
    }
  }
  if(details.url.includes(chat)) {
    findAndInjectOpenAIChat();
  }
});

async function findAndInjectOpenAIChat() {
  return new Promise((r,j) => {
    console.log("Trying", hasAI)
 //   if(hasAI) return r(hasAI);
    chrome.tabs.query({ url: 'https://chatgpt.com/*' }, tabs => {
      if (tabs.length === 0) {
        chrome.tabs.create({ url: 'https://chatgpt.com/', active: false }, tab => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });
          hasAI = tab;
          r(hasAI)
        });
      } else {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js']
        });
        hasAI = tabs[0];
        r(hasAI)
      }
    });
  })
  
}

var ports = {};

chrome.runtime.onConnect.addListener(async port => {
  console.log("New connection", port)
  var nm = port.name;

  var pt = ports[nm]
  if(pt) {
    try {
      pt.disconnect()
    } catch(e) {

    }
  }
  ports[nm] = port;
  console.log("Added",nm)
  console.log(ports)


  function onDis(p) {
    var n = p.name
    var port = ports[n];
    if(port) delete port;
    console.log("deleted ",n)
  }
  port.onDisconnect.addListener((p => {
    onDis(p)
    hasAI = null;
  }))
  port.onMessage.addListener(async (message) => {
    console.log("portable", message);
    if (
      message.action === 'startChatGPT'
    ) {
     
      await findAndInjectOpenAIChat();
      console.log("Starting!",hasAI)
    }
    if(!hasAI) {
      await findAndInjectOpenAIChat();
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
        
       // console.log("found",p)
       // console.log("Sending",message,p)
        try {
          p.postMessage({
            ...message,
            from: message.name || message.from
          })
        } catch(e) {
          try {
            onDis(p)
          } catch (e) {
            console.log(e)
          }
        }
      }
    }


    
  });
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("Got message",message)
  if(!hasAI) {
    await findAndInjectOpenAIChat();
  }
  if (message.command === 'awtsmoosTseevoy') {
    try {
      if(hasAI) {
        chrome.tabs.sendMessage(hasAI.id, { command: 'awtsmoosTseevoy', data: message.data }, res => {
          console.log("Got response!", res);
          sendResponse(res);
        });
      } else {
        sendResponse("Not open")
      }
      
        
    } catch(e) {
      sendResponse("Not open");
    }
    return true; // Indicates async response
  }
});
