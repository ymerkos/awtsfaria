//B"H

/*
Play text effect
*/
export default addTextWithPopEffect
//B"H
async function addTextWithPopEffect(text) {

    // Ensure the necessary styles are applied, if not already present
    if (!document.getElementById('text-container')) {
        // Create a container div for the text if it doesn't exist
        const container = document.createElement('div');
        container.id = 'text-container';
        document.body.appendChild(container);

        // Dynamically inject the necessary CSS
        const style = document.createElement('style');
        style.innerHTML = `
         

            #text-container {
                font-size: 80px; /* Huge text */
                line-height: 1.5;
                background:black;
                border-radius:50px;
                white-space: pre-wrap;
                font-family: 'Arial', sans-serif;
                word-wrap: break-word;
                    overflow: scroll;
                overflow-wrap: break-word;
                height: 550px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                max-width: 90%;
                text-align: center;
                font-weight: bold;
                color: #ffffff;
                text-shadow: 0 0 9px rgb(255 247 0 / 80%), 0 0 5px rgb(22 0 255 / 80%);
            }

            .pop {
                display: inline-block;
                opacity: 0;
                padding: 0px !important;
                 white-space: pre-wrap;
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
    var fc = container.firstChild; 
    while(fc && container.children.length > 20) {
          
        fc.parentNode.removeChild(fc)
        fc = container.firstChild;
       await new Promise(r=>setTimeout(r,20))
    }
    
    let index = 0;
    
     var holder = document.createElement("div")
     container.appendChild(holder);
    async function appendCharacter() {
            const span = document.createElement('span');
            span.classList.add('pop');
            //span.innerText = text
            span.innerText = text[index];
           holder.appendChild(span);
            index++;
            container.scrollTop = container.scrollHeight;
           await new Promise(r => setTimeout(r,30))
        
    }

    appendCharacter();
    // Add each character with a delay (simulating typing effect)
    while(index < text.length)
        await appendCharacter();  // Immediately add the first character
}
