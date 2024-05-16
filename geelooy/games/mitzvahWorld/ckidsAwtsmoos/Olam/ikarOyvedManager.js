/**
 * B"H
 * The OlamWorkerManager class extends the Eved class and includes the set of task events specific to the Olam.
 * It handles communication with the worker, manages user input events and initializes the game.
 * 
 * @param {string} workerPath - The path to the worker file.
 * @param {Object} options - The options for the Worker instance.
 * @param {Object} canvasElement - The canvas element in the main thread.
 *
 * @example
 * // B"H
 * var olamWorkerManager = new OlamWorkerManager('./ckidsAwtsmoos/oyved.js', { type: 'module' }, document.querySelector('canvas'));
 */

import Utils from "../utils.js";
import UI from "/games/scripts/awtsmoos/ui.js";
import asdf from "../../auth/index.js"
var myUi = null;
var ZOOM_INTENSITY = 26 //for mobile
var TURN_INTENSITY = 1.3;
export default class OlamWorkerManager {
    eved/*worker*/;
    customTawfeekeem = {};
    opened = false;
    functionsToDo = [];
    
    constructor(workerPath, options={}, canvasElement, ui) {
        var self = this;
        myUi = ui || new UI();
        
        window.ui = myUi;
        this.eved = new Worker(
            workerPath,
            {
                type: "module"
            }
        );
        this.eved.addEventListener("error",m => {
            console.log(m,m+"","HI!")
        })

        
		if(typeof(myUi.on) == "function") {
			myUi.on("custom peula", ({
				element,
				key,
				value
			}) => {
				self.eved.postMessage({
					htmlPeula: {
						[key]: value
					}
				})
			})
			;
		}
        this.customTawfeekeem = options;
        if(!typeof(this.customTawfeekeem) == "object") {
            this.customTawfeekeem = {};
        }

        this.canvasElement = canvasElement;
        var self = this;
        this.tawfeekim = {
            
            async awtsmoosEval(result) {
                console.log("Eval result:",result)
            },
            'lockMouse': this.lockMouse.bind(this),
            'takeInCanvas': this.takeInCanvas.bind(this),
            'pawsawch'/*when worker opens*/: this.pawsawch.bind(this),
            'heescheel'() {
                
                self.heescheel();
                asdf.updateProgress({
                    startedLoading: Date.now()
                })
            },
            deleteCanvas() {
                if(self.canvasElement) {
                    self.canvasElement.parentNode.removeChild(
                        self.canvasElement
                    );
                   
                }

                if(self.onmessage) {
                    self.onmessage({
                        data: {
                            destroyed: true
                        }
                    })
                }
                
            },
            htmlAction(dayuh={
                    shaym,
                    selector, 
                    properties: {
                    //properties to set
                    }, 
                    methods: {
                    /**
                     * format:
                     * [methodName]: [args],
                     * 
                     * like
                     * 
                     * 
                     * click: [] (or true)
                     * 
                     * setAttribute: ["hi", "there"]
                     */
                    },
                
                id
            }, noSocket) {
                if(
                    !dayuh || 
                    typeof(dayuh)
                    != "object"
                ) dayuh = {};
                var parsed = Utils
                .evalStringifiedFunctions(dayuh);

                var {
                    shaym,
                    selector,
                    properties,
                    methods,
                    id
                } = parsed;

                var ac = myUi.htmlAction({
                    shaym,
                    selector,
                    properties,
                    methods
                });

                if(!ac) return null;
                
                var ps = ac.propertiesSet;
                var mc = ac.methodsCalled;
                if(ps) {
                    ps =  Utils
                    .stringifyFunctions(ps)
                }

                if(mc) {
                    mc =  Utils
                    .stringifyFunctions(mc)
                }

                var res = {
                    htmlActioned: {
                        shaym, 
                        methodsCalled: mc,
                        propertiesSet: ps,
                        selector,
                        id
                    }
                };

                if(!noSocket) {

                    self.eved.postMessage(res);
                    return;
                }
                return res;
            },

            htmlActions(dayuh={
                ar:[],
                
                id
            }) {
                var ar = dayuh.ar;
                var id = dayuh.id;
                var done = []
                if(Array.isArray(ar)) {
                    ar = ar.filter(Boolean)
                    for(var m in ar) {
                        var res = self.tawfeekim.htmlAction(
                            ar[m], true
                        )
                        done.push(res)
                    }
                }
                

                self.eved.postMessage({
                    htmlActioned: {
                        ar,
                        done,
                        id
                    }
                });
            },
            hideLoadingScreen() {
               /* m
                .ayshPeula("alert", "Ok now its officially ready");
*/
                myUi.htmlAction({
                    shaym: "loading",
                    methods: {
                        classList: {
                            add: "hidden"
                        }
                    }
                })
            },
            getWindowSize(id) {
                var size = {
                    width: innerWidth,
                    height: innerHeight
                }
                self.eved.postMessage({
                    sized: {
                        size,
                        id
                    }
                });
            },
            resetPercentage() {
                myUi.htmlAction({
                    shaym: "loading bar",
                    properties: {
                        style: {
                            width: "0%"
                        }
                    }
                });

            },
            increasedOlamLoading({
                amount,
                total,
                action,
                reset = false,
                subAction
            }) {
                if(reset) total = amount;
                
                myUi.htmlAction({
                    shaym: "loading bar",
                    properties: {
                        style: {
                            width: total+"%"
                        }
                    }
                });
                
                myUi.htmlAction({
                    shaym: "sub action loading",
                    properties: {
                        innerHTML: subAction || ""
                    }
                });
                myUi.htmlAction({
                    shaym: "action loading",
                    properties: {
                        innerHTML: action
                    }
                });
                
            },
            /**
             * @method htmlGet gets 
             * PROPERTIES of a given HTML
             * element, and executes specified methods.
             * @param {String} shaym 
             * @param {Object} properties 
             * @param {Object} methods
             * @param {String} id
             */
            htmlGet({
                shaym, 
                properties = {},
                methods = {},
                id
            }) {
                var html = myUi.getHtml(shaym);
                if(!html) return null;

                function getProperties(htmlElement, propsObj) {
                    var result = {};
                    for (var prop in propsObj) {
                        if (propsObj.hasOwnProperty(prop)) {
                            if (typeof propsObj[prop] === 'object' && propsObj[prop] !== null) {
                                // If the property is an object, recurse into it
                                result[prop] = getProperties(htmlElement[prop], propsObj[prop]);
                            } else {
                                // If the property is not an object, get its value directly
                                result[prop] = htmlElement[prop];
                            }
                        }
                    }
                    return result;
                }

                function executeMethods(htmlElement, methodsObj) {
                    var results = {};
                    for (var methodName in methodsObj) {
                        if (methodsObj.hasOwnProperty(methodName) && typeof htmlElement[methodName] === 'function') {
                            var args = methodsObj[methodName];
                            results[methodName] = htmlElement[methodName](...args);
                        }
                    }
                    return results;
                }

                var propertiesGot = getProperties(html, properties);
                var methodsGot = executeMethods(html, methods);

                // make sure we didn't get any functions by mistake etc..
                propertiesGot = Utils.stringifyFunctions(propertiesGot);
                methodsGot = Utils.stringifyFunctions(methodsGot);

                self.eved.postMessage({
                    htmlGot: {
                        shaym, 
                        propertiesGot,
                        methodsGot,
                        id
                    }
                });
            },
            /**
             * 
             * @param {
             *  shaym - id of parent
             * child - javascript object data for the child 
             * to append to.
             * 
             * }  options
             */
            htmlAppend({shaym, child}) {
                var ret = null;
                if(typeof(shaym) == "string") {
                    ret = {}
                }
                if(
                    !child || 
                    typeof(child)
                    != "object"
                ) ret = null;

                if(ret) {
                    var parsed = Utils
                        .evalStringifiedFunctions(child);
                    parsed.parent = shaym;
                    
                    var r = myUi.html(parsed);
                  
                }
            },
            htmlDelete({shaym, id}) {
                var r = myUi.deleteHtml(shaym);
                self.eved.postMessage({
                    htmlDeleted: {
                        shaym, 
                        result: r,
                        id
                    }
                });
            },
            "game started": a => {
          
                asdf.updateProgress({
                    gameStarted: Date.now()
                })
            },
            "htmlCreate": info => {
                if(
                    !info || 
                    typeof(info)
                    != "object"
                ) info = {};

                var parsed = Utils
                .evalStringifiedFunctions(info)
                
                var r = myUi.html(parsed);
               

                self.eved.postMessage({
                    htmlCreated: {
                        shaym: info.shaym,
                        id: info.id
                    }
                });
                
            },
			
            "setHtml": ({
                shaym, 
                dayuh = {}
            }={}) => {
                if(
                    !dayuh || 
                    typeof(dayuh)
                    != "object"
                ) dayuh = {};
                var parsed = Utils
                .evalStringifiedFunctions(dayuh)
                
                var r = myUi.setHtmlByShaym(shaym,parsed);
               

                self.eved.postMessage({
                    htmlSet: {
                        shaym: shaym
                    }
                });
                
            },
            loadedWorld() {
                self.onmessage({
                    data: {
                        loadedWorld: true
                    }
                })
            },

            switchWorlds(stringifiedWorldDayuh) {
                
                try {
                    var parsed = Utils
                    .evalStringifiedFunctions(stringifiedWorldDayuh);
                    
                    if(typeof(self.onmessage) == "function") {
                        self.onmessage({
                            data: {
                                switchWorlds: parsed
                            }
                        })
                    }
                } catch(e) {

                }
            },

            error(er) {
                myUi.htmlAction({
                    shaym: "awtsmoos error",
                    methods: {
                        classList: {
                            remove: "hidden"
                        }
                    },
                    properties: {
                        textContent: JSON.stringify(er)
                    }
                });
            },
            updateProgress(data) {
                asdf.updateProgress(data).then(r => {
                  //  console.log("Updated!",r)
                }).catch(e => {
                    console.log("Issue updating",e)
                })
            },

            alert(ms) {
                window.alert(ms+"")
            },
            updateMinimapScroll({
                center,
                minimapCamera,
                id
            }) {
                // Get the dimensions of the minimap canvas
                var minimapCanvas = myUi.getHtml("canvasMap")
                if(!minimapCanvas) {
                    return console.log("No canvas!",center)
                }
                
                
                // Assuming parentElement is the parent element of the minimap canvas
                var parentElement = minimapCanvas.parentElement.parentElement;

                var minimapWidth = minimapCanvas.width;
                var minimapHeight = minimapCanvas.height;
                var playerPosition = center;
                // Calculate the position of the player within the minimap
                var playerX = playerPosition.x; // Assuming playerPosition is a Vector3
                var playerZ = playerPosition.z; // Assuming playerPosition is a Vector3

                // Calculate the relative position of the player within the captured area of the minimap
                var relativePlayerX = (playerX - minimapCamera.position.x + minimapCamera.right) / (minimapCamera.right - minimapCamera.left);
                var relativePlayerZ = (playerZ - minimapCamera.position.z + minimapCamera.top) / (minimapCamera.top - minimapCamera.bottom);

              


                // Calculate the position to scroll to within the parent element
                var parentScrollLeft = relativePlayerX * minimapWidth - parentElement.clientWidth / 2;
                var parentScrollTop = relativePlayerZ * minimapHeight - parentElement.clientHeight / 2;

                parentScrollLeft = parentScrollLeft
                parentScrollTop = parentScrollTop
                // Calculate the maximum allowed position to keep the player centered
                var maxScrollLeft = minimapWidth - parentElement.clientWidth;
                var maxScrollTop = minimapHeight - parentElement.clientHeight;

                if (/**
                    player always needs to be centered.

                    if the player moves such that there is 
                    no more room to scroll, re-capture;
                */parentScrollLeft < 0 || parentScrollTop < 0 || parentScrollLeft > maxScrollLeft || parentScrollTop > maxScrollTop || maxScrollTop<0||maxScrollLeft<0) {
                    // If the captured area exceeds the bounds and the player is still moving within it, recapture the scene
                    self.eved.postMessage({
                        captureMinimapScene: true
                    })
                    console.log("Need to capture",parentElement.scrollLeft,parentElement.scrollTop)
                    return;
                 
                }

                


                // Set the scroll position of the parent element
                parentElement.scrollLeft = parentScrollLeft;
                parentElement.scrollTop = parentScrollTop;
                
              //  console.log("SCROLLED",center,minimapCanvas,minimapCamera,parentScrollLeft,parentScrollTop)
                self.eved.postMessage({
                    scrolledMap: {
                 
                        id
                    }
                });
            },
            startMapSetup() {
                var size = {
                    width: 300,
                    height: 300
                }

                var mapParent = myUi.html({
                    shaym: "map parent",
                    className: "mapParent",
                    parent: "ikarGameMenu",
                    style: {
                        cssText:`
                            width:${size.width}px;
                            height:${size.height}px;
                            
                        `
                    }
                    
                });
                

                var mapAv = myUi.html({
                    shaym: "map av",
                    className: "map",
                    parent: mapParent,
                    
                    
                });

                var actualRawMap = myUi.html({
                    shaym: "raw map",
                    className: "mapRaw"
                    ,
                    parent: "map av"
                })
                var mapControls = myUi.html({
                    shaym: "map controls",
                    className: "mapControls",
                    parent: mapParent,
                    children: [
                        {
                            className: "leftBtns",
                            children: [
                                {
                                    tag: "button",
                                    className: "button",
                                    innerHTML: "-",
                                    onclick(e, $, m) {
                                        e.target.blur();
                                        m.peula(e.target,
                                            {"peula": {
                                        
                                            peulaName: "minimap zoom out",
                                            peulaVars: [0.25]
                                        
                                            }
                                        })
                                    }
                                },
                                {
                                    tag: "button",
                                    className: "button",
                                    innerHTML: "+",
                                    onclick(e, $, m) {
                                        var ikar = $("ikar")
                                    
                                        m.peula(ikar,
                                            {"peula": {
                                        
                                            peulaName: "minimap zoom in",
                                            peulaVars: [0.25]
                                        
                                            }
                                        });
                                        e.target.blur();
                                    }
                                }
                            ]
                        },
                        {
                            className: "rightBtns",
                            children: [
                                {
                                    tag: "img",
                                    width:50,
                                    height:50,
                                    awtsmoosClick: true,
                                    className: "fullScreenBtn",
                                    onclick(e, $, m) {
                                        var ikar = $("ikar")
                                    
                                        m.peula(ikar,
                                            {"peula": {
                                        
                                            peulaName: "minimap fullscreen toggle",
                                            peulaVars: [0.25]
                                        
                                            }
                                        });
                                        e.target.blur();
                                    },
                                    src: "./resources/pictures/fullscreen.svg"
                                }
                            ]
                        }
                        
                    ]
                });

                
                
                var mapCanvas = myUi.html({
                    parent: "raw map",
                    tag: "canvas",
                    shaym: "canvasMap",
                    className: "filled"
                });

                var minimapLabel = myUi.html({
                    shaym: "minimap label",
                    className: "mapLabel invisible"
                    ,
                   // parent: "map av"
                })

                

                
                var off = mapCanvas.transferControlToOffscreen();
                self.eved.postMessage({
                    gotMapCanvas: {
                        canvas: off,
                        size
                    }
                }, [off])
            }
			
            
        };

        
        this.setUpEventListeners();
       /* var p = options.pawsawch;
        if(p && typeof(p) == "function") {
            p(this);
        }
        console.log("Got",p)*/
    } 

