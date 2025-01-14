//B"H
// Define the ResizableWindow class to manage window creation, resizing, and dragging

export default class ResizableWindow {
    GAP=10;
    PADD=6;
    constructor({
        title, 
        content,
        handler
    }={}) {
        this.title = title;
        this.content = content;
        this.minWidth = 100;
        this.minHeight = 100;
        this.handler = handler;
        if(!window.awtsmoosWindowID) {
            window.awtsmoosWindowID = "BH-"+Date.now();
        }
        this.ID = window.awtsmoosWindowID;
        this.createWindow();
        this.addResizeHandles();
        this.makeDraggable();
        
    }

    close() {
        
        this.win.parentNode.removeChild(this.win);
        this?.handler?.onclose?.(this);
        delete this;
    }

    makeActive() {
        this.active = true;
        this?.handler?.onactive?.(this);
        this.win.classList.add("active");
    }

    makeInactive() {
        this.active = false;
        this.win.classList.remove("active");
    }
    
    toggleFullscreen() {
        
        if(!this.isFullscreened) {
            this.oldDim =  Object.assign({},getComputedStyle(this.win));
            console.log(window.k=this.oldDim)
            //fullscreen the window
            this.win.style.left = 0;
            
            this.win.style.top = 0;
            
            this.win.style.width="100%"
            
            this.win.style.height="100%";
            this.isFullscreened = true;
            this.oldFlsBtnH = this.fullScreenBtn.innerHTML;
            this.fullScreenBtn.innerHTML = "o";
        } else {
            var {width, height, left, top} = this.oldDim;
            this.win.style.left = left;
            
            this.win.style.top = top;
            
            this.win.style.width=width
            
            this.win.style.height=height;
            
            this.isFullscreened = false;
            this.fullScreenBtn.innerHTML = this.oldFlsBtnH;
        }
    }

    // Create the window element with title and content
    createWindow() {
        // Create main window container
        this.win = document.createElement('div');
        this.win.className = `${this.ID}-window`;
        this.win.style.left = '100px'; // Initial position
        this.win.style.top = '100px';  // Initial position

        var self = this;
        this.win.addEventListener("mousedown", () => {
            if(!self.active) {
                self.makeActive()
            }
        });
        // Create window header (title bar)
        const header = document.createElement('div');
        header.className = 'window-header';
        this.winHeader = header;
        
        var titleSect = document.createElement("div");
        titleSect.className = "header-title"
        header.appendChild(titleSect)

        var textOfTitle = document.createElement("div");
        textOfTitle.className = "header-text"
        textOfTitle.textContent = this.title;
        titleSect.appendChild(textOfTitle);
        this.headerTxt = textOfTitle;
        
        var ctrls = document.createElement("div");
        ctrls.className = "header-ctrls"
        this.winCtrls = ctrls;
        var self = this;
        header.appendChild(ctrls)
        var btns = {
            
            "-": () => {
                
            },
            O(win, btn) {
                btn.onclick = () => self.toggleFullscreen();
                self.fullScreenBtn = btn;
            },
            X(win, btn) {
                btn.classList.add("x");
                btn.onclick = () => self.close();
            },
        }
        Object.keys(btns).forEach(k => {
            var btn = document.createElement("div")
            btn.className="header-btn";
            ctrls.appendChild(btn);
            btn.awtsBtn = true;
            var ac = btns[k];
            if(typeof(ac) == "function") {
                ac(this.win, btn);    
            }
            btn.innerText = k;
        });
        this.win.appendChild(header);

        this.minWidth = this.winHeader.scrollWidth;
        this.minHeight = this.winHeader.scrollHeight;
        this.maxHeight = "500px";
        // Create window body (content area)
        const body = document.createElement('div');
        body.className = 'window-content';
        this.winBody = body
        if(typeof(this.content) == "string") 
            body.innerHTML = this.content;
        else if (this.content instanceof HTMLElement) {
            body.appendChild(this.content);
        }
        this.win.appendChild(body);
        this.win.style.height = "500px";
        this.winBody.style.minWidth = `${this.minWidth}px`; // Set minimum width
        this.winBody.style.minHeight = `${this.minHeight}px`; // Set minimum height
        this.winBody.classList.add("windows-body")
        // Append the window to the desktop
        document.getElementById('desktop').appendChild(this.win);
        if(!window.awtsmoosWindowStyleAdded) {
            window.awtsmoosWindowStyleAdded = true;
            this.addStyles()
        }
    }

