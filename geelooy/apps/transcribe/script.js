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
let fullTranscript = ''; // Global variable to store the entire transcript

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
        fullTranscript = ''; // Reset the full transcript

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

    // Process both final and interim results
    for (let i = resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        // Only add to full transcript if it's a final result
        if (event.results[i].isFinal) {
            fullTranscript += transcript + ' ';
            transcriptDisplay.textContent = fullTranscript; // Update the display with the full transcript
        } else {
            // For interim results, display them in real-time
            transcriptDisplay.textContent = fullTranscript + transcript; // Show ongoing transcription
        }

        // Capture each word with approximate timestamps for the final results
        if (event.results[i].isFinal) {
            const words = transcript.split(' ');
            words.forEach((word) => {
                if (word) {
                    const timestamp = audioContext.currentTime; // Approximate timestamp
                    wordsWithTimestamps.push({ word, timestamp });
                }
            });
            // Update the timestamp display
            updateTimestampsDisplay();
        }
    }
};

// Display final result for each segment and stop recognition
recognition.onend = () => {
    isAudioPlaying = false;
    // If you want to keep recognition running, do not stop it here
    recognition.start(); // Automatically start recognition again after it ends
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
