//B"H
// content.js
// content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'awtsmoosTseevoy') {
      // Handle the command here, for example, sending "hi" to chat.openai.com
      let result = executeCommand(message.data);
      sendResponse(result);
    }
  });
  
  function executeCommand(command) {
    // Implementation for handling the command on chat.openai.com
    // Return the result to the caller
    console.log("Hi!", command)
  }
  