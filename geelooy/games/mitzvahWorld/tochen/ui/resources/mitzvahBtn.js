/**
 * B"H
 * "Mitzvah Btn",
 * meaning fancy looking 
 * extruded button template
 */

import btnBubble from "./btnBubble.js";
export default (opts={})=>({
    ...(
        opts
    ),
    tag: "button",
    className: opts.className||""+
    " mitzvahBtn",

    children: [
        {
            className: "mitzvahBtnTxt",
            textContent: opts.text,
            
        },
        {
            className:"svgHolder",
            innerHTML:/*html*/`
                ${btnBubble}
            `
        }
    ],
});