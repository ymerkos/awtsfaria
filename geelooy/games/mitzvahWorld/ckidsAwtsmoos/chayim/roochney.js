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
import * as THREE from '/games/scripts/build/three.module.js';
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
            if(typeof(peula) == "string") {
                /*try to resolve string as 
                function, maybe passed from worker
                or socket etc.*/
                
                try {
                    peula = eval("("+peula+")");
                } catch(e) {
                    
                    return null;
                }
                
            }
            
        }


        if(!this.events[shaym]) {
            this.events[shaym] = [];
        }
        this.events[shaym].push(peula);
    }

    event(shaym) {
        return this.events[shaym] ? 
            this.events[shaym].length ? 
            this.events[shaym] : null : null;
    }

    ayshPeula/*fire event*/(
        shaym/*name*/, 
        ...dayuh/*data*/
    ) {
        
        if(this.events[shaym]) {
            this.events[shaym].forEach(async q=>{
                if((q+"").indexOf("async") > -1)
                    await q(...dayuh);
                else q(...dayuh);
            });
        }
    }
}

export class Kav extends Heeoolee{
    x = 0;
    y = 0;
    z = 0;
    _vector3 = null;
    constructor(x=0,y=0,z=0) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        this._vector3 = new THREE.Vector3(
            this.x,
            this.y,
            this.z
        );
    }

    set(
        xOrObject/*or object*/=0,
        y,
        z) {
        
        var x = xOrObject;
        if(typeof(x) == "object") {
            ({x, y, z} = xOrObject);
        }
        if(typeof(x) == "number") {
            this.x = x;
        } else this.x = 0;

        if(typeof(y) == "number") {
            this.y = y;
        } else this.y = 0;

        if(typeof(z) == "number") {
            this.z = z;
        } else this.z = 0;

        this._vector3.set(
            this.x,
            this.y,
            this.z
        );

        
    }


    vector3() {
        this._vector3.set(
            this.x,
            this.y,
            this.z
        )
        return this._vector3; 
    }

    serialize() {
        this.serialized = {
            x:this.x, y:this.y, z:this.z
        };
        return this.serialized;
    }
}