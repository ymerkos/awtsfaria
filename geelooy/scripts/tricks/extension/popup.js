//B"H
// popup.js
var port = chrome.runtime.connect({ name: 'popup' });

document.getElementById('startButton').addEventListener('click', () => {
  console.log("got!");
  port.postMessage({ action: 'startChatGPT' });
});

document.getElementById('sendCommand').addEventListener('click', () => {
  let command = document.getElementById('commandInput').value;
  response.innerHTML ="Maybe loading...";
  try {
    chrome.runtime.sendMessage({ command: 'awtsmoosTseevoy', data: command }, res => {
        console.log("Got res", res);
        if(!res) {
            document.getElementById('response').innerHTML = "There was a problem, make sure to START it first!";
            return;
        }
        var r = res;
        if(r.message) {
            if(r.message.content.parts[0]) {
                r = r.message.content.parts[0]
            }
        }
        document.getElementById('response').innerText = r;
    });
    } catch(e) {
        response.innerHTML = "There was an error. Make sure to start ChatGPT first!"
    }
});

cp.onclick = async () => {
    cp.innerHTML = "Copying.."
    await navigator.clipboard.write(response.innerText);
    cp.innerHTML = "Copied! Again?"
}