    // Add resize handles to the window
    addResizeHandles() {
        const handles = [
            { class: 'resize-n', cursor: 'ns-resize' },
            { class: 'resize-s', cursor: 'ns-resize' },
            { class: 'resize-e', cursor: 'ew-resize' },
            { class: 'resize-w', cursor: 'ew-resize' },
            { class: 'resize-ne', cursor: 'ne-resize' },
            { class: 'resize-se', cursor: 'se-resize' },
            { class: 'resize-sw', cursor: 'sw-resize' },
            { class: 'resize-nw', cursor: 'nw-resize' },
        ];

        handles.forEach(handle => {
            const div = document.createElement('div');
            div.className = `window-resizer ${handle.class}`;
            div.style.cursor = handle.cursor;
            this.win.appendChild(div);
            this.addResizeEvent(div, handle.class);
        });
    }

    // Attach resize event to a handle element
    addResizeEvent(handleElement, resizeDirection) {
        let startX, startY, startWidth, startHeight, startLeft, startTop;
        resizeDirection = resizeDirection.replace("resize-", "");
        var self = this;
        handleElement.onmousedown = (e) => {
            e.preventDefault();
            this.minWidth = this.winCtrls.scrollWidth + 
                this.headerTxt.scrollWidth + this.GAP + this.PADD * 2;
            this.minHeight = this.winHeader.scrollHeight;
            startX = e.clientX;
            startY = e.clientY;

            startWidth = this.winBody.offsetWidth;
            startHeight = this.win.offsetHeight;
            startLeft = this.win.offsetLeft;
            startTop = this.win.offsetTop;

            const getNewWidth = (x, dir = 1) => startWidth + dir * (x - startX);
            const getNewHeight = (y, dir = 1) => startHeight + dir * (y - startY);

            const resizeHorizontal = (x, dir = 1) => {
                if(first) return;
                const newWidth = getNewWidth(x, dir);
                if (newWidth <= this.minWidth) return null;
                this.win.style.width = `${newWidth}px`; // Ensure minimum width
                return newWidth;
            };

            const resizeVertical = (y, dir = 1) => {
                if(first) return;
                const newHeight = getNewHeight(y, dir);
                if (newHeight <= this.minHeight) return null;
                this.win.style.height = `${newHeight}px`; // Ensure minimum height
                return newHeight;
            };

            const moveLeft = (x, dir = 1, nw) => {
                if (nw === null) return;
                if (nw <= this.minWidth) return;
                this.win.style.left = `${startLeft - dir * (x - startX)}px`; // Move the window left
            };

            const moveTop = (y, dir = 1, nh) => {
                if (nh === null) return;
                if (nh <= this.minHeight) return;
                this.win.style.top = `${startTop - dir * (y - startY)}px`; // Move the window up
            };

            const resizeOperations = {
                'e': (x, y) => {
                    resizeHorizontal(x);
                },
                'w': (x, y) => {
                    const nw = resizeHorizontal(x, -1);
                    moveLeft(x, -1, nw);
                },
                's': (x, y) => {
                    resizeVertical(y);
                },
                'n': (x, y) => {
                    const nh = resizeVertical(y, -1);
                    moveTop(y, -1, nh);
                },
                'ne': (x, y) => {
                    resizeOperations["n"](x, y);
                    resizeOperations["e"](x, y);
                },
                'se': (x, y) => {
                    resizeOperations["s"](x, y);
                    resizeOperations["e"](x, y);
                },
                'sw': (x, y) => {
                    resizeOperations["s"](x, y);
                    resizeOperations["w"](x, y);
                },
                'nw': (x, y) => {
                    resizeOperations["n"](x, y);
                    resizeOperations["w"](x, y);
                }
            };

            var first = true
            const resize = (e) => {
                const x = e.clientX;
                const y = e.clientY;
                
                if (resizeOperations[resizeDirection]) {
                    resizeOperations[resizeDirection](x, y);
                }
                first = false;
                self?.onresize(e);
            };

            document.addEventListener('mousemove', resize);

            document.onmouseup = () => {
                document.removeEventListener('mousemove', resize);
                document.onmouseup = null;
            };
        };
    }

