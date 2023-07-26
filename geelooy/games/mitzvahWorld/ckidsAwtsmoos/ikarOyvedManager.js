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
export default class OlamWorkerManager {
    eved/*worker*/;
    customTawfeekeem = {};
    opened = false;
    functionsToDo = [];
    constructor(workerPath, options={}, canvasElement) {
        var self = this;
        this.eved = new Worker(
            workerPath,
            {
                type: "module"
            }
        );

        this.customTawfeekeem = options;
        if(!typeof(this.customTawfeekeem) == "object") {
            this.customTawfeekeem = "object";
        }
        this.canvasElement = canvasElement;
        
        this.tawfeekim = {
            
            
            'lockMouse': this.lockMouse.bind(this),
            'takeInCanvas': this.takeInCanvas.bind(this),
            'pawsawch'/*when worker opens*/: this.pawsawch.bind(this),
            'heescheel'() {
                
                self.heescheel();
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


        addEventListener('mousedown', (event) => {
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
            console.log("DAY",dayuh)
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
        const off = this.canvasElement.transferControlToOffscreen();

        this.eved.postMessage({
            takeInCanvas: off
        }, [off]);
        
    }
}
