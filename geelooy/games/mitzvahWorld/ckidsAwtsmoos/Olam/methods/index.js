/**
 * B"H
 * 
 * helper methods for Olam
 */
import loading from "./loading.js"
import entityLogic from "./entityLogic.js";
import hebrewLetters from "./hebrewLetters.js"
import heesHawvoos from "./heesHawvoos.js";
import canvasSetup from "./canvasSetup.js";
import ohr from "./ohr.js";
import boyrayNivra from "./boyrayNivra.js";
import helpers from "./helpers.js"
import loadNivrayim from "./loadNivrayim.js";
import tzimtzum from "./tzimtzum.js";
import placeholderAndEntities
from "./placeholderAndEntities.js";

import hoyseef from "./hoyseef.js";
import sealayk from "./sealayk.js"


import properties from "./properties.js";
export default function() {
    var classTransfer = (classDef) => {
        Object.getOwnPropertyNames(classDef.prototype)
            .forEach(w => {
               
                if(w != "constructor") {
                    this[w] = classDef.prototype[w]?.bind(this) 
                }
                

            })
    }

    classTransfer(hoyseef);
    classTransfer(boyrayNivra);
    classTransfer(loadNivrayim);
    classTransfer(tzimtzum);
    classTransfer(placeholderAndEntities);
    classTransfer(loading);
    classTransfer(entityLogic);
    classTransfer(hebrewLetters);
    classTransfer(heesHawvoos);
    classTransfer(canvasSetup);
    classTransfer(ohr);
    classTransfer(helpers);
    classTransfer(sealayk);

    /**
     * transfer properties by making new instance
     */
    var inst = new properties();
    Object.getOwnPropertyNames(inst)
    .forEach(w => {
        this[w] = inst[w];
    })
    
}