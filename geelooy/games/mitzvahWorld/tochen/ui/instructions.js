/**
 * B"H
 * instructions to give
 */

export default {
    children: function(){ return [
        {
            innerHTML : ""
        },/*
        {
            innerText: "Hide",
            tag: "button",
            ready(d) {
                console.log("Hi", d,d.onclick)
            },
            onclick(e) {
                console.log("Hi!", e.target)
                if(!e.target.isHiding) {
                    var ins = g("instructions");
                    if(ins) {
                        ins.style.display = "none";
                        
                    }
                    e.target.isHiding = true;
                    e.target.innerHTML = "Show"
                } else {
                    var ins = g("instructions");
                    if(ins) {
                        ins.style.display = "";
                        
                    }
                    e.target.isHiding = false;
                    e.target.innerHTML = "Hide"
                }
            }
        },*/
        {
            shaym: "instructions",
            innerHTML: `
            WASD or arrow keys to move (no mobile as of yet).
        
            Q and E to stride side to side.
            
            Mouse + left click to move camera.
        
            Left + right click to move character via mouse.
        
            just right click hold to rotate character.
        
            F and R keys to pan camera up or down.
        
            C to toggle messages. Enter to select.
        
            T to switch between FPS and Third Person mode.
        
            
            `
        }
    ]},
    
    style: {
        left:26,
        top:26
    }
};