/**
 * B"H
 */

import * as THREE from '/games/scripts/build/three.module.js';
export default class RainEffect {
    timeElapsed = 0; /*in seconds, float precision*/
    startTime = Date.now()
    constructor({
        scene, 
        boundingBox, 
        density = 0.13,
        dropSpeed=10,
        dropLength=0.05,
    }) {
        this.scene = scene;
        this.boundingBox = boundingBox;
        this.density = density;
        this.isRaining = true;
        this.dropSpeed = dropSpeed||8.0; // Increase for faster rain
        this.dropLength = dropLength||0.1; // Decrease for shorter raindrops
        this.initRain({
            start: Date.now()
        });
    }
    started = false;

    initRain({
        start /**
        started milliseconds timestamp
         */
    }) {
        if(!start) {
            start = Date.now()
        }
        this.startTime = start;
        this.timeElapsed = (Date.now() - start) / 1000;
        if(!this.started) {
            this.started = true;
            

           // this.rain = new THREE.LineSegments(geometry, material);
           // this.scene.add(this.rain);
        } else {
            if(this.rain) {
                this.rain.visible = true;
            }
        }
    }

    stop() {
        this.isRaining = false;
        if(this.rain) {
            this.rain.visible = false;
        }
    }

    update(deltaTime) {
        if (!this.isRaining) return;
        this.timeElapsed = (Date.now() - this.startTime) / 1000;
        
        this.rain.material.uniforms.currentTime.value = this.timeElapsed;
        //console.log("Time elapsed", this.timeElapsed, this.rain.material.uniforms.currentTime,
        /*
        this.boundingBox.min.y,
        this.boundingBox.max.y
        )*/
    }
}