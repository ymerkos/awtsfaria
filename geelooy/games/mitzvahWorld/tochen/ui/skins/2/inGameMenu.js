/**
 * B"H
 */

export default /*css*/`

/**minimap */
    .map {
        fborder-radius: 50%;
        overflow: hidden;
        
        border: 2px solid black;
        z-index: 5;
    }

    .filled {
        position: absolute;
        width: 100%;
        height: 100%;
    }

	.allInclusiveParent {
		position:absolute;
		left:0;top:0;
		width:100%;height:100%;
		display:flex;
		justify-content:center;
		align-items:center;
        pointer-events:none;
	}
    
    .menu {
        color:white;
        background: linear-gradient(
            180deg, 
            #23144F 0%, 
            #474FFF 100%
        )
    }
    .menu button {
        z-index:4;
    }
    .menuBtn:hover {
        cursor: pointer
    }

    .menuBtnRect:hover {
        cursor:pointer;
    }
    .menuBtnRect {
        z-index:3;
        stroke:#fff;
        fill:#fff;
        fill-opacity:0;
        stroke-opacity:0;
      }


      .gameUi {
        width:100%;
        height:100%;
		
      }
    .menuBtn {
        background:none;
        margin-left: 20px;
    }
    .menuTop .titleTxt {
        color: #FFF;
        font-family: Fredoka One;
        font-size: 50px;
        font-style: normal;
        font-weight: 700;
        line-height: 32px;
        letter-spacing: 1.28px;
    }

    .menuTop .titleTxt .mtz {
        color: #FECB39;

        font-family: Fredoka One;
        font-size: 50px;
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