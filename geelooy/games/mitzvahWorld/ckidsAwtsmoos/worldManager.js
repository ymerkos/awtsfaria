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

class ManagerOfAllWorlds {
	gameState = {};
    started = false;
    constructor({ui}) {
        this.ui = ui;
    }

    /*includes making new UI etc.*/
    initializeForFirstTime(e, opts={}) {
        if(!e.detail.worldDayuh) {
            alert("No world data provided!");
            return false; //didn't load
        }
        
    
        /*
            main parent
            div
        */
       var ui = this.ui
        var av = ui.html({
            shaym: "av",
            style: {
                position: "relative"
            },
            attributes: 
            {
                awts:2
            }
            
        });

        this.parentForCanvas = av;
       

        this.ui = ui;

        
        var worldDayuh = e.detail.worldDayuh;
        var gameUiHTML = e.detail.gameUiHTML;

        this.onerror = opts.onerror;
        if(!this.started) {
            this.startWorld({
                worldDayuh,
                gameUiHTML
            });
            this.setOnmessage();
        }

    }

    setOnmessage() {
        
        try {
            if(this.socket) {
                
                
            
                this.socket.onmessage = e=>{
                    if(e.data.switchWorlds) {
                        this.switchWorlds({
                            ...e.data.switchWorlds
                        })
                    }

                    
                };
                
                this.socket.onerror = this.onerror
            } else {
                console.log("no socket!")
            }
        } catch(e) {
            console.log("Not set",e)
        }
    }

    async destroyWorld() {
        return new Promise((r,j) => {
            if(!this.socket) r(false);
            this.socket.onmessage = e=>{
				/**
					should have some info 
					about characters etc.
				**/
				var dst = e.data.destroyed;
                if(dst) {
                    delete this.socket;
                    
                    r("Destroyed now creating new")
                }


            };
            this.socket.postMessage({
                destroyWorld: true
            });
            this.started = false;
        })
        
    }

    async switchWorlds({
        worldDayuh,
        gameState
    }) {
        if(gameState) {
            if(gameState.shaym) {
                this.gameState[
                    gameState.shaym
                ] = gameState;
            }
        }
        var d = await this.destroyWorld();
        var ld = this.ui.getHtml("loading")
        if(ld)
        var load = this.ui.setHtml(ld, {
            className: "loading"
        })
        this.startWorld({worldDayuh});
    }

    startWorld({
        worldDayuh,
        gameUiHTML
    }) {
        
       if(gameUiHTML) {
        this.gameUiHTML = gameUiHTML
       }
       
       var self = this;
       var ghtml = worldDayuh.html;
       if(typeof(ghtml) != "object") {
        ghtml = {
            
        }
       }
       Object.assign(ghtml, self.gameUiHTML)
      
       var heescheelObj = {
            ...worldDayuh,
            
            html: ghtml,
            gameState: this.gameState,
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
       var canvas = this.ui.html({
           parent: this.parentForCanvas,
           tag: "canvas",
           shaym: "canvasEssence"
       });
       if(!canvas) {
        alert("Couldn't find canvas, not starting");
        return;
       }
        var man = new OlamWorkerManager(
            "./ckidsAwtsmoos/oyved.js",
            {
                async pawsawch() {
                    
                    var ID = Date.now();
                    man.postMessage({
                        heescheel: heescheelObj
                    });
                }
            },
            canvas
        );
        window.socket = man;
        this.socket = man;
        this.setOnmessage();
        return true /*loading*/;
    }
}

export default ManagerOfAllWorlds;