//B"H
// videoPreview.js

const videoInput = document.getElementById('videoInput');
const previewVideo = document.getElementById('previewVideo');
const previewCanvas = document.getElementById('previewCanvas');
const mediaSource = new MediaSource();

previewVideo.src = URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', function() {
    const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    let receivedLength = 0;

    sourceBuffer.addEventListener('updateend', function() {
        if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
            mediaSource.endOfStream();
        }
    });

    videoInput.addEventListener('change', function() {
        previewVideo.style.display = 'block';
        previewCanvas.style.display = 'none';
        if (mediaSource.readyState == 'open') {
            mediaSource.endOfStream();
        }
        if (mediaSource.sourceBuffers.length > 0) {
            mediaSource.removeSourceBuffer(mediaSource.sourceBuffers[0]);
        }
        const file = videoInput.files[0];
        const chunkSize = 1024 * 1024; // 1MB chunk size
        let receivedLength = 0;
    
        const appendNextChunk = function(start) {
            const end = Math.min(file.size, start + chunkSize);
            const nextChunk = file.slice(start, end);
            const reader = new FileReader();
            reader.onload = function() {
                const arrayBuffer = this.result;
                const uint8Array = new Uint8Array(arrayBuffer);
                if (mediaSource.sourceBuffers.length > 0) {
                    const sourceBuffer = mediaSource.sourceBuffers[0];
                    sourceBuffer.appendBuffer(uint8Array);
                    receivedLength += arrayBuffer.byteLength;
                    if (receivedLength < file.size) {
                        appendNextChunk(receivedLength);
                    }
                }
            };
            reader.readAsArrayBuffer(nextChunk);
        };
    
        if (file && mediaSource.readyState === 'open') {
            const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
            appendNextChunk(0);
        }
    });
});

videoInput.addEventListener('change', function() {
    previewVideo.style.display = 'block';
    previewCanvas.style.display = 'none';
    mediaSource.endOfStream();
    mediaSource.removeSourceBuffer(mediaSource.sourceBuffers[0]);
});
