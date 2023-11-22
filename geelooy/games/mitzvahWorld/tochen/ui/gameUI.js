/**
 * B"H
 * UI components that involve the in game experience
 */
import shlichusUI from "./shlichusUI.js";
import joystick  from "./joystick.js";
var ui = [
    {
        shaym: "menuTop",
        className:"menuTop",
        children: [
            {
                shaym: "menu button",
                className: "menuBtn",
                innerHTML: /*html*/`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M4 16H28" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 8H28" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 24H28" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <rect class="menuBtnRect" x="0" y="0" width="100%" height="100%" />
                </svg>
                `,
                ready(me,$) {
                    var rd = me.getElementsByClassName("btn")[0];
                    if(!rd) return;
                    rd.onclick = me.onclick;
                },
                onclick(e, $) {

                    console.log("GI",$,231123)
                    var m = $("menu")
                    console.log("Doing")
                    if(!m) return;
                    m.classList.remove("hidden");
        
                    var ins = $("instructions")
                    if(!ins) return;
                    ins.classList.add("hidden")
                }
            },
            {
                shaym:"title text holder",
                className: "titleTxt",
                children: [
                    {
                        tag:"span",
                        textContent: "Mitzvah",
                        className: "mtz"
                    },
                    {
                        tag: "span",
                        textContent: "World"
                    }
                ]
            }
        ],
        style: {
            top:0
        },
    },
    
    {
        shaym: "msg npc",
        style: {
            bottom: 20,
            right:315
        },
        className: "dialogue npc",
    },
    {
        shaym: "msg chossid",
        style: {
            bottom: 20,
            left:315
        },
        className: "dialogue chossid",
    },

    {
        shaym: "approach npc msg",
        className: "asApproachNpc hidden",
        
        awtsmoosOnChange: {
            textContent(e, me) {
                
                me.innerText = 
                "Press C to talk to "
                + e.data.textContent;

            }
        },
    },

    {
        shaym: "approach portal msg",
        className: "asApproachNpc hidden", 
        awtsmoosOnChange: {
            textContent(e, me) {
                
                me.innerText = 
                "Press C to travel to "
                + e.data.textContent;

            }
        },
    }
	

]
.concat(shlichusUI);

if(navigator.userAgent.includes("Mobile")) {
    ui = ui.concat(joystick);
    console.log("Doing mobile")
}

export default ui;