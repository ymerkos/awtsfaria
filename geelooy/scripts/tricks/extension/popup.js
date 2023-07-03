//B"H
document.getElementById('openTab').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://chat.openai.com', active: false }, function(tab) {
        console.log("Tab opened in the background with id: ", tab.id);
    });
});
