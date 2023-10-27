/**B"H
 * CSS for dialogue boxes
 */

import borderShadow from "../../resources/borderShadow.js";


export default /*css*/`
    :root {
        --shadowWidth: 1.6px;
    }

    
    .dialogue {
        display: flex;
        max-width: 770px;
        flex-direction: column;
     
        justify-content: center;
        align-items: left;
       
        border-radius: 12px;
        background: rgba(36, 21, 80, 0.50);
        backdrop-filter: blur(4px);

        /*styles for the
        text of each dialogue*/

        
        color: #FFF;
       
        font-family: Fredoka One;
        font-size: 36px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 0.72px;

        opacity: 0;
        visibility: hidden;
        transition: opacity 0.5s, visibility 0.5s;


        text-shadow: ${borderShadow};
            

    }

    .dialogue.npc {
        padding: 16px 12px;
    }

    .dialogue.chossid > div{
        padding: 16px 12px;

    }
    /*For a selected piece
    of text within a dialogue
    box*/
    .selected {
       
        box-shadow: 3px 3px 0px rgba(
            254, 203, 57, 0.80
        ) inset, 
        -3px -3px 0px rgba(
            254, 203, 57, 0.80
        ) inset, 
        0 0 0 2px #FECB39;
        text-shadow: ${
            borderShadow
        },
        0px 0px 6px rgba(254, 203, 57, 0.80);
       
    }

    .selected:first-child {
        border-radius: 12px 12px 0px 0px;
    }

    .selected:last-child {
        border-radius: 0px 0px 12px 12px;
    }
`;