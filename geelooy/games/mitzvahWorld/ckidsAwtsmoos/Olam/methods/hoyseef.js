/**
 * B"H
 * The Hoyseef method
 * The method 'hoyseef' adds a given "nivra" (which is an object) to the scene, if the "nivra" object has a 
    * 'mesh' property that is an instance of 'THREE.Object3D'. It also adds the "nivra" to the 'nivrayim' array.
    *
    * @param {object} nivra - The object to be added to the scene. It should have a 'mesh' property that is an 
    * instance of 'THREE.Object3D'.
    * @returns {object|null} The added object, or null if the object could not be added.
    *
    * @example
    * var myNivra = { mesh: new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()) };
    * var addedNivra = await hoyseef(myNivra);
 */
import * as THREE from '/games/scripts/build/three.module.js';

export default class {
   
    async hoyseef(nivra) {
        var three;
        if(nivra && nivra.mesh  instanceof THREE.Object3D) {
            three = nivra.mesh;
        } else return null;


        this.nivrayimGroup.add(three);
        
        this.nivrayim.push(nivra);
        this.nivrayimBeforeLoad.push(nivra);
        if(nivra.isSolid) {
            this.ayin.objectsInScene.push(three);
        }
       

        

        return nivra;
    }
}