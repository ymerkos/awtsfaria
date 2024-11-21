//B"H

/*
Play text effect
*/
export default addTextWithPopEffect
function addTextWithPopEffect(text) {
    // Ensure the necessary styles are applied, if not already present
    if (!document.getElementById('text-container')) {
        // Create a container div for the text if it doesn't exist
        const container = document.createElement('div');
        container.id = 'text-container';
        document.body.appendChild(container);

        // Dynamically inject the necessary CSS
        const style = document.createElement('style');
        style.innerHTML = `
            body {
                font-family: 'Arial', sans-serif;
                background-color: #111;
                color: #fff;
                margin: 0;
                padding: 0;
                overflow: hidden;
            }

            #text-container {
                font-size: 80px; /* Huge text */
                line-height: 1.5;
                white-space: pre-wrap;
                word-wrap: break-word;
                overflow-wrap: break-word;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                max-width: 90%;
                text-align: center;
                font-weight: bold;
                color: #ffffff;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 0, 0, 0.8);
            }

            .pop {
                display: inline-block;
                opacity: 0;
                transform: scale(0);
                animation: popAnimation 0.3s ease forwards, typingEffect 0.1s ease forwards;
            }

            @keyframes popAnimation {
                0% {
                    opacity: 0;
                    transform: scale(0);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes typingEffect {
                0% {
                    width: 0;
                }
                100% {
                    width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Get the container element
    const container = document.getElementById('text-container');
    
    let index = 0;
    function appendCharacter() {
        if (index < text.length) {
            const span = document.createElement('span');
            span.classList.add('pop');
            span.innerText = text[index];
            container.appendChild(span);
            index++;
        } else {
            // Reset the container to keep appending more text
            // This line clears the container after the text finishes
            // container.innerHTML = '';
        }
    }

    // Add each character with a delay (simulating typing effect)
    appendCharacter();  // Immediately add the first character
}
