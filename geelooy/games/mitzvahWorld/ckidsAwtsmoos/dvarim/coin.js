/**
 * B"H
 * @file coin.js
 * a coin / perutah, for collecting.
 */

import Tzomayach from "../chayim/tzomayach.js";
export default class Coin extends Tzomayach {
    rotationSpeed = 0.01;
    type= "coin";
    static iconId = "coin";
    iconItem = Coin.iconId;
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
                    
                }
            }
        });

        this.on("ready", me => {
            this.mesh.scale.copy({x:0.25,y:0.25,z:0.25});
            this.mesh.rotation.z = 90 * Math.PI / 180;
        });

        this.on("nivraNeechnas", nivra => {
            if(!isBeingCollected) {
                isBeingCollected = true;
                this.ayshPeula("collected", this, nivra);
            }
        });

   
        this.placeholderName="coin",
        
        this.on("collected", (n) =>{
            n.playSound("awtsmoos://dingSound", {
                layerName: "audio effects layer 1",
                loop: false
            });
        })
    
    }

   
}