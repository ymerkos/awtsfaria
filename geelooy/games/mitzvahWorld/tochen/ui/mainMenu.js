/**
 * B"H
 * Main menu with Play button,
 * instructions, and other options maybe.
 * 
 * Accessed when first loaded. 
 */
import menu from "./menu.js";

import loading from "./loading.js";
export default [
   
    
    ...menu,
    {
        tag: "link",
        rel:"stylesheet",
        href:'https://fonts.googleapis.com/css?family=Fredoka One'
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
                                className: "playBtnTxt",
                                textContent: "Play",
                                
                            },
                            {
                                className:"svgHolder",
                                innerHTML:/*html*/`
                                <svg xmlns="http://www.w3.org/2000/svg" width="109" height="53" viewBox="0 0 109 53" fill="none">
                                <ellipse cx="88.2745" cy="3.76" rx="9.95713" ry="6.40101" transform="rotate(15 88.2745 3.76)" fill="white" fill-opacity="0.25"/>
                                <ellipse cx="81.3523" cy="9.7462" rx="24.2835" ry="10.8732" transform="rotate(8.51399 81.3523 9.7462)" fill="white" fill-opacity="0.15"/>
                                <path d="M111.027 26.0962C108.803 40.9547 83.2434 49.4436 53.9383 45.0566C24.6332 40.6696 2.67987 25.068 4.90421 10.2095C8.15413 -11.5 42 -4.00001 74 -4.00001C103.305 0.386981 113.252 11.2376 111.027 26.0962Z" fill="white" fill-opacity="0.15"/>
                                </svg>
                                `
                            }
                        ],
                        className: "playBtn",
                        onclick(e) {
                            var ikar = e.target.af("ikar")
                            if(!ikar) throw "Can't find main. "
                                +" Make an element with shaym=\""
                                +"ikar\"";
                            
                            var par = ikar
                            par.dispatchEvent(
                                new CustomEvent("start")
                            );
                            console.log(par)
                            console.log(e.target, e)
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