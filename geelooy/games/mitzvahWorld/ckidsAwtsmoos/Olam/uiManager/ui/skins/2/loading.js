/**
 * B"H
 */
export default /*css*/`
    .loading {
        z-index:99;
        color:white;
        
        margin:0;
        position:absolute;
        left:0;top:0;
        width:100%;
        
        padding:0;
        height:100%;
        background: linear-gradient(
            180deg, 
            #23144F 0%, 
            #474FFF 100%
        );
       
        
    }

    .loading .loadingContent {
        
        
        display:flex;
        flex-direction:column;
        align-items:center;
        height:100vh;
        justify-content:center;
    }

    .mainLoadingArea {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .secondaryLoadingArea {
        width: 75%;
        max-height: 200px;
        flex-grow: 1;
    }



    .loading .barLoading .bck {
       
        width: 300px;
        height: 32px;
        
        border-radius: 50px;
        background: #FFF;
        box-shadow: 0px 8px 0px 6px 
            rgba(0, 0, 0, 0.10), 0px 0px 0px 8px #FECB39;

    }

    .loading .barLoading .barMitzvah {
   
        width: 5%;
        height: 32px;
        
        margin-top: -2px;
        gap: 10px;
        flex-shrink: 0;
        position:relative;
        border-radius: 50px;
        border-bottom: 6px solid #241550;

        background: linear-gradient(
            90deg, #7501D0 4.34%, #D601C1 97.19%
        )
    }

    .loading .barMitzvah .dtls {
        position:absolute;
    }

    .loading .txtLoad {
        color: #FFF;
        font-family: Fredoka One;
        font-size: 28px;
        hyphens: auto;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }

    .loading .txtLoad.secondary {
        font-size:18px;
    }
    


`