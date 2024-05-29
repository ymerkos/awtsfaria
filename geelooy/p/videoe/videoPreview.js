//B"H
document.getElementById('videoInput').addEventListener('change', handleVideoUpload);

function handleVideoUpload(event) {
    const file = event.target.files[0];
    const video = document.getElementById('previewVideo');

    const mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', () => {
        const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        const chunkSize = 1024 * 1024; // 1MB chunks
        let offset = 0;

        const readNextChunk = () => {
            const reader = new FileReader();
            const blob = file.slice(offset, offset + chunkSize);
            reader.onload = () => {
                sourceBuffer.appendBuffer(new Uint8Array(reader.result));
                offset += chunkSize;
                if (offset < file.size) {
                    readNextChunk();
                } else {
                    // Wait for the 'updateend' event before calling endOfStream
                    sourceBuffer.addEventListener('updateend', () => {
                        mediaSource.endOfStream();
                    });
                }
            };
            reader.readAsArrayBuffer(blob);
        };

        readNextChunk();
    });
}
