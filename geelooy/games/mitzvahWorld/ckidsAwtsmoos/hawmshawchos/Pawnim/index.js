/*
    B"H
    Pawnim means "face"

    
*/
import Peh from "./peh/index.js";
export default class Pawnim {
    constructor(nivra) {
        this.nivra = nivra;
        this.peh = new Peh(nivra);
    }

    
}