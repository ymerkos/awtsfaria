/**
 * B"H
 * The laoding screen to 
 * display while the game components
 * are loading.
 */

export default {
    shaym: "loading",
    className: "loading hidden",
    children: [
        {
            shaym:"loadingContent",
            className:"loadingContent",
            children:[
                {
                    shaym: "main loading area",
                    className: "mainLoadingArea",
                    children: [
                        {
                        
                            className:"barLoading",
                            children: [
                                {
                                    shaym:"bar background",
                                    className: "bck",
                                    child: {
                                        shaym: "loading bar",
                                        className: "barMitzvah",
                                        child: {
                                            shaym: "svgHolder",
                                            className: "svgHolderLoad",
                                            innerHTML: /*html*/`
                                            <svg xmlns="http://www.w3.org/2000/svg"  >
                                                <ellipse cx="3.29199" cy="3.5693" rx="3.29199" ry="3.5693" transform="matrix(0.894366 0.447337 -0.142088 0.989854 24.4194 -2.85715)" fill="white" fill-opacity="0.25"/>
                                                <ellipse cx="7.63345" cy="6.16451" rx="7.63345" ry="6.16451" transform="matrix(0.963104 0.269131 -0.0799401 0.9968 17.8784 -2.62991)" fill="white" fill-opacity="0.15"/>
                                                <path d="M33.8217 14.9121C33.1408 23.4027 25.3164 28.2535 16.3455 25.7467C7.3745 23.2398 0.6541 14.3246 1.33502 5.83399C2.32989 -6.57142 12.6909 -2.28571 22.4868 -2.28571C31.4577 0.221141 34.5026 6.4215 33.8217 14.9121Z" fill="white" fill-opacity="0.15"/>
                                            </svg>
                                            `
                                        }
                                    }
                                },
                                
                            ]
                        },
                        {
                            tag:"h2",
                            className:"txtLoad",
                            innerHTML: "Loading..."
                        },
                    ],
                },
                
                {
                    className: "secondaryLoadingArea",
                    children: [
                        {
                            tag:"h3",
                            className: "txtLoad info",
                            innerHTML:"Getting ready to load...",
                            shaym: "action loading"
                        },
                        {
                            tag:"h4",
                            className: "txtLoad info secondary",
                            innerHTML:"",
                            shaym: "sub action loading"
                        },
                    ]
                }
                
            
            ],
            
        }
    ]
}