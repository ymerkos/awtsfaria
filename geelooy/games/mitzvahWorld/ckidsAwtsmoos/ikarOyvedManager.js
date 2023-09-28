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
import UI from "./chayim/ui.js";

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
        
        this.customTawfeekeem = options;
        if(!typeof(this.customTawfeekeem) == "object") {
            this.customTawfeekeem = {};
        }

        this.canvasElement = canvasElement;
        
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
                }
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
                        propertiesSet: ps
                    }
                });
            },
            /**
             * @method getHtml gets 
             * PROPERTIEs of a given HTML
             * element, since we can't
             * pass the entire thing via 
             * a worker
             * @param {String} shaym 
             * @param {Object} properties 
             */
            htmlGet(shaym, properties={}) {
                var html = myUi.getHtml(shaym);
                if(!html) return null;

                var propertiesGot = {};

                if(typeof(
                    properties
                ) == "object") {
                    Object.keys(properties)
                    .forEach(w => {
                        propertiesGot[w] = html[w];
                    });

                }
                /**
                 * make sure we didn't get any 
                 * functions by mistake etc..
                 */
                propertiesGot = Utils
                .stringifyFunctions(propertiesGot);

                self.eved.postMessage({
                    htmlGot: {
                        shaym, 
                        propertiesGot
                    }
                });
            },
            htmlDelete(shaym) {
                var r = myUi.deleteHtml(shaym);
                self.eved.postMessage({
                    htmlDeleted: {
                        shaym, 
                        result: r
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
                
                if(r) {
                    document.body.appendChild(r);
                }

                self.eved.postMessage({
                    htmlCreated: {
                        shaym: info.shaym
                    }
                });
                
            },
            
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
        console.log("Resized")
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
