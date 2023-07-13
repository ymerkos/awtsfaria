/**
 * B"H
 * @file domem.js
 * @class Domem
 * @requires nivra.js
 */
import Nivra from "./nivra.js";
import {Kav} from "./roochney.js";
/**
 * Domem is a subclass of Nivra representing inanimate matter.
 * 
 * @class
 * @extends Nivra
 */
export default class Domem extends Nivra {
    /**
     * Constructs a new Domem.
     * 
     * @param {Object} options The options for this Domem.
     * @param {string} options.name The name of this Domem.
     * @param {string} options.path The path to the glTF model for this Domem.
     * @param {Object} options.position The initial position of this Domem.
     * @param {Boolean} options.isSolid If an object can be collided with
     * @param {Olam} olam The "world" object to interact with
     * @property {Array} animations the animations loaded from the 3D model, if any
     */
    type = "domem";
    animations = [];
    path = "";
    position = new Kav();
    rotation = new Kav();
    constructor(options) {
        super(options.name);
        this.path = options.path;
        this.position.set(options.position);
        this.rotation.set(options.rotation);
        this.isSolid = !!options.isSolid;
        // Additional properties can be set here
    }

    serialize() {
        super.serialize();
        this.serialized = {
            ...this.serialized,
            position: this.position.serialize(),
            //path: this.path
        }
        return this.serialized;
    }

    /**
     * Starts the Domem. This function can be overridden by subclasses to provide
     * Domem-specific behavior.
     * 
     * @param {Olam} olam The world in which this Domem is being started.
     */
    async heescheel(olam) {
        await super.heescheel(olam);
        try {
            var gltf = await new Promise(async (r,j) => {
                var res;  
                try {
                    res = await olam.boyrayNivra(this);
                } catch(e) {
                    j(e);
                }
                /*initial "creation" in the world and return it.*/
                if(res) r(res); 
                else r(null);
            });
            
            if(gltf) {
                if(gltf.scene) {
                    this.mesh = gltf.scene;
                }

                if(gltf.animations) {
                    this.animations = gltf.animations;
                }
                olam.hoyseef(this);
                return true;
            }
        } catch(e) {
            throw e;
        }
        // Implement Domem-specific behavior here
    }
}