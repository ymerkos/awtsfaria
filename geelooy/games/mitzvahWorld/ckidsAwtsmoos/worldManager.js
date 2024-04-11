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
import asdf from "/auth/index.js"

window.asdf=asdf;
import mainMenu from "../tochen/ui/mainMenu.js";

import style from "../tochen/ui/style.js";

import UI from "/games/scripts/awtsmoos/ui.js";
import OlamWorkerManager from "./ikarOyvedManager.js";

class ManagerOfAllWorlds {

	gameState = {};
    started = false;
    ikarUI = null;
    constructor(workerPath) {
        setupGlobalFunctions()
        var ol = console.log;
       // console.log = (...args) => {
       //     ol("TRYING",args)
       // }
        var self = this;
        var ui = new UI();
        this.ui = ui;
        this.ikarUI = ui.html({
            shaym: "ikar",
            children: [
                
                style,
                ...mainMenu
            ]
        });
        var h = this.ikarUI;




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
            
            




        var first = false;
        h.addEventListener("start", async e => {
          //  console.log(e)
         //   alert("Started! First time? "+first)
            if(!first) {
                first = true;
                start(e)
            }else {
                self.initializeForFirstTime(e)
            }
        });

        h.addEventListener("olamPeula", peula => {
            var det = peula.detail;
            if(
                this.socket && 
                this.socket.eved && 
                det
            ) {
               
                Object.keys(det).forEach(w => {
                    this.socket.eved.postMessage({
                        [w]: det[w]
                    })
                })
            }
            
            
                    
               
        })

        function start(e) {
       //     alert("Starting")
            self.initializeForFirstTime(e, {
                onerror(e) {
                   
                    alert("There was an error "+e)
                    window.aa = ui;
                    ui
                    .htmlAction({
                        shaym: "loading",
                        properties: {
                            innerHTML: 
                            "There was an error. Check console, contact Coby."
                        }
                    })
                    
            
                }
            })
        
        }
        document.body.appendChild(h)

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
    //   alert("About to set up loading screen")
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
    //    alert("About to start world "+ this.started)
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
           // alert("Setting socket message "+ this.socket)
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
        myUi.htmlAction({
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
            gameState: this.gameState,
            on: {
                ready(m) {
                    

                    m
                    .ayshPeula("alert", "Ok now its officially ready");

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

        var nav = navigator.userAgent.toLowerCase();
        if(nav.includes("iphone")) {
           // this.parentForCanvas = document.body
        }
        
       // alert("About to add canvas")
       var canvas = this.ui.html({
           parent: this.parentForCanvas,
           tag: "canvas",
           style: {
            //width: "100%"
           },
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