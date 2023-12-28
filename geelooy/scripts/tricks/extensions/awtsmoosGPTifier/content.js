//B"H
function injectScript(code) {
    var script = document.createElement('script');
    script.textContent = code;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "executeScript") {
        alert("Hi! Trying to run script")
      console.log("Hi there!",request,sender,sendResponse)
      
    try {
        // Send the script to the Worker
        myWorker.postMessage(request.script);
      } catch (e) {
        console.log("Issue: ", e);
      }
      // Handle the result as needed
    }
  });
  