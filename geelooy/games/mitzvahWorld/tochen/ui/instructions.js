/**
 * B"H
 * instructions to give
 */

export default {
    shaym: "instructions",
    className: "hidden instructions menuItm",
    children:  [
        {
            innerHTML : ""
        },
        
        {
            innerText: "Back",
            tag: "button",
            className: "backBtn menuBtn",
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
            WASD or arrow keys to move (no mobile as of yet).
        
            Q and E to stride side to side.
            
            Mouse + left click to move camera.
        
            Left + right click to move character via mouse.
        
            just right click hold to rotate character.
        
            F and R keys to pan camera up or down.
        
            C to toggle messages. Enter to select.
        
            T to switch between FPS and Third Person mode.
        
            
            `,
            /*style: {
                left:26,
                top:26
            }*/
        },
        
    ],
    
   
};