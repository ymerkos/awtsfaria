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
import asdf from "../../auth/index.js"

window.asdf=asdf;

import UIManager from "./uiManager/index.js"




import OlamWorkerManager from "./ikarOyvedManager.js";

class ManagerOfAllWorlds {

	gameState = {};
    started = false;
    ikarUI = null;
    constructor(workerPath) {
        setupGlobalFunctions()
      
        var self = this;
        var uiManager = new UIManager();
        this.uiManager = uiManager;
        var ui = uiManager.UI({
            onstart({
                worldDayuh,
                gameUiHTML
            }) {
                console.log("STARTED")
                self.startWorld({
                    worldDayuh,
                    gameUiHTML
                });
                self.setOnmessage();
            }
        });
        this.ui = ui;
        
        var h = ui.$g("ikar");
        if(!h) {
            console.log("Main menu not found")
        }



       // alert("Staretd world manager, about to try service worker")
        if ('serviceWorker' in navigator) {
           // alert("Yes service")
            // First, try to unregister any existing service worker
            navigator.serviceWorker.getRegistrations()
            .then(function(registrations) {
                for(let registration of registrations) {
                    registration.unregister().then(function(boolean) {
                        console.log('Service Worker Unregistered', boolean);
                    });
                }

                // Then, register the new service worker
            //    self.registerServiceWorker(workerPath);
            }).catch(function(error) {
                console.log('Service Worker Unregistration Failed', error);
            });
        } else {
        //    alert(" No service worker")
            console.log('Service Workers not supported');
        }
            
            




        

        asdf.startAll()
        asdf.updateProgress({
            loadedMenu: Date.now()
        });
    }

    
    async registerServiceWorker(workerPath) {
        
        try {
            var registration = await navigator
            .serviceWorker.register(workerPath);
            console.log('Service Worker Registered', registration);
        } catch (e) {
            console.log('Service Worker Registration Failed', e);
        }
    }

    
    setOnmessage() {
        
        try {
           // alert("Setting socket message "+ this.socket)
            if(this.socket) {
                
                
                
                this.socket.onmessage = e=>{
                    
                    if(e.data.switchWorlds) {
                        this.switchWorlds({
                            ...e.data.switchWorlds
                        })
                    }

                    if(e.data.loadedWorld) {
                        console.log("LOADED")
                        this.uiManager.makeGameMenu();
                    }

                    
                };
                
                this.socket.onerror = this.onerror
            } else {
                console.log("no socket!")
            }
        } catch(e) {
            alert(" Not able to set up world")
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
        console.log("this ui",this.ui)
        this.ui.htmlAction({
            shaym: "action loading",
            properties: {
                innerHTML: "Getting ready to start loading..."
            }
        });
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
            gameState: this.gameState
            
        }

       
        
       // alert("About to add canvas")
       var canvas = this.ui.$g("canvasEssence")

       if(!canvas) {
        alert("Couldn't find canvas, not starting");
        return;
       }
        var man = new OlamWorkerManager(
            "./ckidsAwtsmoos/Olam/oyved.js",
            {
                async pawsawch() {
                    var ID = Date.now();
                    
                    
                    man.postMessage({
                        heescheel: heescheelObj
                    });
                }
            },
            canvas,
            this.ui
        );
        window.g=man
        
       // alert("Started worker")
        window.socket = man;
        this.socket = man;
        this.setOnmessage();
        asdf.updateProgress({
            startedLoading: Date.now()
        });
        return true /*loading*/;
    }
}

function setupGlobalFunctions() {
    /**
     * Searches up the DOM tree from the initial event target to find any parent element that contains the specified variable.
     * @param {Event} event - The event triggered by user interaction.
     * @returns {boolean} - True if a parent element with 'shlichusID' is found; otherwise, false.
     */
    function searchForProperty(event, propertyName, returnIt = false) {
        let el = event.target;
        var pr = null;
        var element = null;
        // Climb up the DOM tree
        while (!pr && el && el !== document.body && el !== document.documentElement) {
            if(pr) break;
            // Check if the element has the 'shlichusID' attribute or property
            // This could be adjusted based on how 'shlichusID' is stored (e.g., data attribute, direct property)
            var prop = el[propertyName]
            if(prop !== undefined) {
                pr = prop;
                element = el;
                break;
            }
            el = el.parentElement; // Move up to the next parent element
        }

        if(returnIt) {
            return element
        }
        return pr; // 'shlichusID' not found in any parent elements
    }
    window.searchForProperty = searchForProperty;
}
export default ManagerOfAllWorlds;