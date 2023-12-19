//B"H
self.onmessage = function(e) {
    try {
      // Execute the script
      eval(e.data); // Using eval here, but be aware of the security risks
      postMessage('Script executed successfully');
    } catch (error) {
      postMessage('Error in script execution: ' + error.message);
    }
  };
  