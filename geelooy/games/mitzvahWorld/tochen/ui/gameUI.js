/**
 * B"H
 * UI components that involve the in game experience
 */

export default [
    {
        shaym: "menu button",
        className: "menuBtn",
        innerHTML: "Menu",
        tag: "button",
        style: {
           top:0
        },
        onclick(e) {
            var m = e.target.awtsmoosFind("menu")
            if(!m) return;
            m.classList.remove("hidden");

            var ins = e.target.awtsmoosFind("instructions")
            if(!ins) return;
            ins.classList.add("hidden")
        }
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