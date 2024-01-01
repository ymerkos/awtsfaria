//B"H
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchQuery').value;
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: setSearchQuery,
        args: [query]
      });
    });
  });
  
  function setSearchQuery(query) {
    chrome.tabs.sendMessage(chrome.tabs.TAB_ID_NONE, {action: 'setSearchQuery', query});
  }
  