/**
 * B"H
 * @file coin.js
 * a coin / perutah, for collecting.
 */

import Tzomayach from "../chayim/tzomayach.js";
export default class Coin extends Tzomayach {
    rotationSpeed = 0.01;
    type= "coin";
    constructor(op) {
        var isBeingCollected = false;
        op.golem = {
            guf: { 
                CylinderGeometry: [2, 2, 1, 8, 1]
            },
            toyr: {
                MeshLambertMaterial: { color: "gold" }
            }
        };
       
        super(op);
        this.proximity = 0.5;

        if(op.rotationSpeed)
            this.rotationSpeed = op.rotationSpeed;

        this.heesHawveh = true;
        this.on("heesHawvoos", me => {
            if(!isBeingCollected) {
                me.mesh.rotation.y += this.rotationSpeed;
            } else {
                me.mesh.scale.x -= 0.001;
                if(me.mesh.scale.x < 0) {
                    var r = me.olam.sealayk(me);
                    console.log("removed", r)
                }
            }
        });

        this.on("ready", me => {
            this.mesh.scale.copy({x:0.25,y:0.25,z:0.25});
            this.mesh.rotation.z = 90 * Math.PI / 180;
        });

        this.on("nivraNeechnas", nivra => {
            console.log("Nivra!", nivra)
            if(!isBeingCollected) {
                isBeingCollected = true;
            }
        });
    }

   
}