    async pawsawch() {
        this.opened = true;
        
        await Promise.all(
            this.functionsToDo.map(q=>q(this))
        );
        
        this.functionsToDo = [];
    }

    /**
     * B"H
     * Sets up the event listeners for user input events and window resize event.
     */
    setUpEventListeners() {
        
        addEventListener('resize', (event) => {
	        this.eved.postMessage({'resize': {
	            width: innerWidth,
	            height: innerHeight
	        }});
        });

        addEventListener('keydown', (event) => {
            var ev = Utils.clone(event)

            this.eved.postMessage({"keydown": ev});
        });


        addEventListener('keyup', (event) => {
            this.eved.postMessage({"keyup": Utils.clone(event)});
        });

        mobileControls.bind(this)();
        
        addEventListener("contextmenu",e=>{
            if(
                e.target.tagName != "P"
            )
                e.preventDefault();
        });


        addEventListener('mousedown', (event) => {
            var tg = event.target.tagName.toLowerCase();
            var cl = event
                .target
                .className;
                
            if((
                cl && typeof(cl.includes) 
                == "function"
                && (
                    cl
                    .includes("menuTop")
                    ||
                    cl
                    .includes("mitzvahBtn")
                )
            )) {
                return;
            }

            if(
                

                
                tg != "svg"
                && tg != "path"
                && tg != "rect"
            )
            
            if(
                ch(event)
            )
                this.eved.postMessage({"mousedown": Utils.clone(event)});
        });

        addEventListener('mouseup', (event) => {

            this.eved.postMessage({"mouseup": Utils.clone(event)})

        });

        addEventListener('mousemove', (event) => {
            this.eved.postMessage({"mousemove": Utils.clone(event)})
        });



        addEventListener('wheel', (event) => {
            if(
                ch(event)
            )
                this.eved.postMessage({"wheel": Utils.clone(event)})
        });

        this
        .eved
        .addEventListener(
            'message', 
            this.handleMessageEvent.bind(this), 
            false
        );
    }

