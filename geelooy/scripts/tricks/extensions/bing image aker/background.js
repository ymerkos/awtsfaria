//B"H
chrome.runtime.onInstalled.addListener(() => {
    console.log("LOL!")
    chrome.tabs.create({url: 'https://www.bing.com/images/create'});
  });

  
