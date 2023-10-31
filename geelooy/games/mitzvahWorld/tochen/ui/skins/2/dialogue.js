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



    /*
        box that happens when u 
        appraoch it
    */

    .asApproachNpc {
        bottom: 50px;
        left: 50px;
        font-size: 4.5em;
        font-weight: bold;
        color:black;
        text-align: center;
        animation: glow 1.5s infinite alternate, pulse 2s infinite;
        position: absolute;
        text-align:left;
        transform: translate(-50%, -50%);
        z-index: 1000; /* Ensuring it stays above the game elements */
    }

    @keyframes glow {
        0% {
          text-shadow: 0 0 5px #fff, 
          0 0 10px #fff, 0 0 15px #ff00ff, 
          0 0 20px #ff00ff, 0 0 25px #ff00ff, 
          0 0 30px #ff00ff, 0 0 35px #ff00ff;
        }
        100% {
          text-shadow: 0 0 10px #fff, 
          0 0 20px #fff, 0 0 30px #ff00ff,
           0 0 40px #ff00ff, 0 0 50px #ff00ff, 
           0 0 60px #ff00ff, 0 0 70px #ff00ff;
        }
      }
      
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
`;