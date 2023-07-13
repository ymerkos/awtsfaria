/**
 * B"H
 * emulates some necessary document proeprties for 
 * THREE.js in worker
 */
OffscreenCanvas.prototype.style = {};
export class document {
    constructor() {

    }
    static createElementNS(url, type) {
        if(type == "canvas") {
            return new OffscreenCanvas(300, 150); /*
                makes default width and height 
                like regular canvas
            */
        }

        if(type == "img") {
            return new Image();
        }
    }
}

export class Eved extends Worker {
    constructor(...args) {
        super(...args)
    }

    postMessage(...args) {
        var argsCopy = args;
        if(typeof(args[0]) == "string") {
            var ob = {
                [args[0]]:args[1]
            }
            argsCopy[0] = ob;
        }
        super.postMessage(...argsCopy);
    }
}

class AwtsmoosOffscreenCanvas extends OffscreenCanvas {
    _style = {};
    constructor(...args) {
        super(...args);
    }
    get style() {
        return this._style;
    }
}
export class FileLoader {
    constructor() {

    }
}

export class Image  {
    width;
    height;
    src;
    constructor() {

    }
}