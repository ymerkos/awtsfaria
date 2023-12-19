//B"H
// awtsmoosContent.js
console.log("B\"H - Awtsmoos Content Script Loaded");
var ID = Date.now();
var nm = "BH_page_"+ID;

var port = chrome.runtime.connect({name:"BH_page_"+ID});
port.postMessage({name:nm})
port.onMessage.addListener(ms => {
  //console.log("message",ms)
  var to = ms.to;
  
  window.postMessage({
    type: "awtsmoosStreaming",
    data:ms,
    to
  })
  
});
window.addEventListener('message', event => {
  if (event.origin !== 'https://awtsmoos.com') return;
  if (event.data.type === 'awtsmoosRequest') {
    var name = event.data.name;

    console.log("Got it, sending", event.data)
    chrome.runtime.sendMessage({ command: 'awtsmoosTseevoy', data: {
      from: nm,
      text: event.data.hi
    } }, response => {
      
      
      window.postMessage({ type: 'awtsmoosResponse', data: {
        to:name,
        ...response
        
      } }, 'https://awtsmoos.com');
      
    });
  } else {
    console.log("Got other data: ",event.data)
  }
});


