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

import UI from "./chayim/ui.js";
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

h.addEventListener("start", startWorld)

document.body.appendChild(h)

console.log("h",window.ui = ui, window.g=h)

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
                                instructions,
                                ...gameUI
                            ]
                        },
                        ...dayuh,
                        on: {
                            ready(m) {
                                console.log("Loaded",m)
                                m.htmlAction("menu",
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
}




