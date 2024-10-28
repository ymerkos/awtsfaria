//B"H
document.getElementById('transcribeButton').addEventListener('click', async () => {
    const apiKey = document.getElementById('apiKey').value;
    const audioFile = document.getElementById('audioFile').files[0];

    if (!apiKey || !audioFile) {
        alert("Please provide both an API key and an audio file.");
        return;
    }

    const uploadedAudioUrl = await uploadAudio(apiKey, audioFile);
    const transcriptionResponse = await requestTranscription(apiKey, uploadedAudioUrl);

    let transcriptionResult;
    do {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
        transcriptionResult = await pollTranscription(apiKey, transcriptionResponse.id);
    } while (transcriptionResult.status === 'processing');

    displayTranscription(transcriptionResult);
});

async function uploadAudio(apiKey, audioFile) {
    const formData = new FormData();
    formData.append('file', audioFile);

    const response = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
            'authorization': apiKey,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Error uploading audio: ' + response.statusText);
    }

    const data = await response.json();
    return data.upload_url; // Return the URL of the uploaded audio
}

async function requestTranscription(apiKey, uploadedAudioUrl) {
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
            'authorization': apiKey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audio_url: uploadedAudioUrl, word_boost: [], punctuation: true }),
    });

    if (!response.ok) {
        throw new Error('Error requesting transcription: ' + response.statusText);
    }

    return await response.json(); // Return the transcription request details
}

async function pollTranscription(apiKey, transcriptionId) {
    const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptionId}`, {
        method: 'GET',
        headers: {
            'authorization': apiKey,
        },
    });

    if (!response.ok) {
        throw new Error('Error polling transcription: ' + response.statusText);
    }

    return await response.json(); // Return the transcription result
}

function displayTranscription(transcription) {
    const resultElement = document.getElementById('transcriptionResult');
    resultElement.textContent = '';

    if (transcription.words) {
        transcription.words.forEach(word => {
            const wordInfo = `${word.word} (Start: ${word.start}, End: ${word.end})`;
            resultElement.textContent += wordInfo + '\n';
        });
    } else {
        resultElement.textContent = "Transcription failed.";
    }
}