    /**
     * B"H
     * Handles the message event from the worker.
     * It looks for the command in the data received from the worker and calls the corresponding function from the tawfeekim.
     *
     * @param {MessageEvent} event - The message event from the worker.
     */
    handleMessageEvent(event) {
        let data = event.data;
        
        if (typeof data === 'object') {
            
            Object.keys(data).forEach(key => {
                let task = this.tawfeekim[key];
                var k = data[key];
                
                var err = k ? k.error : null;
                
                if(err)
                    if(typeof(this.onerror) == "function") {
                        this.onerror(err,this)
                    }
                if (typeof task === 'function') {
                    task(data[key]);
                }
                let customTawf = this.customTawfeekeem[key];
                if(typeof(customTawf) == "function") {
                    customTawf(data[key]);
                }
            });
        }
    }

    
    /**
     * B"H
     * Sends a message to the worker with the command and the data.
     *
     * @param {string} command - The command to send to the worker.
     * @param {*} [data] - The data to send to the worker with the command.
     */
    postMessage(data) {
        var dayuh = data;
        var stringed = false
        if(
            dayuh &&
            typeof(dayuh) == 
            "object"
        ) {
            stringed = true;
            dayuh = Utils.stringifyFunctions(data);
        }

        if(stringed) {
            
        }


        var fnc = () => this.eved.postMessage(dayuh);

        if(!this.opened) {
            this.functionsToDo.push(fnc);
        } else {
            fnc();
        }
        
        
    }

