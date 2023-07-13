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
    events = {};
    constructor() {

    }

    clear(shaym) {
        if(typeof(shaym) != "string") {
            return null;
        }
        if(this.events[shaym]) {
            delete this.events[shaym];
        }
    }

    on(shaym, peula/*function*/) {
        if(typeof(shaym) != "string") {
            return null;
        }

        if(typeof(peula) != "function") {
            return null;
        }

        if(!this.events[shaym]) {
            this.events[shaym] = [];
        }
        this.events[shaym].push(peula);
    }

    ayshPeula/*fire event*/(
        shaym/*name*/, 
        dayuh/*data*/
    ) {
        if(this.events[shaym]) {
            this.events[shaym].forEach(q=>{
                q(dayuh);
            });
        }
    }
}

export class Kav extends Heeoolee{
    x = 0;
    y = 0;
    z = 0;
    constructor(x=0,y=0,z=0) {
        super();
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