/**
 * B"H

 */

/**
 * import data for world
 */

import style from "../tochen/ui/style.js";
import instructions from "../tochen/ui/instructions.js";
import gameUI from "../tochen/ui/gameUI.js";

//import starting level
import dayuh from "../tochen/worlds/1.js"

import UI from "../../../scripts/awtsmoos/ui.js";
import OlamWorkerManager from "./ikarOyvedManager.js";
import mainMenu from "../tochen/ui/mainMenu.js";

console.log("B\"H");

var ui = new UI();
var h = ui.html({
    children: [
        
        style,
        ...mainMenu
    ]
});

h.addEventListener("start", e => {

  
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/oyvedEdom.js')
        .then((registration) => {
            console.log('Service Worker Registered', registration);
            startWorld(e)
        })
        .catch((error) => {
            console.log('Service Worker Registration Failed', error);
            startWorld(e)
        });
    } else {
        startWorld(e)
    }
})

document.body.appendChild(h)


//add canvas to page
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);


/**
 * start communication with worker
 * maanger.
 * 
 * First argument: the path 
 * to the worker itself.
 * 
 * Second, an object with 
 * "async pawsawch (open)" --" what to do when opened.
 * 
 * Then when it opens, it sends a message to the 
 * worker MANAGER (using postMessage),
 * which then, behind the scenes, sends 
 * a message to the worker itself.
 * 
 * In that postMessage, it has an object of the information.
 * 
 * Then, we pass in the canvas
 */
function startWorld() {
    console.log("Starting")
    var man = new OlamWorkerManager(
        "./ckidsAwtsmoos/oyved.js",
        {
            async pawsawch() {
                
                var ID = Date.now();
                man.postMessage({
                    heescheel: {
                        html: {
                            children: [
                                ...gameUI
                            ]
                        },
                        ...dayuh,
                        on: {
                            ready(m) {
                                m.htmlAction("loading",
                                    {
                                        
                                    },
                                    {
                                        classList: {
                                            add: "hidden"
                                        }
                                    }
                                )
                            }
                        }
                    }
                });
            }
        },
        canvas
    );
    window.socket = man;
    man.onerror = e => {
        
        window.aa = ui;
        ui
        .htmlAction({
            shaym: "loading",
            properties: {innerHTML: "There was an error. Check console, contact Coby."}
        })
        console.log("wow", e)
    }
}




