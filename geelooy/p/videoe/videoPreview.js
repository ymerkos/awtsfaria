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
        const file = videoInput.files[0];
        const chunkSize = 1024 * 1024; // 1MB chunk size

        const reader = new FileReader();
        reader.onload = function() {
            const arrayBuffer = this.result;
            const uint8Array = new Uint8Array(arrayBuffer);
            sourceBuffer.appendBuffer(uint8Array);
            receivedLength += arrayBuffer.byteLength;
            if (receivedLength < file.size) {
                const start = receivedLength;
                const end = Math.min(file.size, start + chunkSize);
                const nextChunk = file.slice(start, end);
                reader.readAsArrayBuffer(nextChunk);
            }
        };
        reader.readAsArrayBuffer(file.slice(0, chunkSize));
    });
});

videoInput.addEventListener('change', function() {
    previewVideo.style.display = 'block';
    previewCanvas.style.display = 'none';
    mediaSource.endOfStream();
    mediaSource.removeSourceBuffer(mediaSource.sourceBuffers[0]);
});
