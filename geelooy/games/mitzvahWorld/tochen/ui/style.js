/**
 * B"H
 * style js object for UI
 */
import skin from "./skins/2/index.js";
export default {
    tag: "style",
    innerHTML:/*css*/`
        
        ${
            skin
        }
        
        .BH {
            z-index:100;
            pointer-events:none;
            position:absolute;
            left:4;
            top:4;
            font-size:5;
            font-family: Fredoka One; /* Timeless, much like the Awtsmoos */
                     /* Substantial, yet not overwhelming */
            color: #4CAF50;             /* The color of life and vitality */
            font-weight: bold;          /* A testament to its gravitas */
            
        }
        

        .hidden {
            visibility:none;
            opacity:0;
            z-index:-100 !important;
        }
        
        .active {
            opacity: 1;
            visibility: visible;
            transition: all 0.4s ease-in-out;
        }

        
        
        /* The plot twist: In its interaction, the button reveals more of its nature, not unlike how the Awtsmoos is revealed in every facet of reality. */
    
    `
}