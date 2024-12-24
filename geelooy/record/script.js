//B"H
document.getElementById('start-button').addEventListener('click', async () => {
  const startButton = document.getElementById('start-button');
  const video = document.getElementById('video');

  try {
    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    // Hide the button and show the video
    startButton.style.display = 'none';
    video.style.display = 'block';
     video.muted=true
  } catch (err) {
    console.error("Error accessing camera:", err);
    alert("Unable to access camera. Please check your permissions.");
  }
});
