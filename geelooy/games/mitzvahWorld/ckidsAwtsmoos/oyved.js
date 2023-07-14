/**
 * B"H
 * Worker
 * 
 * This is the worker script responsible for managing the game state and updating the main thread.
 * It uses the Olam class from the worldLoader.js script to create and manipulate the 3D game world.
 * This worker script interacts with the main thread via postMessage and onmessage event handlers.
 * 
 * The tasks that the worker performs are defined in the 'tawfkeedeem' object.
 * Each task corresponds to a specific message from the main thread.
 * 
 */

import * as THREE from "/games/scripts/build/three.module.js";
import Olam from "./worldLoader.js"
import * as AWTSMOOS from "./awtsmoosCkidsGames.js";

// Create a local instance of the Olam class for the game state
var olam = null;

/**
 * Begin the game loop, updating the game state on each animation frame
 */
function heesHawvoos() {
    if (olam) {
        olam.heesHawvoos();
    }
    requestAnimationFrame(heesHawvoos);
}

/**
 * Define tasks to do based on the type of message received from the main thread
 * Each task performs a specific function on the game state or related element
 */
var tawfkeedeem = {
    takeInCanvas(canvas) {
        // Takes in a canvas from the main thread and sets it to the olam instance
        if (olam) {
            olam.takeInCanvas(canvas);
            olam.heesHawvoos();
        }
    },
    // Various event handlers for user input
    mouseup(e) {
        olam?.ayshPeula("mouseup", e);
    },
    mousedown(e) {
        olam?.ayshPeula("mousedown", e);
    },
    keyup(e) {
        olam?.ayshPeula("keyup", e);
    },
    keydown(e) {
        olam?.ayshPeula("keydown", e);
    },
    wheel(e) {
        olam?.ayshPeula("wheel", e);
    },
    mousemove(e) {
        olam?.ayshPeula("mousemove", e);
    },
    // Sets the device pixel ratio for rendering the canvas
    pixelRatio(pr) {
        if (olam) {
            olam.pixelRatio = pr;
        }
    },
    // Handles window resize event and adjusts the canvas accordingly
    resize(e) {
        if (olam) {
            olam.ayshPeula("resize", e);
        }
    },
    // Executes a string of code and returns the result
    async awtsmoosEval(code) {
        if (typeof(code) == "string") {
            var result = eval(code);
            return msg(
                "Got result of code",
                "SUCCESS",
                {code: result + ""}
            );
        }
    },
    // Initializes the game world with the specified options
    async heescheel(options = {}) {
        olam = new Olam();

        try {
            let result = await olam.tzimtzum(options);

            if (result) {
                // Sets up handlers for locking and releasing the mouse pointer
                olam.on("mouseLock", () => postMessage({ lockMouse: true }));
                olam.on("mouseRelease", () => postMessage({ lockMouse: false }));

                return msg("Successfully made olam", "OLAM_GOOD");
            }
        } catch (e) {
            console.log(e);
            return msg("There was an error.", "ERROR", { error: e });
        }
    },
    // Various getters for getting an image bitmap, the canvas, or the olam instance
    async getBitmap(toRender = false) {
        if (olam && olam.renderer && olam.renderer.domElement) {
            let can = olam.renderer.domElement;

            if (toRender) {
                olam.heesHawvoos();
            }

            let bit = can.transferToImageBitmap();

            return { tawchlees: bit, transfer: true };
        }
    },
    async getCanvas() {
        return olam?.renderer?.domElement;
    },
    async getOlam() {
        return olam?.serialize ? { tawchlees: olam.serialize() } : undefined;
    },
};

// Handles incoming messages from the main thread
addEventListener("message", async e => {
    let data = e.data;

    if (typeof(data) == "object") {
        await Promise.all(Object.keys(data).map(async key => {
            let task = tawfkeedeem[key];

            if (typeof(task) == "function") {
                let result = await task(data[key]);

                if (!result) result = {};
                
                let content = result.tawchlees;
                let shouldITransfer = !!result.transfer;

                postMessage({ [key]: content }, shouldITransfer ? [content] : undefined);
            }
        }));
    }
});

// Notifies the main thread that the worker has started successfully
postMessage({ pawsawch: true });

function msg(msg,code,prop) {
    return {
        tawchlees: {
            message: msg,
            code,
            property:{
                ...prop
            }
        }
    }
}