/**
 * B"H
 * @file coin.js
 * a coin / perutah, for collecting.
 */

import Domem from "../chayim/domem.js";
export default class Coin extends Domem {
    rotationSpeed = 0.01;
    constructor(op) {
        console.log("I did it");
        op.golem = {
            guf: { 
                CylinderGeometry: [2, 2, 1, 8, 1]
            },
            toyr: {
                MeshLambertMaterial: { color: "gold" }
            }
        };
       
        super(op);
        if(op.rotationSpeed)
            this.rotationSpeed = op.rotationSpeed;

        this.heesHawveh = true;
        this.on("heesHawvoos", me => {
            me.mesh.rotation.y += this.rotationSpeed;
        });

        this.on("ready", me => {
            this.mesh.scale.copy({x:0.25,y:0.25,z:0.25});
            this.mesh.rotation.z = 90 * Math.PI / 180;
        });
    }

   
}