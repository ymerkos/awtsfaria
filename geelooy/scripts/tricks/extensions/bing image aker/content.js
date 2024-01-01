//B"H
console.log("B\"H")
console.log("Welcome")
function setSearchQuery(query) {
    const searchInput = document.querySelector('#sb_form_q');
    if (searchInput) {
      searchInput.value = query;
      const searchButton = document.querySelector('#create_btn_c');
      searchButton.click();
      waitForElement("#mmComponent_images_as_1 > ul:nth-child(1) > li:nth-child(1) > div > div > a > div > img", () => setSearchQuery(query))
    }
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'setSearchQuery') {
      setSearchQuery(request.query);
    }
  });

  function waitForElement(selector, callback, interval = 500, maxAttempts = 200000) {
    let attempts = 0;
  
    // Function to check if the element exists
    function checkForElement() {
      return document.querySelector(selector) !== null;
    }
  
    // Function to be called when the element is found or attempts are exhausted
    function attemptFindingElement() {
      if (checkForElement()) {
        clearInterval(intervalId);
        observer.disconnect();
        callback();

      } else if (++attempts >= maxAttempts) {
        clearInterval(intervalId);
        observer.disconnect();
        console.log('Maximum attempts reached, element not found.');
      }
      console.log("ATTEMPTING!")
    }
  
    const observer = new MutationObserver(attemptFindingElement);
    observer.observe(document.body, { childList: true, subtree: true });
  
    const intervalId = setInterval(attemptFindingElement, interval);
  }
  

  
  
  // Optionally, trigger the search immediately on page load
onload = () =>setSearchQuery(`B"H Ripping all of reality apart completely and absoultely infinity of pure BLACK FIRE like a black hole vertex over manhatten sunset beautiful rainbow lightning intense vortex nexus of energy billions of people gathered under the entire globe super realism intense cinematic lighting vivid real all different settings rolling green hills waterfalls of pure light rainbow lightning rivers of knowledge flowing with flowers and snow sunlight lens flares`);
  