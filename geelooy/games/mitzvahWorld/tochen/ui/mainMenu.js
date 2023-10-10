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
        children: [
            {
                className: "info",
                children: [

                    {
                        className: "mainTitle",
                        ready(me,f,ui){
                            ui.html({
                                parent: me,
                                className: "lns",
                                children: 
                                    "Mitzvah World"
                                    .split(" ")
                                    .map(w=>({
                                        children: 
                                            w.split("")
                                            .map(r=>({
                                                tag:"span",
                                                textContent:
                                                r,
                                                attributes: {
                                                    "data-text":
                                                    r
                                                }
                                            }))
                                    }))
                                
                            })
                        }
                    },
                    {
                        tag: "button",
                        innerHTML: "Play",
                        onclick(e) {
                            var par = e.target.parentNode.parentNode.parentNode
                            par.dispatchEvent(
                                new CustomEvent("start")
                            );
                            var ld = e.target.af("loading");


                            if(!ld) return;
                            ld.classList.remove("hidden");

                            var mm = e.target.af("main menu");
                            if(!mm) return;
                            mm.classList.add("hidden")
                        }
                    }
                ]
                
            }
        ]
    },
    
    loading
]