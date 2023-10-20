/**
 * B"H
 */

export default /*css*/`


    .menuBtn:hover {
        cursor: pointer
    }

    rect.btn {
        stroke:#fff;
        fill:#fff;
        fill-opacity:0;
        stroke-opacity:0;
      }

    .menuBtn {
        background:none;
    }
    .menuTop .titleTxt {
        color: #FFF;
        font-family: Fredoka One;
        font-size: 32px;
        font-style: normal;
        font-weight: 700;
        line-height: 32px;
        letter-spacing: 1.28px;
    }

    .menuTop .titleTxt .mtz {
        color: #FECB39;

        font-family: Fredoka One;
        font-size: 32px;
        font-style: normal;
        font-weight: 700;
        line-height: 32px; /* 100% */
        letter-spacing: 1.28px;
    }

    .menuTop {
        background: rgba(36, 21, 80, 0.50);
        backdrop-filter: blur(4px);
        display: flex;
        width: 100%;
        padding: 12px 40px;
        align-items: center;
        gap: 28px;
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

    

    .menu .info {
        z-index:44;
        position:absolute;
        top:50%;
        text-align: center;
        left:50%;
        transform: translate(-50%,-50%);
    }
    
`