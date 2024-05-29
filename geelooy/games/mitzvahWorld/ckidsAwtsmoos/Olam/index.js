/**
 * B"H
 * The Olam class represents a 3D World or "Scene" in a game.
 * @extends AWTSMOOS.Nivra
 * @param {Object} options The configuration data for the Olam.
 */


/**
 * get methods
 */

import eventListeners from "./eventListeners/index.js";
import methods from "./methods/index.js";

import GrassMaterial from "./materials/Grass.js"
import * as THREE from '/games/scripts/build/three.module.js';
import * as AWTSMOOS from '../awtsmoosCkidsGames.js';




import Ayin from "./ckidsCamera.js";





//import AwtsmoosRaysShader from "./shaders/AwtsmoosRaysShader.js";





/*
used to match return
events
*/


var ID = Date.now();


/**
 * @class Olam
 * @description
 *
 * The 'Olam' class is a living manifestation of the world, a canvas painted by the Awtsmoos.
 * Its landscapes are vibrant with life, its horizons stretch beyond the ordinary,
 * and within its core resides the ShlichusHandler, a divine conductor orchestrating the shlichuseem (quests).
 *
 * The ShlichusHandler is not merely an attribute; it's the soul of the Olam,
 * a spark of the infinite, ready to guide players on a journey towards the essence of the Creator.
 *
 * @example
 * var olam = new Olam();
 * olam.startShlichusHandler(); // Awakens the ShlichusHandler
 * olam.shlichusHandler.createShlichus(data); // Creates a new shlichus
 */
export default class Olam extends AWTSMOOS.Nivra {

    /**

    set imported methods to self

    **/
    ASPECT_X = 1920;
    ASPECT_Y = 1080;
    
    official = "official"//can be other shared code
    styled = false;

    
    GrassMaterial = GrassMaterial

    

    /**
     * @property activeCamera
     * @description if set,
     * then instead of using 
     * default ayin.camera,
     * it uses this. 
     */
    _activeCamera = null;
    get activeCamera () {
        return this._activeCamera;
    }

    

    set activeCamera(v) {
        this._activeCamera = v;
        this.refreshCameraAspect();
    }
    constructor() {
        super();
        var self = this;
        try {
            /**
             * helper methods
             */

            methods.bind(this)();
            eventListeners.bind(this)();

            this.ayin = new Ayin(this);
            this.ayin.camera.far = 150;
            this.scene.background = new THREE.Color(0x88ccee);
            this.nivrayimGroup.name = "nivrayimGroup"

            this.scene.add(this.nivrayimGroup)
            this.scene.fog = new THREE.Fog(0x88ccee,
            this.ayin.camera.near, this.ayin.camera.far);
            this.startShlichusHandler(this);

        } catch(e) {

            console.log("Error",e)
            this.ayshPeula("error", {
                code: "constructor_WORLD_PROBLEM",
                details: e,
                message: "An issue happened in the constructor of the "
                +"Olam class, before even starting to load anything."
            })
        }
    }

    get camera() {
        return this.activeCamera || this.ayin.camera ;
    }

    
    
    

    


    set pixelRatio(pr) {
        if(!pr) return;
        if(!this.renderer) return;
        this.renderer.setPixelRatio(pr);
        
    }
}
