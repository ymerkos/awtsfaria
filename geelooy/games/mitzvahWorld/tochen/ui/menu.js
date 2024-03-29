/*
B"H
        the in game menu
        that can be accessed in game.
    */
import instructions from "./instructions.js";
import btnBubble from "./resources/btnBubble.js";
export default [
    {
        shaym: "menu",
        className: "gameMenu offscreen",
        children: [
            
            {
                
                tag: "button",
                className: "backBtn mitzvahBtn",
                children: [
                    {
                        className: "mitzvahBtnTxt",
                        textContent: "Back",
                        
                    },
                    {
                        className:"svgHolder",
                        innerHTML:/*html*/`
                            ${btnBubble}
                        `
                    }
                ],
                onclick(e, $) {
                    var m = $("menu")
                    console.log("Doing")
                    if(!m) return;
                    m.classList.toggle("offscreen");
                    m.classList.toggle("onscreen");

                    var ins = $("instructions")
                    if(!ins) return;
                    //ins.classList.toggle("hidden")
                }
            },
            {
                tag:"br"
            },
            {
                tag: "button",
                className: "mitzvahBtn yellow",
                
                children: [
                    {
                        className: "mitzvahBtnTxt",
                        textContent: "Instructions",
                        
                    },
                    {
                        className:"svgHolder",
                        innerHTML:/*html*/`
                            ${btnBubble}
                        `
                    }
                ],
                onclick(e, $) {
                    var ins = $("instructions");
                    
                    
                    $("menu").classList.add("offscreen");

                    $("menu").classList.remove("onscreen");
                    ins.classList.remove("hidden");
                }
            },
            {
                tag: "button",
                onclick() {
                    
                }
            }
            
        ]
    },
    {
        shaym: "music player",
        id:"myMusic",
        children: [
            {
                shaym: "audio base layer"
            },
            {
                shaym: "audio effects layer 1"
            },
            
            {
                shaym: "audio effects layer 2"
            },
            
            {
                shaym: "audio effects layer 3"
            },

            {
                shaym: "walking player"
            },
            {
                shaym: "ground hit player"
            },
            
            {
                shaym: "playerJump"
            }
        ]
    },
    instructions
    
 ];