/**
 * B"H
 * Style for gima found at 
 * https://www.figma.com/file/QZERI89t767tpWJ3cJmls4/Mitzvah-world?node-id=3%3A2&mode=dev
 * 
 * 
 * times for 10/9/2023:
 * 
 * 6:49pm to 7:03pm
 * 
 * 7:32pm to 9:24pm
 * 
 * 9:42pm to 10:03pm
 */

export default /*css*/`
:root {
    /* Define a base font-size. Change this to scale everything else. */
    --base-font-size: 147.839px;
    --stroke: 15.5px; /* Adjust this for border thickness */
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
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;

    display: flex;
    align-items: center;
    justify-content: center;
}

.info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 90%; /* Set a maximum width here */
}

.mainTitle .lns {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center; /* For multi-line title texts */
}

.borderWrap {
    position: relative;
    max-width: 100%; /* Contain the text within the maximum width */
  
}

.mainTitle .lns .txt {
    font-family: Fredoka One;
    font-size: var(--base-font-size);
    font-weight: 700;
    letter-spacing: calc(var(--base-font-size) * 0.04);
    position: relative;
    z-index: 2; /* Ensures .txt is over .borderTxt */
    padding: var(--stroke); /* This will push the text above the gradient stroke */
    -webkit-text-stroke-width: 0px;
}

.borderTxt {
    position: absolute;
    top: 0;
    left: 0;
    font-family: Fredoka One;
    font-size: var(--base-font-size);
    font-weight: 700;
    letter-spacing: calc(var(--base-font-size) * 0.04);
    padding: var(--stroke); /* Adjust to control stroke width */
    background: linear-gradient(180deg, #23144F 0%, #474FFF 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    z-index: 1; /* Keeps .borderTxt under .txt */
    -webkit-text-stroke-width: var(--stroke)
}

.mainTitle .lns .borderWrap:first-child .txt {
    color: #FECB39;
}

.mainTitle .lns .borderWrap:last-child .txt {
    color: #FFF;
    width: calc(var(--base-font-size) * 2.73);
    height: calc(var(--base-font-size) * 1.21);
    flex-shrink: 0;
}
    
    

`;