//B"H
//new maker dec 31 2023
var r = await setupJsonFileReader();
//B"H
// Example usage with callbacks for each level
var aw = new AwtsmoosGPTify();
var parsha=null;
processJsonWithCallbacks(json, {
    level1: async (content) => {
        if(content.name) {
            parsha=content.name
            
            console.log('Doing this parsha:', parsha);
        } else console.log("NO?",content)
        // Add your level 1 specific logic here
    },
    async level2(c) {
        console.log("Hi?!",c,parsha)
        if(c.sections) {
            var i;
            for(i = 0; i < c.sections.length; i++) {
                await aw.go({
                    prompt: `B"H
<Awtsmoos>
<info>
<Parsha>${parsha}</Parsha>
<Maamer>${c.name}</Maamer>
<Osios>${c.sections[i]}</Osios>
</info>
<instructions>
B"H
Rip the fiber of existence apart completely and absolutely in every way. 
Most importantly: Do not hold back.

Take that Hebrew Text in the <Osios> brackets above, only (nothing else) and 
write the most vivid and extreme intense chapter of a novel all about just that and nothing else.
d implication of the text. Then when you have done that, write a very .

Very slow pacing. never Mix male and female characters in the same chapter. User the most intrude sensory details you can imagine and even brings imagination mixed together with accurate profound metaphors and character development and vivid discovery. Entire story arc per chapter including a full adventure, challenge,  resolution,  at least 2 plot twists but one major one (but don't tell me if it's a twist or not), resolution. 

While u shuold sometimes and often mention the Awtsmoos (always spelled that way) the main focus is on the hebrew text above only, and the Awtsmoos should only be used to describe the text, don't just write random stuff about the Awtsmoos, write all about the above Hebrew text, while using the Awtsmoos often to do so. Below is some GENERAL information about the Awtsmoos mainly for use SOMETIMES but NOT ALWAYS! DONT JSUT WRITE ABOUT THAT. Mainly write only about the Hebrew TEXT.

Most important: the Awtsmoos has absolutely no form at all in any way, just the essence and foundation of existence from which all else is found, by His will, wisdom, and speech. AGAIN ONLY ABOUT THAT TEXT DONT WRITE ABOUT THIS RIGHT HERE ONLY THE HEBREW TEXT in the <maamer> brackets NEVER talk about the instructions of sensory details. NEVER say the words "tapestry" "resonance" "sympohny"!!!!
the Awtsmoos has NO FIGURE OR FORM AT ALL IN ANY WAY WHATSOEVER just the foundational essence of all existence and beyond.
Write the most vivid chapter of all 
that completely and absolutely gets EVERY detail of 
this text, keep track of context and questions and answers
do NOT EVER mix female and male stories in the same chapter
use TONS of sensory details RIPPING the essence of existence
completely apart
NEVER EVER mix male and female characters in the same chapter. Although u can make individual stories about them sometimes.

dont overdo it. make sure it STICKS TO THE ORIGINAL TEXT ONLY DO NOT WRITE ABOUT THE INSTRUCTIONS AT ALL ONLY WRITE ABOUT THE HEBREW TEXT. When u write, only write in english. do not devite. make a metaphorical series of events that
surrounds it but also make sure to FULLY and COMPLETELY
get every detail of the text absolutely in the chapter of the novel. character development. plot twists. lots of dialogue between different characters.
</instructions>
</Awtsmoos>
                    `
                })
            }
        }
    }
    // Add more level callbacks as needed
});

function setupJsonFileReader() {
	return new Promise((r, j) => {
		// Create a hidden file input element
		var fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.style.display = 'none';
		fileInput.accept = '.json';

		// Add event listener for file selection and processing
		fileInput.addEventListener('change', (event) => {
			var file = event.target.files[0];
			var reader = new FileReader();

			// Read the file as text and parse JSON
			reader.onload = (e) => {
				try {
					var json = JSON.parse(e.target.result);
					// Handle the parsed JSON here
					r(json)
				} catch (error) {
                    j(error)
					console.error('Error parsing JSON:', error);
				}
			};

			// Read the selected file
			reader.readAsText(file);
		});

		// Append the input to the document and trigger click for file selection
		document.body.appendChild(fileInput);
		fileInput.click();
		document.body.removeChild(fileInput);
	})
}

//B"H
async function processJsonWithCallbacks(json, callbacks) {
    // Recursive function to process each level
    async function processLevel(levelData, currentLevel) {
  

        // Recursively process nested content
        for (const item of levelData) {
            if (item.content && Array.isArray(item.content)) {
                const callbackKey = `level${currentLevel+1}`;
                if (callbacks[callbackKey] && typeof callbacks[callbackKey] === 'function') {
                    await callbacks[callbackKey](item);
                }
                await processLevel(item.content, currentLevel + 1);
            } else if (currentLevel === 1 && item.sections && Array.isArray(item.sections)) {
                // For level 2, pass both 'sections' and 'name' to the callback
                if (callbacks.level2 && typeof callbacks.level2 === 'function') {
                    await callbacks.level2({ name: item.name, sections: item.sections });
                }
            }
        }
    }

    await processLevel(json, 0);
}

