/**
 * B"H
 * @file nivra.js
 * Nivra class
 */
import {
    Kav, Heeoolee
} from "./roochney.js"
var nivrayimMade = 0;
export default class Nivra extends Heeoolee{
    /**
     * varructs a new Nivra.
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
    isReady = false;
    type = "nivra";
    serialized = {};
    constructor(options) {
        super();
        if(!options) options = {};
        this.name = options.name || "nivra_" + (nivrayimMade++);
      
        this.shlichus = options.shlichus || null;
        this.placeholderName = options
            .placeholderName || this.name;
        if(typeof(options.on) == "object") {
            Object.keys(options.on).forEach(q=>{
                if(typeof(options.on[q]) == "function") 
                    this.on(q, options.on[q]);

                    
            });
        }
        

    }

    async ready() {
        this.ayshPeula("ready", this);
        this.isReady = true;
    }
	
	async afterBriyah() {
		this.ayshPeula("afterBriyah", this)
		
	}

    async hasShlichus() {
        var d = this?.dialogue?.shlichuseem;
        var res = await this.olam.ayshPeula(
            "is shlichus available", d
        )
        return res;
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
        
        
    }
}
