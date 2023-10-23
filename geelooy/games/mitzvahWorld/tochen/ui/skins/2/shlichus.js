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
`;