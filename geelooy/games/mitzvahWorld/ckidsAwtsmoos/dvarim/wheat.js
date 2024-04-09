/*
B"H
*/


import Tzomayach from "../chayim/tzomayach.js";

export default class Wheat extends Tzomayach {
    static iconId = "wheat"
    constructor(op) {
        super(op);
        this.placeholderName = "wheat";
        this.proximity = 0.7;
        
        this.visible = false;//just that which goes over wheat for now
        this.on("nivraNeechnas", nivra => {
            this.ayshPeula("collected", this, nivra);
            this.olam.sealayk(this);
        });
    }
}