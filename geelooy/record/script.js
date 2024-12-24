//B"H

document.getElementById('start-button').addEventListener('click', async () => {
  const startButton = document.getElementById('start-button');
  const video = document.getElementById('video');

  try {
    // Request access to the back camera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } }
    });
    video.srcObject = stream;

    // Hide the button and show the video
    startButton.style.display = 'none';
    video.style.display = 'block';
  } catch (err) {
    console.error("Error accessing camera:", err);

    // Fallback to default camera if back camera is unavailable
    if (err.name === "OverconstrainedError") {
      alert("Back camera not available. Using default camera.");
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = fallbackStream;

        // Hide the button and show the video
        startButton.style.display = 'none';
        video.style.display = 'block';
      } catch (fallbackErr) {
        console.error("Error accessing fallback camera:", fallbackErr);
        alert("Unable to access camera. Please check your permissions.");
      }
    } else {
      alert("Unable to access camera. Please check your permissions.");
    }
  }
});
