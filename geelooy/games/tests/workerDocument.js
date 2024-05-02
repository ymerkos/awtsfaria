
/**
 * B"H
 * emulates some necessary document proeprties for 
 * THREE.js in worker
 */
 import Utils from "../mitzvahWorld/ckidsAwtsmoos/utils.js";

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
/*
    postMessage(...args) {
        
        var argsCopy = args;
        var obj = {};
        var bool; //boolean indicating to stringify functions
        if(typeof(args[0]) == "string") {
            var ob = {
                [args[0]]:args[1]
            }
       //     obj = ob;
            argsCopy[0] = ob;
        } else if(typeof(args[0]) == "object") {
   //         obj = argsCopy[0];
        }
        if(obj.awts) {
            bool = true;
        }
        if(bool) {
            
            // Utils.stringifyFunctions(obj);
            //console.log(obj, "stringed", bool)
        }
        try {
            super.postMessage(...argsCopy);
      
        } catch(e) {
            console.log(e);
    
        }
    
        
        
    }

   /*
    onmessage(...args) {
        var copied = args;
        var ev = copied[0];
        console.log("message",args)
        if(ev && ev.data) {
            var data = ev.data;
            if(typeof(data) == "object") {
                evalStringifiedFunctions(data);
                console.log("evaled",data)
            }
        }
        super.onmessage(...copied);
    }*/
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