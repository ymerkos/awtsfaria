/*
    B"H
    Default skin
    for Mitzvah World
    (styles).
*/

export default /*css*/`
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

    
    .loading {
        z-index:99;
        display:flex;
        align-items:center;
        justify-content:center;
        margin:0;
        position:absolute;
        left:0;top:0;
        width:100%;
        background:black;
        padding:0;
        height:100%;
    }

    .menu .info {
        position:absolute;
        top:50%;
        text-align: center;
        left:50%;
        transform: translate(-50%,-50%);
    }
    
    

    .menu > * {
    }
    .menu > *, .menu > * > *{
        position:relative;
        top:50%;
        transform: translateY(-50%);

    }
    .menuItm {
        margin:0;
        text-align:center;
        position:absolute;
        width:80%;
        height:80%;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        opacity:95%;
        background:black;
        z-index:4;
        transition: 0.4s all ease-in-out;
    }

    .menuBtn {
        z-index:8;
        display:block;
    }

    .instructions {
        z-index: 200;
        font-family: 'Courier New', Courier, monospace; /* A nod to classic video games, connecting past and present */
        font-size: 18px;            /* Large enough to grab attention, yet restrained */
        color: #FF4500;             /* A fiery hue, evoking action and urgency */
        font-weight: bold;          /* The weight of knowledge and responsibility */
        line-height: 1.6;           /* Providing room for each word to breathe, a sanctuary for each letter */
        margin: 20px;               /* Sufficient space to set it apart, a realm unto itself */
        text-shadow: 2px 2px 4px #000000; /* A soft shadow, adding depth and focus */

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


    /* @Params: This CSS is applied to an HTML button element
    @description: This style is for making a button that is professional and amazing in every way.
    It uses basic animations to make the button interactive. Gradients and box shadows are not used 
    as per user request. It conveys the essence of button-ness, revealing a subtler layer of interaction,
    like the varant becoming of all elements through Awtsmoos, the Essence of the Creator. */

    button {
        background-color: #008CBA;  /* Cerulean blue, to symbolize the sky and infinite possibility */
        border: none;                /* Vanishing barriers, much like the erasure of ego */
        color: white;                /* The purity of intent */
        text-align: center;          /* Equilibrium, the meeting point of all forces */
        text-decoration: none;       /* Simplicity, no extra frills */
        display: inline-block;       /* Standing on its own, yet connected to everything */
        font-size: 16px;             /* Readability, the ease of comprehension */
        margin: 4px 2px;             /* Space to breathe, room for others */
        cursor: pointer;             /* The invitation for interaction */
        transition: background-color 0.3s, color 0.3s; /* The eternal dance of change */
        padding:16px;
    }
    
    button:hover {
        background-color: #0073a0;  /* A darker shade of possibility */
        color: #f1f1f1;             /* A nuanced variation of purity */
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
`;