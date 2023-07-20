/**
 * B"H
 */


import Tzomayach from "./tzomayach.js";
import * as THREE from '/games/scripts/build/three.module.js';
import Utils from "../utils.js";
export default class Chai extends Tzomayach {
    rotationSpeed;
    velocity = new THREE.Vector3();
    constructor(options) {
        super(options);
        this.rotationSpeed = options
            .rotationSpeed || 2;
        // Additional properties can be set here
    }

    async heescheel(olam) {
        super.heescheel(olam);
        // Implement Chai-specific behavior here
    }

    async ready() {
        await super.ready();
        var solid = Utils.getSolid(this.mesh);
        if(solid) {
            console.log("got solid!",solid);
            solid.visible = false;
        }
    }

    heesHawvoos(deltaTime) {
        super.heesHawvoos(deltaTime);
    }
}

