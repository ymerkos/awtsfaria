//B"H
console.log(
    "B\"H",
    2
);
document.getElementById('startRecording').addEventListener('click', function() {
    chrome.runtime.sendMessage({
        name: "Awtsmoos Rec"
    })
});



document.getElementById('stopRecording').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "stopRecording"}, function(response) {
        if(response.status === "recording_stopped"){
            document.getElementById('startRecording').disabled = false;
            document.getElementById('stopRecording').disabled = true;
        }
    });
});
