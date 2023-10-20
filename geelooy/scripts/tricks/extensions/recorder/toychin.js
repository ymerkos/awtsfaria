/**
 * B"H
 */

chrome.runtime.onMessage.addListener((q => {
    console.log("MEsst?")
    chrome.desktopCapture.chooseDesktopMedia(
        [
            "screen",
            "window"
        ],
        streamId => {
            console.log("exTreame",streamId);

            navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: "desktop",
                        chromeMediaSourceId: streamId
                    }
                }
            })
        }
    );

    
}));