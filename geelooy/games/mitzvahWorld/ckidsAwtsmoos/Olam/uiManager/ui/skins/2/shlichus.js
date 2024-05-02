/**
 * B"H
 */

import borderShadow from "../../resources/borderShadow.js";
var progressItemSize = 36;
var progressBarWidth = 300;
var ribbonWidth = 147;
var ribbonHeight = 107;
var maxProgressDetailsSize = 400;

var congratsScreenWidth=532;
var CONGRATS_BORDER = 1.6;

/*cs = congrats screen*/
var csPaddingX = 52;
var csPaddingY = 32;
export default /*css*/`
    .shlichusAcceptBody {
        border-radius: 52px;
        /*inset border*/
        box-shadow: inset 0 0 0 12px #4435B2;
        background: #2B2175;

        display: flex;
        
        
        padding: 52px 32px;
        flex-direction: column;
        align-items: center;
        gap: 40px;
        flex-shrink: 0;
    }

    .sa .details {
        color: #FFF;
        text-align: center;
        font-family: Fredoka One;
        font-size: 36px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 0.96px;
        max-width:770px;
        text-shadow: ${borderShadow(CONGRATS_BORDER)}
    }

    .sa .shlichusName {
        color: #FFF;
        text-align: center;
        font-family: Fredoka;
        font-size: 45px;
        font-style: normal;
        font-weight: 613;
        line-height: normal;
        letter-spacing: 1.2px;
        text-shadow: ${borderShadow(CONGRATS_BORDER)}
    }
    .sa .mainTxt {
        align-self: stretch;
        color: #FFF;
        text-align: center;
        text-shadow: 0px 3.381986618041992px 0px #170F4F,
        ${borderShadow(CONGRATS_BORDER)};
        font-family: Fredoka;
        font-size: 48px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: 1.623px;
    }

    .shlichusTitleProgress {

    }

    .shlichusDescriptionProgress {
        max-width: ${maxProgressDetailsSize}px;
    }

    .shlichusSidebar::-webkit-scrollbar {
        display:none;
    }

    .shlichusSidebar {
        left: 5px;
        display: flex;
        top: 60px;
        flex-direction: column;
        height: 600px;
        /*border: 1px solid black;*/
        border-radius: 5%;
        overflow-y: scroll;
        padding: 4px;
    }
    .shlichusProgress:hover {
        cursor:pointer
    }

    .shlichusProgress .selected {
        background: rgba(200, 211, 180, 0.50);
        color:#000;
    }

    .infoIcon {
        width:60px;
    }

    .shlichusProgress {
        color: #FFF;
        text-align: center;
        font-family: 'Fredoka';
        font-size: 32px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 0.72px;
        border-radius: 12px;
        background: rgba(36, 21, 80, 0.50);

        display: inline-flex;
        padding: 12px 16px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 12px;


        backdrop-filter: blur(4px);

        /* position: absolute; */
    }

    .gap20 {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }
    
    .shlichusProgress .iconAndNum {
        display:flex;
        justify-content:left;
        gap:20px;
    }

    .shlichusProgress .iconAndNum .icon {
        width: ${progressItemSize}px;
    }

    .shlichusProgress .iconAndNum .num {
        color: #FECB39;

        font-family: Fredoka;
        font-size: ${progressItemSize}px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 0.72px;
    }

    .shlichusProgress .shlichusProgressInfo {
        display: flex;
        justify-content: left;
        gap:20px;
    }   

    .shlichusProgress .siProgress {
        display: flex;
        justify-content: left;
        gap: 10px;
        flex-shrink: 0;
        width: ${
            progressBarWidth    
        }px;
    }



    .shlichusProgress .siProgress .frnt {

        width:40%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        
        height:${progressItemSize}px;
        position:absolute;
        border-radius: 50px;
        background: linear-gradient(
            270deg, 
            #FFEE37 30%, 
            #F78A3B 100%
        );
    }


    .shlichusProgress .siProgress .bck {
        

        position:absolute;
        
        height:${progressItemSize}px;
        width:${
            progressBarWidth    
        }px;
        display: flex;
        justify-content: left;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;

        border-radius: 50px;
        background: #241550;
        box-shadow: 0px 2px 0px 2px rgba(
            0, 0, 0, 0.10
        ), 0px 0px 0px 2px #FFF;

    }



    /**
     * congrats screen
     */

    .alertScreen {
        position: relative;
    }
    .alertScreen, .csDialogueContainer {
        display: flex;
        width: ${
            congratsScreenWidth   
        }px;
        padding: ${
            csPaddingY
        }px ${
            csPaddingX
        }px;
        flex-direction: column;
        align-items: center;
        gap: 40px;
        border-radius: 52px;
        box-shadow: inset 0 0 0 12px #4435B2;

        background: #2B2175;
    }

    .csDialogueContainer {

        border:none;
    }

    .csIllustration {
        position:relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top:52px;
        align-self: stretch;
    }


    .lightRays {
        
        width: 355px;
        height: 172px;
        transform: rotate(2.695deg);
        position: absolute;
     
        top: -44px;
    }
    
    .coinPile {
        width: 140px;
        height: 140px;
        z-index:5;
    }


    .csRibbonRight svg {
        width: 100%;
    }

    .csRibbonLeft svg {
        width: 100%;
    }
    .csRibbonRight {
        width: ${ribbonWidth}px;
        height: ${
            ribbonHeight
        }px;
        transform: rotate(10.297deg);
        flex-shrink: 0;
        fill: #9E018F;
        position:absolute;
        left: ${
            (congratsScreenWidth
            
            )
            +ribbonWidth * 1/4
        }px;
        top: ${
            ribbonHeight/2
        }px;
        z-index:-1;

    }

    .csRibbonLeft {
        width: ${ribbonWidth}px;
        height:${
            ribbonHeight
        }px;
        transform: rotate(-10.297deg);
        flex-shrink: 0;
        fill: #9E018F;
        
        position:absolute;
        left:-${
            ribbonWidth/2
            
        }px;
        top: ${
            ribbonHeight/2
        }px;
        z-index:-1;
    }

    .csMidRib {
        position:absolute;
        width: ${
            congratsScreenWidth
            + csPaddingX * 2
        }px;
        height:${ribbonHeight};
    }

    .csMidRib svg {
        width:100%;
    }

    .csCongratsRibbon {
        width: ${
            congratsScreenWidth
            + csPaddingX * 2
        }px;
        height: 112px;
        flex-shrink: 0;
        fill: #CE01B9;
        position:relative;
        
    }

    .csAlertMessage {
        align-self: stretch;
        color: #FFF;
        text-align: center;
        font-family: Fredoka;
        font-size: 42px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 0.96px;
    }

    .csSuccessText {
        color: #FFF;
        fill:#FFF;
        text-align: center;
        text-shadow: 0px 3.381986618041992px 0px #5E0075, ${
            borderShadow(CONGRATS_BORDER)
        };
        font-family: Fredoka;
        font-size: 48px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: 1.623px;
    }

    .timer {
        display: flex;
        padding: 12px 16px;
        align-items: center;
        gap: 12px;
    }

    .alertScreen .btns {
        display: flex;
        padding: 8px;
        align-items: flex-start;
        gap: 32px;
    }
`;