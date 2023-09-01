/*
B"H
        the in game menu
        that can be accessed in game.
    */
import instructions from "./instructions.js";
export default [
    {
        shaym: "menu",
        className: "menu hidden menuItm",
        children: [
            
            {
                innerText: "Back",
                tag: "button",
                className: "backBtn ",
                onclick(e) {
                    e.target.parentNode.classList.add("hidden");
                }
            },
            {
                tag: "button",
                className: "",
                innerHTML: "Instructions",
                ready(me, f) {
                   
                },
                onclick(e) {
                    var ins = e.target.af("instructions");
                    
                    
                    e.target.parentNode.classList.add("hidden");
                    ins.classList.remove("hidden");
                }
            },
            
        ]
    },
    instructions
    
 ];