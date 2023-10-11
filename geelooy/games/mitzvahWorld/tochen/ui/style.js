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
            padding:16px;
            position:fixed;
            left:10px;
            top:10px;
            font-family: 'Times New Roman', Times, serif; /* Timeless, much like the Awtsmoos */
            font-size: 24px;            /* Substantial, yet not overwhelming */
            color: #4CAF50;             /* The color of life and vitality */
            font-weight: bold;          /* A testament to its gravitas */
            
        }
        

        .hidden {
            display:none;
            z-index:-100 !important;
        }
        
        .dialogue.active {
            opacity: 1;
            visibility: visible;
            transition: all 0.4s ease-in-out;
        }

        .shlichusInfo.details {
            opacity: 0;
            visibility: none;
        }

        .shlichusInfo {
            color: yellow;
            font-size:13px;
            font-weight: bold;
            
        }
        .shlichusInfo.details.active {
            opacity: 1;
            visibility: visible;
        
        }
        
        
        /* The plot twist: In its interaction, the button reveals more of its nature, not unlike how the Awtsmoos is revealed in every facet of reality. */
    
    `
}