//B"H
document.getElementById('save-script').addEventListener('click', saveScript);

function saveScript() {
  const scriptContent = document.getElementById('editor').value;
  chrome.storage.local.get('scripts', (data) => {
    let scripts = data.scripts || [];
    scripts.push(scriptContent);
    chrome.storage.local.set({ scripts: scripts }, loadScripts);
  });
}

function loadScripts() {
  chrome.storage.local.get('scripts', (data) => {
    const scriptList = document.getElementById('script-list');
    scriptList.innerHTML = ''; // Clear existing list
    data.scripts.forEach((script, index) => {
      const scriptElement = document.createElement('div');
      scriptElement.textContent = `Script ${index + 1}`;
      scriptElement.addEventListener('click', () => runScript(script));
      scriptList.appendChild(scriptElement);
    });
  });
}

function runScript(script) {
    console.log("Sending",script)
    chrome.runtime.sendMessage({
        action: "executeCode",
        code: script
    });
}


loadScripts();
