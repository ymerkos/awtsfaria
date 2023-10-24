/**
 * B"H
 * Main menu with Play button,
 * instructions, and other options maybe.
 * 
 * Accessed when first loaded. 
 */
import menu from "./menu.js";

import loading from "./loading.js";
import btnBubble from "./resources/btnBubble.js"
export default [
   
    
    ...menu,
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
        ready(me) {
            /**
             * Create rectnagles
             * randomly and have them
             * crawl up the screen
             */
        
            function createRectangle() {
                const rect = document.createElement('div');
                const size = Math.random() * (77 - 13) + 13; // Random value between 77 and 13 pixels.
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
            
            // Periodically create rectangles. Adjust interval as needed.
            me.rects = setInterval(createRectangle, 500);
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
                    {
                        tag: "button",
                        children: [
                            {
                                className: "mitzvahBtnTxt",
                                textContent: "Play",
                                
                            },
                            {
                                className:"svgHolder",
                                innerHTML:/*html*/`
                                    ${btnBubble}
                                `
                            }
                        ],
                        className: "mitzvahBtn",
                        onclick(e) {
                            var ikar = e.target.af("ikar")
                            if(!ikar) throw "Can't find main. "
                                +" Make an element with shaym=\""
                                +"ikar\"";
                            
                            var par = ikar
                            par.dispatchEvent(
                                new CustomEvent("start")
                            );
                            
                            var ld = e.target.af("loading");


                            if(!ld) return;
                            ld.classList.remove("hidden");

                            var mm = e.target.af("main menu");
                            if(!mm) throw "No menu found";
                            if(mm.rects) {
                                try {
                                    clearInterval(mm.rects)
                                } catch(e){
                                    console.log("Hi!",e)
                                }
                            }
                            mm.classList.add("hidden")
                        }
                    }
                ]
                
            }
        ]
    },
    
    loading
]