    /**
     * B"H
     * Handles the 'resize' command from the worker.
     * It sends the new size of the window to the worker.
     */
    takeInCanvas() {
        
        
        this.resize()
        this.setPixelRatio()
        
    }

    resize() {
        this.eved.postMessage({"resize": {
            width:innerWidth,
            height:innerHeight
        }});
    }

    /**
     * B"H
     * Sends the device pixel ratio to the worker.
     */
    setPixelRatio() {
        this.eved.postMessage({'pixelRatio': window.devicePixelRatio});
    }

    /**
     * B"H
     * Handles the 'lockMouse' command from the worker.
     * If the 'doIt' argument is true, it locks the pointer to the document; otherwise, it unlocks the pointer.
     *
     * @param {boolean} doIt - Whether to lock the pointer to the document.
     */
    lockMouse(doIt) {
        
        if (doIt) {
            document.body.requestPointerLock();
        } else {
            document.exitPointerLock();
        }
    }

    /**
     * B"H
     * Handles the 'start' command from the worker.
     * It transfers control of the canvas to the worker.
     */
    heescheel() {
        /**/
        myUi.setHtml(
            this.canvasElement, {
                style: {
                   /* cssText: `
                        position: absolute;
                        top:0%;left:0%;
                        width:100%;
                        height:100%;
                    `*/
                }
            }
        );


        var off = this.canvasElement.transferControlToOffscreen();
        
        this.eved.postMessage({
            takeInCanvas: {
                canvas:off,
                devicePixelRatio
            }
        }, [off]);
        
    }

    
}
/**
 * @description Checks if the current mouse target or any of its parents
 * is an element that should not trigger the action.
 * Only allows the action to proceed if none of these elements are
 * BUTTON, P, or have a specific class or custom property.
 * @param {Event} event - The event object from the listener.
 * @returns {boolean} - Returns true if the action should proceed, false otherwise.
 */
