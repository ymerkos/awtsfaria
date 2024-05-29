//B"H
document.getElementById('videoInput').addEventListener('change', handleVideoUpload);

function handleVideoUpload(event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const video = document.getElementById('originalVideo');
    const canvas = document.getElementById('previewCanvas');
    const ctx = canvas.getContext('2d');

    video.src = url;
    video.play();

    video.addEventListener('loadeddata', () => {
        const targetWidth = 800; // Desired width for the preview
        const scale = targetWidth / video.videoWidth;
        const targetHeight = video.videoHeight * scale;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        video.addEventListener('play', () => {
            function drawFrame() {
                if (!video.paused && !video.ended) {
                    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
                    requestAnimationFrame(drawFrame);
                }
            }
            drawFrame();
        });
    });
}
