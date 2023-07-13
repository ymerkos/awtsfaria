/**
 * B"H
 * "spiritual",
 *  includes abstract class definitions and helpers like 
 * "Kav" for "Vector", etc, for custom positions etc.
 */

/**
 * Heeoolee, the base of existence.
 * 
 * Has event lsiteners for when an update
 * has occured.
 */

export class Heeoolee {
    constructor() {

    }
}

export class Kav {
    x = 0;
    y = 0;
    z = 0;
    constructor(x=0,y=0,z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(xOrObject/*or object*/,y,z) {
        var x;
        if(typeof(x) == "object") {
            ({x, y, z} = xOrObject);
        }
        if(x !== undefined) {
            this.x = x;
        }
        if(y !== undefined) {
            this.y = y;
        }
        if(z !== undefined) {
            this.z = z;
        }
    }


    serialize() {
        this.serialized = {
            x:this.x, y:this.y, z:this.z
        };
        return this.serialized;
    }
}