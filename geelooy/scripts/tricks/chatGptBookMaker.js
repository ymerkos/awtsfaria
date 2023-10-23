// B"H
var selectImages = true;
async function doIt() {
    var g = document.getElementsByTagName("main")[0];
    if (!g) return false;
    alert("Select images (optional) to randomly distribute")
    var imagesLoaded = [];
    if(selectImages) {
        var inp = document.createElement("input");
        inp.type="file"
        inp.multiple = true;
        await new Promise((r,j) => {
            inp.onchange = () => {
                r()
            };
            inp.click();
        });
        var fl = Array.from(inp.files);
        if(fl.length) {
            for(
                const file of fl
            ) {
                const reader = new FileReader();
                const dataURL = await new Promise(
                    (resolve, reject) => {
                    reader.onload = function() {
                        
                        resolve(reader.result);
                    };
                    reader.onerror = function() {
                        reject(new Error('Error reading file.'));
                    };
                    reader.readAsDataURL(file);
                });
                
                
                imagesLoaded.push(dataURL)
                
            }
        }
        console.log("Got images",imagesLoaded)
        
    }

    var ch = g.getElementsByClassName("group w-full");
    var ar = Array.from(ch);
    var subs = ar.map((w) =>
      w.getElementsByClassName("relative flex w-[calc(100%-50px)] flex-col gizmo:w-full lg:w-[calc(100%-115px)] gizmo:text-gizmo-gray-600 gizmo:dark:text-gray-300")[0] ||
      w.getElementsByClassName("relative flex w-[calc(100%-50px)] flex-col gizmo:w-full lg:w-[calc(100%-115px)] agent-turn")[0]
    );
  
    var inners = subs.map((w) => (w ? w.getElementsByClassName("flex flex-grow flex-col gap-3 max-w-full")[0] : null));
    var m = inners.map((w, i) => (i % 2 == 0 ? { user: w.children[0] } : { ai: w }));
    var withAiImgs = m.map((w, i) => {
      if (i % 2 !== 0) {
        var foundImages = Array
        .from(
            w.ai.getElementsByTagName("img")
        ).map(
            (w) => w.src
        );
        var newImgs = getRandomElements(5,imagesLoaded);
        console.log(newImgs)
        return {
          ai: {
            images: 
                foundImages.concat(
                    newImgs
                )
            ,
            text: w.ai.getElementsByClassName("markdown prose w-full break-words dark:prose-invert")[0]
          },
          
        };
      } else {
        return w;
      }
    }).filter(w=>Boolean);
  
    return withAiImgs;
  }


  //B"H
function getRandomElements(maxNum, arr) {
    var numb = Math.floor(
        Math.random() * (maxNum - (1))
    ) + 1
    if(!Array.isArray) return [];
    if(!arr.length) return [];
    var thingsFound = []
    var i;
    for(
        i = 0;
        i < numb;
        i++
    ) {
        var randIndex = Math.floor(
            Math.random() * (arr.length - (0+1))
        ) + 0;
        thingsFound.push(arr[randIndex])
        arr.splice(randIndex,1)
    }
    return thingsFound
}


  async function compiledWithImages() {
    const withAiImgs = await doIt();
  
    const withFullDataUrls = await Promise.all(
      withAiImgs.map(async (w, i) => {
        if (i % 2 !== 0 && w.ai) {
          // Fetch and store full data URLs for images
          const fullDataUrls = await fetchAndEncodeImages(w.ai.images);
          if (!w.ai.text) return console.log("NO text!", w);
  
          // Update the AI object with the full data URLs and HTML text
          w.ai.images = fullDataUrls;
          w.ai.text = w.ai.text.innerHTML;
        } else {
          w.user = w.user.children[0].innerHTML;
        }
        return w;
      })
    );
  
    // Remove any items with no text
    const compiled = withFullDataUrls.filter((w) => Boolean);
  
    return compiled;
  }
  
  // Function to fetch images and encode them as data URLs
  async function fetchAndEncodeImages(images) {
    const encodedImages = await Promise.all(
      images.map(async (imgSrc) => {
        if(typeof(imgSrc) != "string")
            return console.log("What?",imgSrc)
        if(imgSrc.startsWith("data:")) 
            return imgSrc;

        const response = await fetch(imgSrc);
        const blob = await response.blob();
        const dataURL = await blobToDataURL(blob);
        return dataURL;
      }).filter(Boolean)
    );
    return encodedImages;
  }
  


  // Function to convert Blob to Data URL
  function blobToDataURL(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
  // Function to generate elaborate HTML for the conversation
  async function generateElaborateHTML(conversation) {
    const html = /*html*/`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Intense Conversation</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
        body {
            background-color: #ffffff; /* Default to light background */
            color: #000000; /* Default to dark text */
            font-family: 'Verdana', sans-serif;
            padding: 20px;
            margin: 0;
            font-size: 26px;
            transition: all 0.5s ease-in-out;
            white-space: pre-wrap;
            background: linear-gradient(45deg, #f3f3f3, #ffffff);
          }
          
          body.dark-mode {
            background-color: #000000; /* Dark background */
            color: #ffffff; /* Light text */
            background: linear-gradient(45deg, #121212, #000000);
          }
          
          .message {
            border: 4px double rgba(255, 0, 0, 0.9); /* More intense border */
            margin: 20px;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0px 0px 20px rgba(0,0,0,0.2);
          }
          
          .user {
            background: linear-gradient(to bottom, #0074d9, #004c91); /* Gradient blue background */
            color: #ffffff;
          }
          
          .ai {
            background: linear-gradient(to bottom, #ff851b, #e06600); /* Gradient orange background */
            color: black;
          }
          
          img {
            max-width: 100%;
            height: auto;
            border: 6px ridge rgba(255, 0, 0, 0.8); /* More intense border */
            border-radius: 8px;
          }
          
          h1 {
            color: rgba(255, 0, 0, 0.9); /* More intense red */
            text-align: center;
            text-transform: uppercase;
            text-shadow: 2px 2px 4px #000000;
          }
          
          @keyframes pulse {
            0% {
              text-shadow: 0 0 5px #ff0000, 0 0 25px #ff0000, 0 0 50px #ff0000, 0 0 200px #ff0000;
            }
            100% {
              text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000;
            }
          }
        </style>
      </head>
      <body>
        <h1>Intense Conversation</h1>
        <div class="conversation">
          ${conversation.map((message,i) => {
              if(!message) return 
            if (message.user) {
              return `
                <div class="message user">
                  ${message.user}
                </div>
              `;
            } else if (message.ai) {
              return `
                <div class="message ai">
                  ${message.ai.text}
                  ${message.ai.images.map(w=>`<img src="${w}" />`)}
                </div>
              `;
            }
          }).join('')}
        </div>
      </body>
      </html>
    `;
  
    return html;
  }
  
  // Function to open the generated HTML in a new tab
  function openConversationInNewTab(conversation) {
    generateElaborateHTML(conversation).then((elaborateHTML) => {
      const blob = new Blob([elaborateHTML], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      var a = document.createElement("a")
      a.href=url;
      a.download="BH_"+Date.now()+"_"+(Math.floor(Math.random()*1000))+".html"
      a.click();
    });
  }
  
  
  var data = await compiledWithImages();
  openConversationInNewTab(data)
