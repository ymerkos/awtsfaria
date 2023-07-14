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
class OlamWorkerManager extends Eved {
    constructor(workerPath, options, canvasElement) {
        super(workerPath, options);

        this.canvasElement = canvasElement;
        this.container = document.getElementById('container');
        document.body.appendChild(this.canvasElement);

        this.tawfeekim = {
            'resize': this.takeInCanvas.bind(this),
            'pixelRatio': this.setPixelRatio.bind(this),
            'lockMouse': this.lockMouse.bind(this),
            'start': this.heescheel.bind(this)
        };

        this.setUpEventListeners();
    }

    /**
     * B"H
     * Sets up the event listeners for user input events and window resize event.
     */
    setUpEventListeners() {
        addEventListener('resize', (event) => {
	        this.postMessage({'resize': {
	            width: innerWidth,
	            height: innerHeight
	        }});
        });

        addEventListener('keydown', (event) => {
	        this.postMessage('keydown', Utils.clone(event));
        });

        addEventListener('keyup', (event) => {
	        this.postMessage('keyup', Utils.clone(event));
        });

        addEventListener('mousedown', (event) => {
	        this.postMessage('mousedown', Utils.clone(event));
        });

        addEventListener('mouseup', (event) => {
	        this.postMessage('mouseup', Utils.clone(event));
        });

        addEventListener('mousemove', (event) => {
	        this.postMessage('mousemove', Utils.clone(event));
        });

        addEventListener('wheel', (event) => {
	        this.postMessage('wheel', Utils.clone(event));
        });

        this.addEventListener('message', this.handleMessageEvent.bind(this), false);
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
    postMessage(command, data) {
        this.worker.postMessage({ [command]: data });
    }

    /**
     * B"H
     * Handles the 'resize' command from the worker.
     * It sends the new size of the window to the worker.
     */
    takeInCanvas() {
        this.postMessage('resize', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    /**
     * B"H
     * Sends the device pixel ratio to the worker.
     */
    setPixelRatio() {
        this.postMessage('pixelRatio', window.devicePixelRatio);
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
        this.postMessage('start', off);
    }
}
