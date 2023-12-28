/**
 * B"H
 */
var p = new DOMParser();
String.prototype.deentitize = function() {
    var ret = this.replace(/&gt;/g, '>');
    ret = ret.replace(/&lt;/g, '<');
    ret = ret.replace(/&quot;/g, '"');
    ret = ret.replace(/&apos;/g, "'");
    ret = ret.replace(/&amp;/g, '&');
    return ret;
};
function getChatGPTAsHTML() {
    var m = document.getElementsByTagName("main")[0];
    if(!m) return console.log("Not on right page!")
    var cnt = m.children[1];
    if(!cnt) return console.log("NO couldn't find it")
    var convos = cnt.children[0];
    if(!convos) return console.log("NO couldn't find conversations")
    var ar = Array.from(convos.children[0].children[0].children[0].children);
    return ar.map(w=>{
        var role = w.getAttribute("data-testid")
        if(!role) return null;
        role = role.replace("conversation-turn-","")
        role = parseInt(role);

        var c = w.getElementsByClassName("markdown prose w-full break-words dark:prose-invert light")[0]
        var c2 = w.getElementsByClassName("min-h-[20px] text-message flex flex-col items-start gap-3 whitespace-pre-wrap break-words [.text-message+&]:mt-5 overflow-x-auto")[0]
        
        if(!c && !c2) return null;
        var txt = (c || c2).innerHTML
        
        if(role % 2 == 0) {
            txt = txt.deentitize();
            return {user: txt}
        } else return { ai: txt}
    }).filter(Boolean);
}
var data = getChatGPTAsHTML()

function getRidOfColorStyle(doc=document) {
    Array.from(doc.querySelectorAll("[style='color: #347235;font-family:Alef;']"))
    .forEach(w=>{
        w.style.cssText="";
        w.className="hawgaw"
    })
}

function createBookHTML(chatData) {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>ChatGPT Book</title>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Lora&display=swap');
        .hidden {
            display:none;
        }

        Awtsmoos {
            display:none;
        }

        body {
            font-family: 'Lora', serif;
            margin: 20mm;
            padding: 0;
            background-color: white;
            color: black;
            
            hyphens: auto;
            line-height: 1.5;
            /*column-count: 2; /* Split the body content into two columns */
        }
        
        span.psuq2 {
            font-size: 16px !important;
        }

        span.hawgaw {
            
            font-size: 16px;
        }

        .user, .ai {
           
            padding: 22px; /* Padding inside the border */
            margin: 12px 0px 12px; /* Margin on top and bottom */
            position: relative;
            background-color: white; /* Background color matching the page */
            border-bottom: 4px solid black; /* Bottom border */
            /*break-inside: avoid-column; /* Try to avoid breaking inside a column */
        }
        
        /*
        .user::before {
            content: "Me"
        }
        
        
        .ai::before {
            content: "AI"
        }
        */
        
        /* Middle and bottom border */
        .user::after, .ai::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: -4px; /* Position at the bottom */
            border-bottom: 4px solid black; /* Border */
            width: 100%;
        }
        
        .user {
            white-space:pre-wrap;
            
            word-break:break-word;
            font-size: 20px;
            
        }
        
        .ai {
            /*font-style: italic;*/
            font-size: 19px;
            
        }
        .beginning {
            text-align:center;
        }
        
        
        
        .page {
            break-after: auto;
        }
        
        
        
        .img {
            width:100%;
            margin:0
        }
        </style>
      </head>
      <body>
    `;
  
    let currentPage = 1;
  
    for (let i = 0; i < chatData.length; i++) {
      var entry = chatData[i];
  
      if (i > 0 && i % 2 === 0) {
        // Page break after every user message
        html += `</div><div class="page">`;
        currentPage++;
      }
  
      if (entry.user) {
        html += `<div class="user">${entry.user}</div>`;
      } else if (entry.ai) {
        html += `<div class="ai">${entry.ai}</div>`;
      }
    }
  
    html += `
      </div>
      </body>
      </html>
    `;
  
    var doc = p.parseFromString(html,"text/html");
    getRidOfColorStyle(doc);
    return "<!--B\"H-->\n"+doc.documentElement.innerHTML;
  }



  
  var bookHTML = createBookHTML(data);
  console.log(bookHTML); // This will display the formatted HTML in the console.
  