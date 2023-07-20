/**
 * B"H
 * @file nivra.js
 * Nivra class
 */
import {
    Kav, Heeoolee
} from "./roochney.js"

export default class Nivra extends Heeoolee{
    /**
     * Constructs a new Nivra.
     * 
     * a Nivra doesn't necessarily have a model or path, can
     * be abstract
     * @param {string} name The name of the nivra.
     * 
     * @property {String} type the type of the creation, "domem" etc.
     * @property {Object} serialized The basic object form of data of 
     *  Nivra, used for importing, exporting and transferring data
     * without including methods etc.
     */
    type = "nivra";
    serialized = {};
    constructor(name) {
        super();
        this.name = name;
    }

    async ready() {

    }
    serialize() {
        this.serialized = {
            ...this.serialized,
            name: this.name
        };
        return this.serialized;
    }
    /**
     * Starts the nivra. This function can be overridden by subclasses to provide
     * nivra-specific behavior.
     * 
     * @param {Olam} olam The world in which this nivra is being started.
     */
    async heescheel(olam) {
       this.ayshPeula("heescheel", this);
        // This can be overridden by subclasses
    }

    
    heesHawvoos(deltaTime) {
        //this.ayshPeula("heesHawvoos", this);
    }
}
