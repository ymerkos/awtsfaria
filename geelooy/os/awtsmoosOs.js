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
                
                /* B"H */
                .${this.md}.desktop {
                    position: relative;
                    width: 100vw;
                    height: calc(100vh - 40px); /* Adjusting for the start bar height */
                    background: linear-gradient(120deg, #1a237e, #673ab7, #e91e63, #ff9800);
                    background-size: 400% 400%;
                    animation: vividBackground 10s infinite alternate;
                    box-shadow: inset 0 0 150px rgba(255, 255, 255, 0.2), inset 0 0 300px rgba(0, 0, 0, 0.4);
                    
                    font-family: 'Trebuchet MS', sans-serif;
                }
                
                .${this.md} .fileHolder {
                    overflow-y: scroll;
                    backdrop-filter: blur(10px);
                    padding: 10px;
                    box-shadow: inset 0 0 50px rgba(255, 255, 255, 0.1);
                }
                
                .${this.md} .file {
                    margin: 15px;
                    background: radial-gradient(circle, #ffffff, #e0e0e0);
                    border: 2px solid rgba(0, 0, 0, 0.1);
                    border-radius: 12px;
                    display: inline-flex;
                    flex-direction: column;
                    gap: 10px;
                    align-items: center;
                    padding: 10px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }
                
                .${this.md} .fileName {
                    padding: 5px;
                    font-size: 1rem;
                    font-weight: bold;
                    color: #4a148c;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
                }
                
                .${this.md} .file:hover {
                    transform: translateY(-10px) scale(1.05);
                    background: radial-gradient(circle, #ffcc80, #ffa726);
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(255, 87, 34, 0.5);
                }
                
                .${this.md} .file:active {
                    background: radial-gradient(circle, #d32f2f, #f44336);
                    color: white;
                    box-shadow: inset 0 5px 10px rgba(0, 0, 0, 0.4);
                }
                
                @keyframes vividBackground {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
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
