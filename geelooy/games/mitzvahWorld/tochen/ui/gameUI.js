/**
 * B"H
 * UI components that involve the in game experience
 */

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
                
                onclick(e) {
                    console.log("GI")
                    var m = e.target.awtsmoosFind("menu")
                    console.log("Doing")
                    if(!m) return;
                    m.classList.remove("hidden");
        
                    var ins = e.target.awtsmoosFind("instructions")
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
        shaym: "shlichus progress info",
        style: {
            right: 25,
            top: 100
        },
        children: [
            {
                shaym: "shlichus title"
            },
            {
                shaym: "shlichus info"
            }
        ],
        className: "shlichusInfo details"
    }
];