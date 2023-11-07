/**
 * B"H
 */

/**
 * start communication with worker
 * manger.
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
 * 
 * @requires the e object
 * to have detail: {
 *  worldDayuh: {
 *      world info
 *  },
 * gameUiHTML: {
 *      JS objects
 *  representing in game HTML
 *  }
 * }
 * 
 * and the @argument opts an
 * object containing an @optional error
 * event and a @optional canvas object
 * (canvas element) if not provided
 * will be generated automatically.
 */

import OlamWorkerManager from "./ikarOyvedManager.js";

import UI from "../../../scripts/awtsmoos/ui.js";
export default function startWorld(e, opts={}) {
    if(!e.detail.worldDayuh) {
        alert("No world data provided!");
        return false; //didn't load
    }
    var worldDayuh = e.detail.worldDayuh;
    var gameUiHTML = e.detail.gameUiHTML;
    if(!gameUiHTML) {
        alert("No world data provided!");
        return false; //didn't load
    }
    
    var ui = opts.ui || new UI();
    

    /*
        main parent
        div
    */
    var av = ui.html({
        shaym: "av",
        style: {
            position: "relative"
        },
        attributes: 
        {
            awts:2
        }
        
    })
    //add canvas to page
    var canvas = opts.canvas || ui.html({
        parent: av,
        tag: "canvas",
        shaym: "canvasEssence"
    })

    console.log("Starting")
    var man = new OlamWorkerManager(
        "./ckidsAwtsmoos/oyved.js",
        {
            async pawsawch() {
                
                var ID = Date.now();
                man.postMessage({
                    heescheel: {
                        html: gameUiHTML,
                        ...worldDayuh,
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
    man.onerror = opts.onerror;

    return true /*loading*/;
}
