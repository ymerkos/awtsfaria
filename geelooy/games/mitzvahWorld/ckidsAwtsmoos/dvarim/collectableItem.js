/**
 * B"H
 */


import Tzomayach from "../chayim/tzomayach.js";

export default class CollectableItem extends Tzomayach {
    constructor(op) {
        super(op);
        this.proximity = 0.7;
        this.on("nivraNeechnas", nivra => {
            this.ayshPeula("collected", this, nivra);
            this.olam.sealayk(this);
        });
    }
}