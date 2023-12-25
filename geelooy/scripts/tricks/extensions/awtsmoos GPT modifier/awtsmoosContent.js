//B"H
// awtsmoosContent.js
console.log("B\"H - Awtsmoos Content Script Loaded");
var ID = Date.now();
var nm = "BH_page_"+ID;
var realName = realName;
var port;
window.addEventListener('message', event => {
  if (event.origin !== 'https://awtsmoos.com') return;
  if (event.data.type === 'awtsmoosRequest') {
    var name = event.data.name || nm;
    if(!realName) {
      realName = name;
      
    }
    if(!port) {
      
      port = chrome.runtime.connect({name:realName});
      port.postMessage({name:realName})

      port.onMessage.addListener(ms => {
        //console.log("message",ms)
        var to = ms.to;
        
        window.postMessage({
          type: "awtsmoosStreaming",
          data:ms,
          to
        })
        
      });
      port.onDisconnect.addListener(p => {
        port = null;
        console.log("Disconnected")
        realName = null;
      })
    }

    console.log("Got it, sending", event.data);
    var args = event.data.args;
    if(!args) {
      console.log("No args!");
      return;
    }
    chrome.runtime.sendMessage({command: 'awtsmoosTseevoy', data: {
        from: realName,
        args
      }
    }, response => {
      
      console.log("Single response",response,name);
      window.postMessage({ type: 'awtsmoosResponse', data: {
        to:name,
        ...response
        
      } }, 'https://awtsmoos.com');

      try {
        if(port) {
         // port.disconnect()
        }
      } catch(e){
        console.log(e)
      }
    });
  } else {
    //console.log("Got other data: ",event.data)
  }
});


