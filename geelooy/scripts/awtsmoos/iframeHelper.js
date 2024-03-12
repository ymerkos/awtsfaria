/**B"H 
 * 
 * way to have iframes on page easy
*/
class iFrameHelper {
    constructor() {

    }

    configureIframe(query, postContent = "Put your content here!") {
        var frame = document.querySelector(query);
        if(!frame) return null;
        var frameJS = /*javascript*/`
        (() => {
            console.log("BH",
            "from iframe!")
            var commands = {
                size: () => ({
                    size: {
                        width: getAbsoluteWidth(document.documentElement),
                        height:getAbsoluteHeight(document.documentElement)
                    }
                }),
                adjustFontSize: (cm) => {
                    adjustFontSize(cm);
                }
            };


            window.onmessage = e => {
                console.log("Doign!",e)
                if(!e.data) {
                    return
                }
                if(!e.data.fromMain) {
                    return console.log("message not from main!")
                }
                var keys = Object.keys(e.data);
                for(var ind in keys) {
                    var k = keys[ind]
                    var cm = commands[k];
                    console.log("cmnd",cm)
                    if(cm && typeof(cm) == "function") {
                        var rs = cm(e.data[k]);
                        if(rs) {
                            try {
                                window.parent.postMessage({
                                    [k]: rs
                                }, "*")
                            } catch(e) {
                                console.log(e)
                            }
                        }
                    }
                }
                
            }
        
            

            function getAbsoluteHeight(el) {
                // Get the DOM Node if you pass in a string
                el = (typeof el === 'string') ? document.querySelector(el) : el; 

                var styles = window.getComputedStyle(el);
                var margin = parseFloat(styles['marginTop']) +
                            parseFloat(styles['marginBottom']);
                var scroll  = el.scrollHeight

                return Math.max(
                    scroll+margin,
                    Math.ceil(el.offsetHeight + margin)
                )
            }

            function getAbsoluteWidth(el) {
                // Get the DOM Node if you pass in a string
                el = (typeof el === 'string') ? document.querySelector(el) : el; 

                var styles = window.getComputedStyle(el);
                var margin = parseFloat(styles['marginLeft']) +
                            parseFloat(styles['marginRight']);
                var scroll  = el.scrollWidth

                return Math.max(
                    scroll + margin,
                    Math.ceil(el.offsetWidth + margin)
                );
            }
    
            function loadFontSize() {
                var sz = localStorage.currentFontSize;
                if(typeof(sz) == "string") {
                    sz = parseInt(sz);
                    if(!postElement)
                        postElement = document.querySelector('.content');
                
                    postElement.style.fontSize = sz + "px";
                    sendSizeMessage()
                }
            }

            var self = this;
    
            function sendSizeMessage() {
                window.parent.postMessage({
                    size: {
                        width: getAbsoluteWidth(document.documentElement),
                        height:getAbsoluteHeight(document.documentElement)
                    }
                }, "*")
            }
            onload = () => {
                loadFontSize();
            };
        })();
        
    
        `;


        var frameHtml = /*html*/`
            <!--B"H-->
            <!DOCTYPE html>
            
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link rel="stylesheet" href="https://awtsmoos.com/heichelos/new-style.css" type="text/css">
            </head>
            <body>
                <div class="post">
                <div class="content">${postContent}
                </div>
                
                </div>
                ${
                    "<script"+">"
                }
                ${frameJS}
                ${
                    "</"+"script>"
                }
            </body>
            </html>
            
            
            `;
            frame.src = URL.createObjectURL(
                new Blob([
                    frameHtml
                ], {
                    type: "text/html"
                })
            );
            var loaded = false;
            
            //frame.contentWindow.document.body.innerHTML = frameHtml;
            onmessage = e=> {
                console.log(e.data, e, "A message!")
                /* var src = e.target[0];
                if(src !== frame.contentWindow) {
                    return console.log("Not from iframe")
                }*/
                if(e.data.fromMain) {
                    return console.log("From same window")
                }
                var d = e.data.size;
                if(d) {
                    if(d.width) {
                        // postFrame.style.width = d.width + "px";

                    }
                    if(d.height) {
                        postFrame.style.height = d.height + "px";
                    }
                    
                    console.log("Size!", d, frame, postFrame, postFrame.style.width,postFrame.style.height)
                }
            };

            frame.onload = () => {
                if(!loaded) {
                    loaded = true
                } else {
                    return;
                }
                frame.contentWindow.postMessage({
                    size: true,
                    fromMain: true
                }, "*")
            }
    }
}