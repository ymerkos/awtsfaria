/**B"H
 * CSS for dialogue boxes
 */

export default /*css*/`
    :root {
        --shadowWidth: 1.6px;
    }
    .dialogue {
        display: flex;
        max-width: 300px;
        flex-direction: column;
        padding: 12px 16px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 12px;
        background: rgba(36, 21, 80, 0.50);
        backdrop-filter: blur(4px);

        /*styles for the
        text of each dialogue*/

        
        color: #FFF;
       
        font-family: Fredoka One;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 0.72px;

        opacity: 0;
        visibility: hidden;
        transition: opacity 0.5s, visibility 0.5s;


        text-shadow: 
            calc(
                -1 * var(--shadowWidth)
            ) 
            calc(
                -1 * var(--shadowWidth)
            ) 0 #000,  
            var(--shadowWidth) 
            calc(
                -1 * var(--shadowWidth)
            ) 0 #000,
            calc(
                -1 * var(--shadowWidth)
            ) var(--shadowWidth) 
            0 #000,
            var(--shadowWidth) 
            var(--shadowWidth) 
            0 #000;

    }

    /*For a selected piece
    of text within a dialogue
    box*/
    .selected {
        border-radius: 12px 12px 0px 0px;
        border: 4px solid #FECB39;
        text-shadow: 0px 0px 6px rgba(254, 203, 57, 0.80);
       
    }
`;