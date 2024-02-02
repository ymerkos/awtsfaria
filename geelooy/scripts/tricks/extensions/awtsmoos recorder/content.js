//B"H
console.log("HI!")
function st(streamId) {
navigator.mediaDevices.getUserMedia({
    audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId
        },
    },
    video: {
      mandatory: {
        chromeMediaSource: "tab",
        chromeMediaSourceId: streamId
      }
    }
  })
    .then((stream) => {
      recorder = new MediaRecorder(stream);
      chunks = [];
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      recorder.onstop = (e) => {
        const blob = new Blob(chunks, { type: "video/ogg; codecs=opus" });
        url = URL.createObjectURL(blob);
      }
      recorder.start();
    });
}