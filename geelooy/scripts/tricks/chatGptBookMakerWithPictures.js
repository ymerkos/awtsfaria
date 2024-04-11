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
            console.log("Trying")
            
            inp.onchange = () => {
                console.log("HI!",inp.files)
                onfocus=null;
                r()
            };
            inp.onerror = () => {
                console.log("OK",inp)
                onfocus=null;
                r()
            }
            
            var clicked = 0;
            var focused = false;
            inp.onclick = (e) => {
                console.log("Cliked",e)
                clicked++;
            }
            inp.click();
            onfocus = (e) => {
                return
                if(!focused) {
                    focused = true;
                    return;
                }
                
                if(clicked < 1) return;

                console.log("Fnished it",inp.files)
                r()
                
            }
            
                
                
                
                console.log("did")
        });
        
        console.log("WO",inp.files)
        var fl = Array.from(inp.files);
        console.log("Did it",fl)
        if(fl.length) {
            for(
                var file of fl
            ) {
                var reader = new FileReader();
                var dataURL = await new Promise(
                    (resolve, reject) => {
                    reader.onload = function() {
                        
                        resolve(reader.result);
                    };
                    reader.onerror = function() {
                        resolve(null)
                    };
                    reader.readAsDataURL(file);
                });
                
                if(dataURL)
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
    var withAiImgs = await doIt();
    console.log("Did",withAiImgs)
    var withFullDataUrls = await Promise.all(
      withAiImgs.map(async (w, i) => {
        if (i % 2 !== 0 && w.ai) {
          // Fetch and store full data URLs for images
          var fullDataUrls = await fetchAndEncodeImages(w.ai.images);
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
    var compiled = withFullDataUrls.filter((w) => Boolean);
  
    return compiled;
  }
  
  // Function to fetch images and encode them as data URLs
  async function fetchAndEncodeImages(images) {
    var encodedImages = await Promise.all(
      images.map(async (imgSrc) => {
        if(typeof(imgSrc) != "string")
            return console.log("What?",imgSrc)
        if(imgSrc.startsWith("data:")) 
            return imgSrc;

        var response = await fetch(imgSrc);
        var blob = await response.blob();
        var dataURL = await blobToDataURL(blob);
        return dataURL;
      }).filter(Boolean)
    );
    return encodedImages;
  }
  


  // Function to convert Blob to Data URL
  function blobToDataURL(blob) {
    return new Promise((resolve) => {
      var reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
  // Function to generate elaborate HTML for the conversation
  async function generateElaborateHTML(conversation) {
    var html = /*html*/`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Intense Conversation</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
        body {
        background-color: #f7f7f7; /* Light background for readability */
        color: #333333; /* Dark grey text for less contrast */
        font-family: 'Georgia', serif; /* Serif font for a bookish feel */
        line-height: 1.6;
        padding: 30px;
        margin: 0;
        font-size: 20px; /* Reduced font size for elegance */
        transition: all 0.5s ease-in-out;
        }

        body.dark-mode {
        background-color: #1e1e1e; /* Darker background */
        color: #dddddd; /* Lighter text */
        }

        .message {
        border: 2px solid #adadad; /* Subtle border */
        margin: 30px;
        padding: 40px;
        border-radius: 8px;
        white-space:pre-wrap;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Softer shadow */
        }

        
        .user {
        background: linear-gradient(to bottom, #3a7bd5, #22588a); /* Refined gradient */
        color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        font-weight: bold;
        }

        .user::before {
            content: "${"Me\\\n"}"
        }

        .ai {
        background: linear-gradient(to bottom, #ffa07a, #ff7f50); /* Muted orange gradient */
        color: #333333; /* Dark text for contrast */
        padding: 20px;
        border-radius: 8px;
        font-weight: bold;
        }

        .ai::before {
            content: "${"AI\\\n"}"
        }

        img {
        max-width: 100%;
        height: auto;
        border: 4px solid #8a8a8a; /* Softer border color */
        border-radius: 12px;
        }

          
          h1 {
            color: rgba(255, 0, 0, 0.9); /* More intense red */
            text-align: center;
            text-transform: uppercase;
            text-shadow: 2px 2px 4px #000000;
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
      var blob = new Blob([elaborateHTML], { type: 'text/html;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a")
      a.href=url;
      a.download="BH_"+Date.now()+"_"+(Math.floor(Math.random()*1000))+".html"
      a.click();
    });
  }
  
  
  var data = await compiledWithImages();
  openConversationInNewTab(data)
