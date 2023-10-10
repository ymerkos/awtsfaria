/**
 * B"H
 * Style for gima found at 
 * https://www.figma.com/file/QZERI89t767tpWJ3cJmls4/Mitzvah-world?node-id=3%3A2&mode=dev
 */

export default /*css*/`
    :root {
        /* Define a base font-size. Change this to scale everything else. */
        --base-font-size: 147.839px;
    }

    .menu {
        background: var(
            --Gradiente-azul, 
            linear-gradient(
                180deg, 
                #23144F 0%, 
                #474FFF 100%
            )
        );
        width:100%;
        height:100%;
        position:absolute;
        left:0;
        top:0;

        display:flex;
        align-items:center;
        justify-content:center;
    }

    .info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .mainTitle .lns {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center; /* For multi-line title texts */
    }

    .mainTitle .lns div {
        font-family: Fredoka One;
        font-size: var(--base-font-size);
        font-weight: 700;
        letter-spacing: calc(var(--base-font-size) * 0.04); /* ratio derived from 5.914/147.839 */


        padding: 15.5px;  /* This creates space for our gradient 'border' */
        background-image: linear-gradient(180deg, #23144F 0%, #474FFF 100%);
        background-clip: border-box; /* This makes sure the gradient covers the padding area */
        box-decoration-break: clone; /* Ensures the border remains consistent in inline elements or wrapped text */
    
        /* To avoid the actual text sitting directly on top of our gradient 'border', we can use a solid color background behind the text. */
        -webkit-text-fill-color: transparent; /* Make text transparent to see the background */
        -webkit-background-clip: text; /* Clip background to text */
    }
    
    .mainTitle .lns div:first-child {
        color: #FECB39;
    }
    
    .mainTitle .lns div:last-child {
        color: #FFF;
        width: calc(var(--base-font-size) * 2.73); /* ratio derived from 404/147.84 */
        height: calc(var(--base-font-size) * 1.21); /* ratio derived from 179.061/147.84 */
        flex-shrink: 0;
    }

`;