function ch(event) {
    let el = event.target;
    
    // Traverse up the DOM tree
    while (el && el !== document.body && el !== document.documentElement) {
        // Check the current element against the criteria
        if (el.tagName === "BUTTON" || el.tagName === "P" || el.classList.contains("controller-button") || el.awtsmoosClick) {
            // If any condition is met, the action should not proceed
            return false;
        }
        
        // Move to the next parent element
        el = el.parentElement;
    }
    
    // If no conditions were met up the DOM tree, allow the action to proceed
    return true;
}

function mobileControls() {
    /**
         * mobile events
         * and variables
         */

    var joystickBase = document.getElementById('joystick-base');
    var joystickThumb = document.getElementById('joystick-thumb');
    var joystickActive = false;
    var lastJoystickTouchId = null;
    var lastMainCameraScreenTouchId = null;
    var lastTouchStart = null;
    
    var initialTouchX, initialTouchY;
    var baseRect = null;
    if(joystickBase)
        baseRect = 
        joystickBase
        .getBoundingClientRect();
    
    var initialDistance = null;
    addEventListener("touchstart", event => {
        if(!joystickBase) {
            joystickBase = document.getElementById('joystick-base');
        }
        if(!joystickThumb) {
            joystickThumb = document.getElementById('joystick-thumb');
        }
        
        if(
            event.target.tagName == "BUTTON" ||
            event.target.classList.contains(
                "controller-button"
            )
        ) {
            if(event.touches.length === 2)
                event.target.click();
            return;
        }
        
        var touch = event.touches[0];
        var curTouchInd = 0;
        if(
            joystickBase &&
            (
                event.target ==
                joystickBase ||
                event.target == 
                joystickThumb
            )
        ) {
            joystickActive = true;
            lastJoystickTouchId = touch
                .identifier;
            if(lastJoystickTouchId == 0) {
                curTouchInd = 1
            } else if(lastJoystickTouchId == 1) {
                curTouchInd = 0;
            }
            initialTouchX = touch.pageX;
            initialTouchY = touch.pageY;
            
            if(event.touches.length < 2) return;
        } else {
            //handle zoom logic
            //since we're not zooming
            //while joystick is active
            if(event.touches.length === 2) {
                initialDistance = 
                getDistanceBetweenTouches(event);
                /*myUi.htmlAction({
                    shaym:"Debug",
                    properties: {
                        textContent: "Hi trying to zoom: "+initialDistance
                    }
                });*/

            }
        }
        
        //lastMainCameraScreenTouchId
        touch = event.touches[curTouchInd];
        lastMainCameraScreenTouchId = touch.identifier

        touch = Utils.clone(touch);
        touch.button = 2;
        touch.isAwtsmoosMobile = true;
        if(!lastTouchStart) {
            lastTouchStart = {
                ...touch,
                movementX: 0,
                movementY: 0
            }
            touch.movementX = 0;
            touch.movementY = 0;
        } else {
            touch.movementX = touch.screenX - 
                lastTouchStart.screenX;
            touch.movementY = touch.screenY -
                lastTouchStart.screenY;

            lastTouchStart = {...touch};
        }
        this.eved.postMessage({"mousedown": touch});
        
    });

    var map = {
        up: 'KeyW',        // W key for up
        down: 'KeyS',      // S key for down
        left: 'KeyQ',      // A key for left
        right: 'KeyE',     // D key for right
        "up-left": ['KeyQ',"KeyW"],    // Q key for up-left
        "up-right": ['KeyE',"KeyW"],   // E key for up-right
        "down-left":["KeyQ","KeyS"],
        "down-right":["KeyE", "KeyS"]
    };
    var curDir = null;
    addEventListener("touchend", event => {
        
        if(
            event.target.tagName == "BUTTON" ||
            event.target.classList.contains(
                "controller-button"
            )
        )
            return;
        lastTouch = null
        lastTouchStart = null;
     
        var ch =  Array.from(
            event.changedTouches
        );

        var changedJoystick = ch.find(
            touch => 
            touch.identifier === 
            lastJoystickTouchId
        );

        if (
            changedJoystick
        ) {
            
            updateJoystickThumb({
                deltaX:0, deltaY:0,
                resetX:0,resetY:0,
                baseRect,
                joystickBase,
                joystickThumb
            });
            joystickActive = false;
            lastJoystickTouchId = null;
            
            var touch = Utils.clone(changedJoystick);
            touch.button = 2;
            this.eved.postMessage({"mouseup": touch});

            if(curDir) {
                curDir.forEach(k => {
                   
                    
                    this.eved.postMessage({"keyup": {
                        code: k
                    }});
                });
                curDir = null
            }
        }

        var changedMain = ch.find(t => 
            t.identifier == 
            lastMainCameraScreenTouchId
        );
        if(changedMain) {
            var touch = Utils.clone(changedMain);
            touch.button = 2;
            this.eved.postMessage({"mouseup": touch});
        }
            
        

    });
    

    var lastTouch = null;
    var lastKeys = [];
    addEventListener("touchmove", event => {
        
        if(
            event.target.tagName == "BUTTON" ||
            event.target.classList.contains(
                "controller-button"
            )
        ) return;
        var curTouchInd = 0;
        if(joystickActive) {
            var joystickTouch = Array
            .from(event.touches).find(touch => 
                touch.identifier === lastJoystickTouchId);
            //console.log("Active",joystickTouch,event)
            if (joystickTouch) {
                var deltaX = joystickTouch.pageX - initialTouchX;
                var deltaY = joystickTouch.pageY - initialTouchY;
                 // Calculate the direction
                var direction = getJoystickDirection(
                    deltaX, deltaY
                );
                
               // console.log("The direction is",direction);
                
                var dir = map[direction];
                var keys = [];
                if(Array.isArray(dir)) {
                    keys = dir;
                } else {
                    keys.push(dir)
                }
                if(dir) {
                    curDir = keys;
                    
                    Object.keys(map).forEach(k => {
                        var m = map[k];

                        if(
                            Array.isArray(m) ? 
                            !keys.some(w => m.includes(w))
                            :
                                !keys.includes(m)

                        ) {
                            this.eved.postMessage({"keyup": {
                                code: map[k]
                            }});
                            /*console.log("Undoing",k,keys,map[k],dir,
                            keys.includes(map[k]))*/
                        }
                    });
                    lastKeys.forEach(w => {
                        this.eved.postMessage({"keyup": {
                            code: w
                        }});
                    })
                    
                    keys.forEach(q => {
                        this.eved.postMessage({"keydown": {
                            code: q
                        }});
                    });
                    lastKeys = keys;
                    
                }
                updateJoystickThumb({
                    deltaX, deltaY,
                    baseRect,
                    joystickBase,
                    joystickThumb
                });

                
                if(
                    event.touches.length < 2
                ) {
                    return;
                }

                if(lastJoystickTouchId == 0) {
                    curTouchInd = 1
                } else if (lastJoystickTouchId) {
                    curTouchInd = 0;
                }
                
            }
        } else {
            if (event.touches.length === 2) {
                var currentDistance = getDistanceBetweenTouches(event);
                /*myUi.htmlAction({
                    shaym:"Debug",
                    properties: {
                        textContent: "Hi trying to zoom move: "+initialDistance
                        +" and cur: "+ currentDistance
                    }
                });*/
                if (initialDistance !== null) {
                    var delta = currentDistance - initialDistance;
                    myUi.htmlAction({
                        shaym:"Debug",
                        properties: {
                            textContent: "Hi trying to zoom move: "+initialDistance
                            +" and cur: "+ currentDistance + 
                            " AND did it "+ delta
                        }
                    });
                    this.eved.postMessage({"wheel": {
                        deltaY: delta
                    }});
                }
                initialDistance = currentDistance;
                return;
            }
        }
        var touch = Utils.clone(event.touches[curTouchInd]);
        touch.button = 2;
        
        touch.isAwtsmoosMobile = true;
        if(!lastTouch) {
            lastTouch = {
                ...touch,
                movementX: 0,
                movementY: 0
            }
            
            touch.movementX = 0;
            touch.movementY = 0;
        } else {
            touch.movementX = (touch.screenX - 
                lastTouch.screenX) * TURN_INTENSITY;
            touch.movementY = (touch.screenY -
                lastTouch.screenY) * TURN_INTENSITY;
            lastTouch = {...touch};
        }

        this.eved.postMessage({"mousemove": touch});
    });
}

