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
    .borderWrap {
        position: relative;
        padding-top: 15.5px; /* Create space for top border */
        padding-bottom: 15.5px; /* Create space for bottom border */
    
    }
    
    .borderWrap::before,
    .borderWrap::after, 
    .mainTitle .lns .txt::before, 
    .mainTitle .lns .txt::after {
        content: attr(data-text);
        position: absolute;
        z-index: -1;
        font-family: Fredoka One;
        font-size: var(--base-font-size);
        font-weight: 700;
        letter-spacing: calc(var(--base-font-size) * 0.04);
        color: transparent;
        background-image: linear-gradient(180deg, #23144F 0%, #474FFF 100%);
        -webkit-background-clip: text;
        background-clip: text;
    }
    
   
    .borderWrap::before,
    .borderWrap::after {
        left: 0;   /* stretch across the full width of .txt */
        right: 0;  /* stretch across the full width of .txt */
        height: 15.5px; /* Set height of the border */
    
    }

    
    .mainTitle .lns .txt {
        font-family: Fredoka One;
        font-size: var(--base-font-size);
        font-weight: 700;
        letter-spacing: calc(var(--base-font-size) * 0.04);
        position: relative;
        z-index: 2;
    
    }
    
    .borderWrap::before {
        top: 0;
    }

    .borderWrap::after {
        bottom: 0;
    }

    
    .mainTitle .lns .txt::before {
        top: 0;
        left: -15.5px;
    }
    
    .mainTitle .lns .txt::after {
        top: 0;
        left: 15.5px;
    }
    
    
    
    .mainTitle .lns .txt:first-child {
        color: #FECB39;
    }
    
    .mainTitle .lns .txt:last-child {
        color: #FFF;
        width: calc(var(--base-font-size) * 2.73);
        height: calc(var(--base-font-size) * 1.21);
        flex-shrink: 0;
    }
    
    
    
    

`;