/**
 * B"H
 * Main menu with Play button,
 * instructions, and other options maybe.
 * 
 * Accessed when first loaded. 
 */
import menu from "./menu.js";
export default [
   
    
    ...menu,
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
                        tag: "h1",
                        innerHTML: "Mitzvah World",
                        ready(){
                            console.log(4)
                        }
                    },
                    {
                        tag: "button",
                        innerHTML: "Play",
                        onclick(e) {
                            var par = e.target.parentNode.parentNode.parentNode
                            par.dispatchEvent(
                                new CustomEvent("start")
                            )
                        }
                    }
                ]
                
            }
        ]
    }
]