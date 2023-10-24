/**
 * B"H
 * UI components that involve the in game experience
 */
import mitzvahBtn from "./resources/mitzvahBtn.js";
import objective from "./resources/objective.js";


import coin from "../../tochen/ui/resources/coin.js";
export default [
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
                <rect class="btn" x="0" y="0" width="10" height="10" />
                </svg>
                `,
                
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
            left:25
        },
        className: "dialogue npc",
    },
    {
        shaym: "msg chossid",
        style: {
            bottom: 20,
            right:25
        },
        className: "dialogue chossid",
    },
    {
        shaym: "shlichus accept",
        className: "sa shlichusAcceptBody hidden",
        children: [
            {
                shaym: "sa image",
                className: "sa image",
                child: {
                    innerHTML: objective
                }
            },
            {
                shaym: "sa mainTxt",
                className: "mainTxt",
                textContent: "Awtsmoos"
            }, 
            {
                shaym: "sa shlichus name",
                className: "shlichusName",
                textContent: "Awtsmoos"
            },
            {
                shaym: "sa details",
                className: "details",
                textContent: "Awtsmoos! ".repeat(4)
            },
            {
                shaym: "sa start btn",
                child: mitzvahBtn({
                    text: "Start",
                    onclick(e, $) {
                        $("shlichus accept")
                        .classList.add("hidden")
                    }
                })
            }
        ]
    },
    {
        /**
         * general container for
         * keeping track of individual
         * shlichus 
         */
        shaym: "shlichus progress info",
        
        className: "shlichusProgress",
        children: [
            {
                shaym: "shlichus title",
                textContent: "Redfemptionasd"
            },
            {
                shaym: "shlichus description",
                textContent: "aduiha8o2A  a2dh89a2d 89a2d d"
            },
            {
                shaym: "shlichus info",
                className: "shlichusProgressInfo",
                children: [
                    {
                        shaym:"si progress bar",
                        className:"siProgress",
                        children: [
                            {

                                /**
                                 * background of the
                                 * progress bar
                                 * 
                                 * "si" = 
                                 * shlichus info
                                 */
                                shaym: "si bck",
                                className: "bck",
                                child: {
                                    shaym: "si frnt",
                                    className: "frnt"
                                }
                            }
                            
                        ]
                    },
                    {
                        className: "gap20"
                    },
                    {
                        /**
                         * icon representing item
                         * to collect
                         * (or person to talk to iy"h) 
                         * and 
                         * number of collected items
                         * (if applicable)
                         */
                        shaym: "icon and num",
                        className: "iconAndNum",
                        
                        children: [
                            {
                                shaym: "si icon",
                                className:"icon",
                                innerHTML: coin
                            },
                            {
                                className: "gap20"
                            },
                            {
                                shaym: "num",
                                className:"num",
                                textContent: "1/5"
                            }
                        ]
                        
                    }
                ]
            }
        ],
    }
];