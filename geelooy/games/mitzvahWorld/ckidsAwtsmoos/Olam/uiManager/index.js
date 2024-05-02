/**
 * B"H
 */


import UI from "/games/scripts/awtsmoos/ui.js";
import style from "./ui/style.js";
import btnBubble from "./ui/resources/btnBubble.js"
import mainMenu from "./ui/mainMenu.js";
import gameMenu from "./gameMenu.js"
export default class UIManager {
    constructor() {
        
        
    }

    UI(opts={}) {
        var self = this;
        var onstart = opts.onstart;
        var ui = new UI();
        this.ui = ui;
        var h = ui.html({
            shaym: "ikar",
            children: [
                
                style,
                ...mainMenu
            ]
        });


        var first = false;
        h?.addEventListener("start", async e => {
          //  console.log(e)
         //   alert("Started! First time? "+first)
            if(!first) {
                first = true;
                start(e)
            }else {
                self.initializeForFirstTime(e, {
                    onstart
                })
            }
        });

        h?.addEventListener("olamPeula", peula => {
            var det = peula.detail;
            if(
                this.socket && 
                this.socket.eved && 
                det
            ) {
               
                Object.keys(det).forEach(w => {
                    this.socket.eved.postMessage({
                        [w]: det[w]
                    })
                })
            }
            
            
                    
               
        })

        function start(e) {
       //     alert("Starting")
            self.initializeForFirstTime(e, {
                onstart,
                onerror(e) {
                   
                    alert("There was an error "+e)
                    window.aa = ui;
                    ui
                    .htmlAction({
                        shaym: "loading",
                        properties: {
                            innerHTML: 
                            "There was an error. Check console, contact Coby."
                        }
                    })
                    
            
                }
            })
        
        }
        document.body.appendChild(h)
        return ui;
    }

    /*includes making new UI etc.*/
    initializeForFirstTime(e, opts={}) {
        var onstart = opts.onstart ;
        console.log(opts)
        if(!e.detail.worldDayuh) {
            alert("No world data provided!");
            return false; //didn't load
        }
        
    
        /*
            main parent
            div
        */
    //   alert("About to set up loading screen")
        var ui = this.ui
        var mainAv = ui.html({
            shaym: "main av",
            className: "mainAv"
        });

        var av = ui.html({
            shaym: "av",
            style: {
                position: "relative",
            
            },
            className: "mapAvBasic",
            parent: "main av",
            attributes: 
            {
                awts:2
            }
            
        });

        
        
        this.parentForCanvas = av;
        
        
        this.ui = ui;
        ui.html({
            parent: this.parentForCanvas,
            tag: "canvas",
            
            shaym: "canvasEssence"   
        });

        
        

        
        var worldDayuh = e.detail.worldDayuh;
        var gameUiHTML = e.detail.gameUiHTML;

        this.onerror = opts.onerror;
    //    alert("About to start world "+ this.started)
        if(!this.started) {
            
            onstart({
                worldDayuh,
                gameUiHTML
            });
            
        }

        

    }



    makeGameMenu() {
        /**
         * generate game side-menu
         */

        var par = ui.$g("gameID")
        console.log("parent",par)
        var menu = ui.html({
            shaym: "menu",
            parent: par,
            className: "gameMenu offscreen",
        })

        console.log(window.m = menu)
        if(!Array.isArray(gameMenu)) {
            return console.log("No menu array");
        }
        gameMenu.forEach(w => {
            this.gameMenuItem(w);
        })
    }

    gameMenuItem(opts={}) {
        var gm/*game menu*/ = this.ui.$g("menu")
        if(!gm) {
            return console.log("No menu")
        }

        var txt = opts.text;
        var show = opts.show
        var className = opts.showClass
        this.ui.html({
            parent:"menu",
            tag: "button",
            className: "backBtn mitzvahBtn",
            children: [
                {
                    className: "mitzvahBtnTxt",
                    textContent: txt,
                    
                },
                {
                    className:"svgHolder",
                    innerHTML:/*html*/`
                        ${btnBubble}
                    `
                }
            ],
            onclick(e, $, ui, me) {
                me?.blur()
                if(!show) return;

                var m = $("menu")
                
                if(!m) return;
                if(show == "menu") {
                    m.classList.toggle("offscreen");
                    m.classList.toggle("onscreen");
                    return;
                }
                var el = $(show)
                if(!el) return;
                $("menu").classList.add("offscreen");

                $("menu").classList.remove("onscreen");

                el.classList.toggle(className || "hidden")

            }
        })

    }

}