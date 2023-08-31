/**
 * B"H
 * style js object for UI
 */

export default {
    tag: "style",
    innerHTML:/*css*/`
        .dialogue {
            width: 30%;
            height: auto;
            background: linear-gradient(120deg, rgba(127, 63, 152, 0.7),

             rgba(63, 127, 191, 0.8));
            border-radius: 15px;
            box-shadow: 0 10px 30px RGBA(0, 0, 0, 0.5),
             0 2px 10px rgba(0, 0, 0, 0.2);
            font-family: 'Arial', sans-serif;
            font-size: 18px;
            color: #ffffff;
            padding: 20px;
            animation: pulse 2s infinite;
            transition: all 0.3s ease-in-out;

            opacity: 0;
            visibility: hidden;
            transition: opacity 0.5s, visibility 0.5s;
            animation: contentDance 5s infinite;
        }

        .dialogue .npc {
            background: linear-gradient(120deg, rgba(227, 163, 252, 0.8),

             rgba(63, 227, 91, 0.7));
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
            text-shadow: 0px 0px 2px black;
        }
        .shlichusInfo.details.active {
            opacity: 1;
            visibility: visible;
        
        }
        
        @keyframes contentDance {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1);
            }
        }

        .selected {
            box-shadow: 0 10px 30px RGBA(0, 0, 0, 0.5),
             0 2px 10px rgba(0, 0, 0, 0.2) inset;
        }

        .dialogue .chossid > div:hover {
            transform: scale(1.05);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 3px 15px rgba(0, 0, 0, 0.25);
        }
        
        @keyframes pulse {
            0% {
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.2);
            }
            50% {
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.55), 0 3px 12px rgba(0, 0, 0, 0.22);
            }
            100% {
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.2);
            }
        }
    
    `
}