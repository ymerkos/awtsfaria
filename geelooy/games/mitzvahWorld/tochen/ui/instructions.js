/**
 * B"H
 * instructions to give
 */
import btnBubble from "./resources/btnBubble.js";
export default {
    shaym: "instructions",
    awtsmoosClick: true,
    className: "hidden instructions menuItm",
    children:  [
        {
            innerHTML : ""
        },
        
        {
            
            tag: "button",
            className: "backBtn mitzvahBtn",
        
            children: [
                {
                    className: "mitzvahBtnTxt",
                    textContent: "Back",
                    
                },
                {
                    className:"svgHolder",
                    innerHTML:/*html*/`
                        ${btnBubble}
                    `
                }
            ],
            ready(d, f) {
                
            },
            onclick(e) {
                var menu = e.target.af("menu")
                if(menu) {
                    e.target.awtsmoosMenu = menu;
                }

                var ins = e.target.af("instructions");
                e.target.awtsmoosInstructions = ins;

                var m = e.target.awtsmoosMenu;
                
                var ins = e.target.awtsmoosInstructions;
                if(!m || !m) {
                    e.target.innerHTML = "Nothing to go back to!"
                    e.target.disabled = true;
                    return;
                }


                ins.classList.add("hidden");
                m.classList.remove("hidden");
                
            }
        },
        {
            tag:"p",
            innerText: `
            WASD or arrow keys to move.
        
            Q and E to stride side to side.
            
            Mouse + left click to move camera.
        
            Left + right click to move character via mouse.
        
            just right click hold to rotate character.
        

            


            Hold down SHIFT to run

            press Y to switch to front camera view.
            
            F and R keys to pan camera up or down.
        
            C to toggle messages. Enter to select.
        
            T to switch between FPS and Third Person mode.
        
            On mobile use joystick to go forwards, or to the side.
            `,
            /*style: {
                left:26,
                top:26
            }*/
        },
        
    ],
    
   
};