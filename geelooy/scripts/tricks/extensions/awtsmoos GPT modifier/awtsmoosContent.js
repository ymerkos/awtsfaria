//B"H
// awtsmoosContent.js
console.log("B\"H - Awtsmoos Content Script Loaded");

window.addEventListener('message', event => {
  if (event.origin !== 'https://awtsmoos.com') return;
  if (event.data.type === 'awtsmoosRequest') {
    console.log("Got it, sending", event.data)
    chrome.runtime.sendMessage({ command: 'awtsmoosTseevoy', data: event.data.hi }, response => {
      window.postMessage({ type: 'awtsmoosResponse', data: response }, 'https://awtsmoos.com');
    });
  }
});