    // Make the window draggable by attaching events to the title bar
    makeDraggable() {
        const header = this.win.querySelector('.window-header');
        let offsetX, offsetY, rect;

        header.onmousedown = (e) => {
            e.preventDefault();
            if(e.target.awtsBtn) {
                return;
            }
            rect = this.win.getBoundingClientRect()
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            var xPercent = offsetX / rect.width;
            document.onmousemove = (e) => {
                if(this.isFullscreened) {
                    var {width, height} = this.oldDim;
                    this.win.style.width = width;
                    this.win.style.height = height;
                    
                    this.isFullscreened = false;
                    console.log(offsetX,e.clientX)
                    
                    rect = this.win.getBoundingClientRect();
                    offsetX = rect.left + xPercent * rect.width;
                    this.fullScreenBtn.innerHTML = this.oldFlsBtnH;
                }
                this.win.style.left = `${e.clientX - offsetX}px`;
                this.win.style.top = `${e.clientY - offsetY}px`;
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }

    addStyles() {
        var sty = document.createElement("style")
        sty.innerHTML = `/*css*/
        /*B"H*/

            .${this.ID}-window .windows-body {
                height:400px;
            }
            .fileHolder {
                overflow:scroll;
            }
            .${this.ID}-window .window-header {
                background: #000080;
                color: white;
                padding: 5px;
                user-select: none;
                display:flex;
                
                flex-direction: row;
                gap: ${this.GAP}px;
                align-items: center;
                
                cursor: move;
                
            }

            .${this.ID}-window.active {
                box-shadow: 7px 6px 16px 0px black;
                
                z-index:12090;
            } 

            .${this.ID}-window .header-title {
                flex: 2;
                
            }

            .${this.ID}-window .header-text {
                display: inline-block;
            }

            .${this.ID}-window .header-ctrls {
                display: flex;
                gap: 1px;
            }

            .${this.ID}-window .header-btn {
                padding:${this.PADD}px;
                color:black;
                border-radius:50%;
                background:white;  
                min-width:15px;
                font-weight: bold;
                text-align: center;
            }

            .${this.ID}-window .header-btn.x {
                background: #ff4545;
                
            }

            .${this.ID}-window .header-btn:hover {
                cursor:pointer !important;
                background:#d0d0d0;   
            }

            
            .${this.ID}-window .header-btn:active {
                
                background:black;
                color:white;
            }
            
            .${this.ID}-window .window-content {
        
                height: calc(100% - 40px);
                overflow-y: auto;
            }
            
            .draggable {
                cursor: move;
            }
            /* Example CSS for window */
            .${this.ID}-window {
                position: absolute;
                background: #fff;
                z-index:1;
                box-sizing: border-box;
                max-height:100vh;
                max-width:100vw;
            }
            
            /* CSS for resize handles */
            .${this.ID}-window .window-resizer {
                position: absolute;
                background: rgba(0, 0, 0, 0);
                z-index: 10;
            }
            
            .resize-n, 
            .resize-s, 
            .resize-e, 
            .resize-w, 
            .resize-ne, .resize-se, .resize-sw, .resize-nw {
                width: 10px;
                height: 10px;
                cursor: pointer;
            }
            
            .${this.ID}-window .resize-n {
                top: -10px; 
                left: 50%; 
                transform: translateX(-50%); cursor: ns-resize;
                width:100%;
            }
            
            .${this.ID}-window .resize-s { 
                bottom: -10px; left: 50%; transform: translateX(-50%); cursor: ns-resize; 
               
                width:100%
            }
            .${this.ID}-window .resize-e { 
                right: -10px; top: 50%; transform: translateY(-50%); cursor: ew-resize;

                height:100%;
            }
            .${this.ID}-window .resize-w { 
                left: -10px; top: 50%; transform: translateY(-50%); cursor: ew-resize; 
                height:100%;
            }
            .${this.ID}-window .resize-ne { 
                top: -10px; right: -10px; cursor: ne-resize; 
              
            }
            .${this.ID}-window .resize-se {
                bottom: -10px; right: -10px; cursor: se-resize; 
            }
            .${this.ID}-window .resize-sw {
                bottom: -10px; left: -10px; cursor: sw-resize; 
            }
            .${this.ID}-window .resize-nw { 
                top: -10px; left: -10px; cursor: nw-resize;
            }
        `
        document.head.appendChild(sty);
    }
}
