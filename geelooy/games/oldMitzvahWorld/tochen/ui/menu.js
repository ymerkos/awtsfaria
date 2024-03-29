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
        className: "menu hidden menuItm",
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
                    $("menu").classList.add("hidden");
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
                    
                    
                    $("menu").classList.add("hidden");
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