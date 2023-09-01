/**
 * B"H
 * Main menu with Play button,
 * instructions, and other options maybe.
 * 
 * Accessed when first loaded. 
 */

export default [
    {
    shaym: "BH",
    innerHTML: "B\"H",
        className: "BH"
    },
    {
        shaym: "menu",
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
                            console.log("hi",window.aa=e.target,window.par=par)
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