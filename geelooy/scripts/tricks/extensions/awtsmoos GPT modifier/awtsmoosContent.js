//B"H
// awtsmoosContent.js
console.log("B\"H"," - Awtsmoos Content Script Loaded",
chrome.runtime
);
var ID = Date.now();
var nm = "BH_page_"+ID;
var realName = realName;
var port;
window.addEventListener('message', event => {
  if (event.origin !== 'https://awtsmoos.com') return;
  var args = event.data.args;
  if (event.data.type === 'awtsmoosRequest') {
    var name = event.data.name || nm;

    realName = name;
    
  
  
    
    port = chrome.runtime.connect({name:realName});
    port.postMessage({name:realName})

    port.onMessage.addListener(ms => {
      // console.log("message",ms)
      if(ms.streaming) {
        var to = ms.to;
        
        window.postMessage({
          type: "awtsmoosStreaming",
          data:ms,
          to
        })
      }
      /*  
      */
      var d = ms.gptData;
      if(d) {
        console.log("Got gpt!",d)
        window.postMessage({ type: 'awtsmoosResponse', data: {
          to:name,
          ...d
          
        } }, 'https://awtsmoos.com');

        try {
          if(port) {
            port.disconnect()
          }
        } catch(e){
          console.log(e)
        }
      }
      
    });
    port.onDisconnect.addListener(p => {
      port = null;
      console.log("Disconnected")
      realName = null;
    })
    
    console.log("Got it, sending", event.data);
  
  
    if(!args) {
      console.log("No args!");
      return;
    }
  
    var msg = {
      command: 'awtsmoosTseevoy', data: {
        
        args
      },
      from: realName,
      to: "gptify"
    }
    console.log("Sending from: ",realName,msg)
    port.postMessage(msg)

   
/*
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
    });*/
  } else {
    //console.log("Got other data: ",event.data)
  }
});


