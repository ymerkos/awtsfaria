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