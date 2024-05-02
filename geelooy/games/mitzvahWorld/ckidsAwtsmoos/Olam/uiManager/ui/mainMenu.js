/**
 * B"H
 * Main menu with Play button,
 * instructions, and other options maybe.
 * 
 * Accessed when first loaded. 
 */
import menu from "./menu.js";
import mitzvahBtn from "./resources/mitzvahBtn.js";
import loading from "./loading.js";



import uiGame from "./gameUI.js";
import customWorldScreen from "./customWorldScreen.js";
import errorScreen from "./errorScreen.js";
import musicLayers from "./musicLayers.js"
import config from "../../../../tochen/config/config.awtsmoos.js";
var gameUiHTML = {
    shaym: "gameID",
    className:"gameUi",
        children: [
        ...uiGame
    ]
}


export default [
   
    musicLayers,
    
    {
        tag: "link",
        rel:"stylesheet",
        //href:'/resources/fonts/Fredoka One.ttf'
        href:'https://fonts.googleapis.com/css?family=Fredoka One'
    },
    {
        
        tag: "link",
        rel:"stylesheet",
        href:'https://fonts.googleapis.com/css?family=Fredoka'
    
    },
    {
        /*
            the main menu that
            can be accessed before starting
        */
        shaym: "main menu",
        className: "menu",
        gameUiHTML,
        ready(me) {
            /**
             * Create rectnagles
             * randomly and have them
             * crawl up the screen
             */
            
            function createRectangle() {
                var rect = document.createElement('div');
                var size = Math.random() * (77 - 13) + 13; // Random value between 77 and 13 pixels.
                rect.style.width = `${size}px`;
                rect.style.height = `${size}px`;
                rect.style.opacity = Math.random().toString();
                rect.style.left = `${Math.random() * window.innerWidth}px`; // Random horizontal position.
                rect.classList.add('rectangle');
                me.appendChild(rect);
                animateRectangle(rect, size);
            }
            
            function animateRectangle(rect, size) {
                let rectBottom = window.innerHeight;
            
                function moveUp() {
                    rectBottom -= 2; // Adjust speed as needed.
                    rect.style.bottom = `${rectBottom}px`;
            
                    // If rectangle hasn't reached top, continue animation. Else, remove it.
                    if (rectBottom > -size) {
                        requestAnimationFrame(moveUp);
                    } else {
                        rect.remove();
                    }
                }
            
                moveUp();
            }
            var frames = 0;
            me.isGoing = true;
            // Periodically create rectangles. Adjust interval as needed.
            function makeRect() {
                if(!me.isGoing) return;
                frames++;
                if(frames %26 == 0) {
                    frames = 0;
                    createRectangle();
                }
                requestAnimationFrame(makeRect);
            }
            requestAnimationFrame(makeRect);
        },
        children: [
            {
                className: "info",
                children: [

                    {
                        className: "mainTitle",
                        child: {
                            className: "lns",
                            children: 
                                "Mitzvah World"
                                .split(" ")
                                .map(w=>(
                                    {
                                        className: "line",
                                        child: {
                                            
                                            className: "borderWrap",
                                            children: [
                                                {
                                                    className: "txt",
                                                    textContent:
                                                    w
                                                },
                                                /*
                                                {
                                                    className:
                                                    "glowTxt",
                                                    textContent: w,
                                                    attributes: {
                                                        "data-text":
                                                        w
                                                    }
                                                },*/
                                                {
                                                    className:"borderTxt",
                                                    textContent:w,
                                                    attributes: {
                                                        "data-text":
                                                        w
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                )
                            )
                        }
                        
                    },
                    mitzvahBtn({
                        text: "Play !",
                        async onclick(e) {
                            var ikar = e.target.af("ikar")
                            if(!ikar) throw "Can't find main. "
                                +" Make an element with shaym=\""
                                +"ikar\"";
                            
                            var par = ikar;
                            var dayuhOfOlam = await import(config.startingLevel);
							if(!(dayuhOfOlam && dayuhOfOlam.default)) {
								alert("Could not load the first level");
								return;
							}
							
							console.log("Loaded",window.s=dayuhOfOlam)
                            
                            
                            
                            par.dispatchEvent(
                                new CustomEvent("start", {
                                    detail: {
                                        worldDayuh: dayuhOfOlam
                                            .default,
                                        gameUiHTML
                                    }
                                })
                            );
                            
                            var ld = e.target.af("loading");


                            if(!ld) return;
                            ld.classList.remove("hidden");

                            var mm = e.target.af("main menu");
                            if(!mm) throw "No menu found";
                            
                            mm.classList.add("hidden")
                            mm.isGoing = false;
                        
                            
                        }
                    }),
                    /*
                    mitzvahBtn({
                        text: "Custom World",
                        onclick(e, $) {
                            var mm = $("main menu");
                            var cw = $("custom world");
                            if(!mm || !cw) {
                                alert("Can't find that page")
                                return;
                            }
                            mm.classList.add("hidden")
                            cw.classList.remove("hidden")
                        }
                    })*/
                    
                ]
                
            }
        ]
    },
    
    loading,
    customWorldScreen,
    errorScreen
]