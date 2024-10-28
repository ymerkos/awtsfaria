//B"H
const audioFileInput = document.getElementById('audioFileInput');
const startButton = document.getElementById('start');
const transcriptDisplay = document.getElementById('transcript');
const timestampsDisplay = document.getElementById('timestamps');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true; // Enable interim results for real-time updates
recognition.continuous = true;     // Continue recognition until manually stopped

let audioContext;
let audioSource;
let wordsWithTimestamps = [];
let isAudioPlaying = false;

// Load audio file and enable start button
audioFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const objectURL = URL.createObjectURL(file);
        
        // Create audio context
        audioContext = new AudioContext();
        // Create an audio source when the file is loaded
        audioSource = audioContext.createBufferSource();
        
        // Fetch and decode audio data
        fetch(objectURL)
            .then(response => response.arrayBuffer())
            .then(buffer => audioContext.decodeAudioData(buffer))
            .then(decodedData => {
                audioSource.buffer = decodedData;
                audioSource.connect(audioContext.destination);
                startButton.disabled = false; // Enable start button
            });
    }
});

// Start transcription when start button is clicked
startButton.addEventListener('click', () => {
    if (audioSource) {
        wordsWithTimestamps = []; // Reset previous timestamps
        transcriptDisplay.textContent = ''; // Clear previous transcript
        timestampsDisplay.textContent = ''; // Clear previous timestamps

        audioContext.resume().then(() => {
            audioSource.start(0); // Play audio
            isAudioPlaying = true;
            recognition.start(); // Start speech recognition
        });
    }
});

// Capture real-time transcription and update timestamps
recognition.onresult = (event) => {
    const resultIndex = event.resultIndex;
    const transcript = event.results[resultIndex][0].transcript;

    // Display words as they are being transcribed
    transcriptDisplay.innerHTML += transcript + ' ';

    // Capture each word with approximate timestamps
    const words = transcript.split(' ');
    words.forEach((word) => {
        if (word) {
            const timestamp = audioContext.currentTime; // Approximate timestamp
            wordsWithTimestamps.push({ word, timestamp });
        }
    });

    // Update the timestamp display
    updateTimestampsDisplay();
};

// Display final result for each segment and stop recognition
recognition.onend = () => {
    isAudioPlaying = false;
    // recognition.stop(); // You may not need to stop recognition here since it's continuous
};

// Update display for timestamps
function updateTimestampsDisplay() {
    const timestampsText = wordsWithTimestamps
        .map(entry => `${entry.word}: ${entry.timestamp.toFixed(2)} seconds`)
        .join('<br>');
    timestampsDisplay.innerHTML = timestampsText;
}

// Handle recognition errors
recognition.onerror = (event) => {
    console.error('Recognition error:', event.error);
};
