/**
 * B"H
 */

import borderShadow from "../../resources/borderShadow.js";

export default /*css*/`
    .shlichusAcceptBody {
        border-radius: 52px;
        border: 12px solid #4435B2;
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
        font-size: 24px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 0.96px;
        text-shadow: ${borderShadow}
    }

    .sa .shlichusName {
        color: #FFF;
        text-align: center;
        font-family: Fredoka One;
        font-size: 32px;
        font-style: normal;
        font-weight: 613;
        line-height: normal;
        letter-spacing: 1.2px;
        text-shadow: ${borderShadow}
    }
    .sa .mainTxt {
        align-self: stretch;
        color: #FFF;
        text-align: center;
        text-shadow: 0px 3.381986618041992px 0px #170F4F,
        ${borderShadow};
        font-family: Fredoka One;
        font-size: 40.584px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: 1.623px;
    }


    .shlichusProgress {
        color: #FFF;
        text-align: center;
        font-family: 'Fredoka';
        font-size: 18px;
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
    }

    .gap20 {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }
    

    .shlichusProgress .iconAndNum .icon {
        width: 29.829px;
        height: 29.135px;
    }

    .shlichusProgress .iconAndNum .num {
        color: #FECB39;

        font-family: Fredoka;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 0.72px;
    }


    .shlichusProgress .siProgress {
        display: flex;
        justify-content: left;
        gap: 10px;
        flex-shrink: 0;
        width: 300px;{
            shaym: "si frnt",
            className: "frnt"
        }
    }

    .shlichusProgress .siProgress .frnt {

        width:40%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        
        height:24px;
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
        
        height:24px;
        width:300px;
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
`;