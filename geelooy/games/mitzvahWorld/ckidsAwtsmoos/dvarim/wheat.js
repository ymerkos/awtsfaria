/*
B"H
*/


import CollectableItem from "./collectableItem.js";

export default class Wheat extends CollectableItem {
    static iconId = "wheat"
    constructor(op) {
        super(op);
        this.placeholderName = "wheat";
        this.iconItem = Wheat.iconId;
    }
}