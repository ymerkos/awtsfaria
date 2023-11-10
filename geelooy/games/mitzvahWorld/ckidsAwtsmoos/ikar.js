/**
 * B"H

 */

/**
 * import data for world
 */

import style from "../tochen/ui/style.js";

import gameUI from "../tochen/ui/gameUI.js";

//import starting level
import dayuh from "../tochen/worlds/1.js"

import UI from "../../../scripts/awtsmoos/ui.js";
import mainMenu from "../tochen/ui/mainMenu.js";
import ManagerOfAllWorlds from "./worldStarter.js";

console.log("B\"H");



var ui = new UI();
var h = ui.html({
    shaym: "ikar",
    children: [
        
        style,
        ...mainMenu
    ]
});

var m = new ManagerOfAllWorlds({
    ui
});
window.mana =  m;

h.addEventListener("start", async e => {
    
    
    if ('serviceWorker' in navigator) {
        try {
            var registration =
                await navigator.serviceWorker.register('/oyvedEdom.js');
            console.log('Service Worker Registered', registration);
            
        } catch(e) {
            console.log('Service Worker Registration Failed', e);
        }
        console.log("Loading it now !!!",e)
        m.initializeForFirstTime(e, {
            onerror(e) {
               
        
                window.aa = ui;
                ui
                .htmlAction({
                    shaym: "loading",
                    properties: {
                        innerHTML: "There was an error. Check console, contact Coby."
                    }
                })
                console.log("wow", e)
        
            }
        })
    } else {
        m.initializeForFirstTime(e)
    }
})

document.body.appendChild(h)











