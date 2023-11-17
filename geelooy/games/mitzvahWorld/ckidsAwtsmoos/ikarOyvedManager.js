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
 * const olamWorkerManager = new OlamWorkerManager('./ckidsAwtsmoos/oyved.js', { type: 'module' }, document.querySelector('canvas'));
 */

import Utils from "./utils.js";
import UI from "../../../scripts/awtsmoos/ui.js";

var myUi = null;

export default class OlamWorkerManager {
    eved/*worker*/;
    customTawfeekeem = {};
    opened = false;
    functionsToDo = [];
    
    constructor(workerPath, options={}, canvasElement) {
        var self = this;
        myUi = new UI();

        this.eved = new Worker(
            workerPath,
            {
                type: "module"
            }
        );
        
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
            
            awtsmoosEval(result) {
                console.log("Eval result:",result)
            },
            'lockMouse': this.lockMouse.bind(this),
            'takeInCanvas': this.takeInCanvas.bind(this),
            'pawsawch'/*when worker opens*/: this.pawsawch.bind(this),
            'heescheel'() {
                
                self.heescheel();
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
            htmlAction({
                    shaym, 
                    properties = {
                    //properties to set
                    }, 
                    methods = {
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
            }) {
                var ac = myUi.htmlAction({
                    shaym,
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

                self.eved.postMessage({
                    htmlActioned: {
                        shaym, 
                        methodsCalled: mc,
                        propertiesSet: ps,
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
                action
            }) {
                myUi.htmlAction({
                    shaym: "loading bar",
                    properties: {
                        style: {
                            width: total+"%"
                        }
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
                    const result = {};
                    for (const prop in propsObj) {
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
                    const results = {};
                    for (const methodName in methodsObj) {
                        if (methodsObj.hasOwnProperty(methodName) && typeof htmlElement[methodName] === 'function') {
                            const args = methodsObj[methodName];
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
            }
			
            
        };

        
        this.setUpEventListeners();
        
    }

    async pawsawch() {
        this.opened = true;
        
        await Promise.all(
            this.functionsToDo.map(q=>q())
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


        addEventListener("touchstart", event => {
            if(event.target.tagName != "BUTTON")
                this.eved.postMessage({"mousedown": Utils.clone(event.touches[0])});
        });


        addEventListener("touchend", event => {
            this.eved.postMessage({"mouseup": Utils.clone(event.touches[0])});
        });
        

        addEventListener("touchmove", event => {
            this.eved.postMessage({"mousemove": Utils.clone(event.touches[0])});
        });
        
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
            functionsToDo.push(fnc);
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
        myUi.setHtml(
            this.canvasElement, {
                style: {
                    cssText: `
                        position: absolute;
                        top:0%;left:0%;
                        width:100%;
                        height:100%;
                    `
                }
            }
        );
        const off = this.canvasElement.transferControlToOffscreen();
        
        this.eved.postMessage({
            takeInCanvas: off
        }, [off]);
        
    }

    
}

/**
         * @method ch (check) chceks if 
         * current mouse target is an element
         * that can be interacted with
         * for use for when to send
         * mousedown events to move around
         * camera or not etc.
         * @param {EVENT} event 
         * @returns 
         */
function ch(event) {
    return (
        event.target.tagName != "BUTTON" &&
        event.target.tagName != "P"
    );
}
