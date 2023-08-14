//B"H
// popup.js
document.getElementById('startButton').addEventListener('click', () => {
    chrome.runtime.connect().postMessage({ action: 'startChatGPT' });
  });
  