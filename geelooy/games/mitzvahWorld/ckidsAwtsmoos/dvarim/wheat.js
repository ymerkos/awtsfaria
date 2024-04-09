/*
B"H
*/


import CollectableItem from "../chayim/collectableItem.js";

export default class Wheat extends CollectableItem {
    static iconId = "wheat"
    constructor(op) {
        super(op);
        this.placeholderName = "wheat";
    }
}