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
        letter-spacing: calc(var(--base-font-size) * 0.04);
        position: relative;
        z-index: 2;
    }
    .mainTitle .lns div span {
        position: relative;
        z-index: 2;
    }

    .mainTitle .lns div span::before {
        content: attr(data-text); 
        position: absolute;
        top: -15.5px;
        bottom: -15.5px;
        left: -15.5px;
        right: -15.5px;
        z-index: -1;
        background-image: linear-gradient(180deg, #23144F 0%, #474FFF 100%);
        color: transparent; 
        -webkit-background-clip: text;
        background-clip: text;
        font-family: Fredoka One;
        font-size: var(--base-font-size);
        font-weight: 700;
        letter-spacing: calc(var(--base-font-size) * 0.04);
        text-align: center; 
    }
    
    .mainTitle .lns div:first-child {
        color: #FECB39;
    }
    
    .mainTitle .lns div:last-child {
        color: #FFF;
        width: calc(var(--base-font-size) * 2.73);
        height: calc(var(--base-font-size) * 1.21);
        flex-shrink: 0;
    }
    
    
    
    

`;