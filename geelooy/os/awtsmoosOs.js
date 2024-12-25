//B"H
import AwtsmoosDB from "/ai/IndexedDBHandler.js";
import WindowHandler from "./windowHandler.js";


export default class AwtsmoosOS {
    constructor() {
        
        this.windowHandler = new WindowHandler(); 
        
        this.db = new AwtsmoosDB();
        window.os = this;
    }

    async start() {
        var utils = await import("/scripts/awtsmoos/api/utils.js")
        var k = Object.keys(utils)
        k.forEach(q => {
            window[q] = utils[q]
        })
        await this.db.init("awtsmoos-os");
        this.makeDesktop();
        await this.showDesktopFiles();    
    }
    addWindow(...args) {
        this.windowHandler.addWindow(...args)
    }

    async createFile(path, title, content="") {
        await this.db.Koysayv(path, title, content);
        if(path=="desktop") {
            await this.showDesktopFiles();
        }
    }

    makeDesktop() {
        if(!window.madeDesk) {
            window.madeDesk = "BH-"+Date.now();
            
            this.md = window.madeDesk;
            var sty = document.createElement("style");
            document.head.appendChild(sty);
            sty.innerHTML = `/*css*/
                /*B"H*/
                .${this.md} .desktop {
                    position: relative;
                    width: 100vw;
                    height: calc(100vh - 40px); /* Adjusting for the start bar height */
                    background: #c0c0c0;
                }
                .${this.md} .file {
                    margin: 10px;
                    background:white;
                    border: 1px solid black;
                    display: inline-flex;
                    flex-direction: column;
                    gap: 5px;
                    align-items: center;
                }

                .${this.md} .fileName {
                    padding: 5px;
                }

                
                .${this.md} .file:hover {
                    background: #d2d2d2;
                    cursor:pointer;
                }
                
                .${this.md} .file:active {
                    background: blue;
                    color:white;
                }
            `;
        }
    }

    getDesktop() {
         
        var desk = document.querySelector(".desktop");
        this.desktop = desk;
        return desk;
    }

    async showDesktopFiles() {
        var desk = this.getDesktop();
        if(!desk) return;
        if(this.desktop) {
            this.desktop.classList.add(this.md)
        }
        var fileArea = desk.querySelector(".fileHolder")
        if(!fileArea) {
            fileArea = document.createElement("div")
            fileArea.className="fileHolder"
            desk.appendChild(fileArea);
        }
        fileArea.innerHTML = "";
        var gotFiles = await this.db.getAllKeys("desktop");
        console.log(gotFiles)
        gotFiles.forEach(w => {
            var f = document.createElement("div");
            f.className = "file"
            var icon = document.createElement("div")
            icon.className = "icon"
            f.appendChild(icon);

            var nm = document.createElement("div")
            nm.textContent = w;
            nm.className = "fileName";
            f.appendChild(nm);

            f.onclick = async () => {
                var content = await this.db.Laynin("desktop", w);
                this.addWindow({
                    title: w,
                    content,
                    path: "desktop",
                    os: this
                })
            }

            fileArea.appendChild(f);
        })
    }
    
}