// Function to determine the direction
function getJoystickDirection(deltaX, deltaY) {
    var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    if (angle < 0) angle += 360;

    if (angle >= 337.5 || angle < 22.5) {
        return 'right';
    } else if (angle >= 22.5 && angle < 67.5) {
        return 'down-right';
    } else if (angle >= 67.5 && angle < 112.5) {
        return 'down';
    } else if (angle >= 112.5 && angle < 157.5) {
        return 'down-left';
    } else if (angle >= 157.5 && angle < 202.5) {
        return 'left';
    } else if (angle >= 202.5 && angle < 247.5) {
        return 'up-left';
    } else if (angle >= 247.5 && angle < 292.5) {
        return 'up';
    } else {
        return 'up-right';
    }
}


// Function to update the joystick thumb position
function updateJoystickThumb({
    deltaX, deltaY,
    resetX,resetY,
    baseRect,
    joystickBase,
    joystickThumb
}) {
    if(!baseRect) {
        baseRect = 
            joystickBase
            .getBoundingClientRect();
    }
    
    if(!joystickThumb || !baseRect) {
        return;
    }
    var maxDistance = baseRect.width;
    var distance = Math.min(maxDistance, Math.sqrt(deltaX * deltaX + deltaY * deltaY));
    var angle = Math.atan2(deltaY, deltaX);

    var thumbX = distance * Math.cos(angle) + maxDistance// - joystickThumb.offsetWidth / 4;
    var thumbY = distance * Math.sin(angle) + maxDistance// - joystickThumb.offsetHeight / 4

    if(resetX !== 0)
        joystickThumb.style.left = thumbX + 'px';
    else  joystickThumb.style.left = ""
    if(resetY !== 0)
        joystickThumb.style.top = thumbY + 'px';
    else joystickThumb.style.top = ""
   // console.log("Set or Reset",resetX,resetY,joystickThumb,joystickThumb.style.top,joystickThumb.style.left)
}

function getDistanceBetweenTouches(e) {
    var touch1 = e.touches[0];
    var touch2 = e.touches[1];
    return ZOOM_INTENSITY * (Math.sqrt(Math.pow(touch2.pageX - touch1.pageX, 2) +
                     Math.pow(touch2.pageY - touch1.pageY, 2)));
}

