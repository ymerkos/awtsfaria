/**
 * B"H
 * @file tzomayaach.js
 * for now: things affected by 
 * physics like falling colliding etc.
 */

import Domem from "./domem.js";
export default class Tzomayach extends Domem {
    type = "tzomayach";
    
    constructor(options) {
        super(options);
        
        // Additional properties can be set here
    }

    async heescheel(olam) {
        super.heescheel(olam);
        // Implement Tzomayach-specific behavior here
    }

    async ready() {
        await super.ready();
        
    }
    

    heesHawvoos(deltaTime) {
        super.heesHawvoos(deltaTime);
        
    }
}