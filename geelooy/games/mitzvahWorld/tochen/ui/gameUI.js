/**
 * B"H
 * UI components that involve the in game experience
 */

export default [
    
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
            top: 200
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