/**
 * B"H
 * 
 * Utils
 * 
 * @file a utils file
 * @description utilities for ckids
 */
import * as THREE from '/games/scripts/build/three.module.js';

/**
 * @private {THREE.Vector3} _vector1
 * used for various private vector operations
 */
var _vector1 = new THREE.Vector3();
export default class Utils {
    static getForwardVector(object3D, direction) {

        object3D.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();
    
        return direction;
    
    }
    
    static getSideVector(object3D, direction) {
    
        object3D.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();
        direction.cross(object3D.up);
    
        return direction;
    
    }
    
    static clone(event) {
        if(event instanceof KeyboardEvent) {
            return {
                isTrusted: event.isTrusted,
                key: event.key,
                code: event.code,
                location: event.location,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
                altKey: event.altKey,
                metaKey: event.metaKey,
                repeat: event.repeat,
                isComposing: event.isComposing,
                charCode: event.charCode,
                keyCode: event.keyCode,
                which: event.which,
                type: event.type,
                timeStamp: event.timeStamp
            };
        }

        if(event instanceof MouseEvent) {
            return {
                isTrusted: event.isTrusted,
                screenX: event.screenX,
                screenY: event.screenY,
                clientX: event.clientX,
                clientY: event.clientY,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
                altKey: event.altKey,
                metaKey: event.metaKey,
                movementX: event.movementX,
                movementY: event.movementY,
                button: event.button,
                buttons: event.buttons,
                relatedTarget: event.relatedTarget,
                region: event.region,
                type: event.type,
                timeStamp: event.timeStamp,
                deltaX: event.deltaX,
                deltaY: event.deltaY,
                deltaZ: event.deltaZ,
                deltaMode: event.deltaMode
            };
        }

        if(event instanceof WheelEvent) {

            return {
                isTrusted: event.isTrusted,
                screenX: event.screenX,
                screenY: event.screenY,
                clientX: event.clientX,
                clientY: event.clientY,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
                altKey: event.altKey,
                metaKey: event.metaKey,
                button: event.button,
                buttons: event.buttons,
                relatedTarget: event.relatedTarget,
                region: event.region,
                deltaX: event.deltaX,
                deltaY: event.deltaY,
                deltaZ: event.deltaZ,
                deltaMode: event.deltaMode,
                type: event.type,
                timeStamp: event.timeStamp
            };
        }

        // Return a basic cloned event if not a keyboard or mouse event
        return {
            isTrusted: event.isTrusted,
            type: event.type,
            timeStamp: event.timeStamp
        };
    }

    static replaceMaterialWithLambert(gltf) {
        gltf.scene.traverse((child) => {
            if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {
                let oldMat = child.material;
                let newMat = new THREE.MeshLambertMaterial();
    
                // Copy properties
                newMat.color.copy(oldMat.color);
                newMat.map = oldMat.map;
                newMat.lightMap = oldMat.lightMap;
                newMat.lightMapIntensity = oldMat.lightMapIntensity;
                newMat.aoMap = oldMat.aoMap;
                newMat.aoMapIntensity = oldMat.aoMapIntensity;
                newMat.emissive.copy(oldMat.emissive);
                newMat.emissiveMap = oldMat.emissiveMap;
                newMat.emissiveIntensity = oldMat.emissiveIntensity;
                newMat.specularMap = oldMat.specularMap;
                newMat.alphaMap = oldMat.alphaMap;
                newMat.envMap = oldMat.envMap;
                newMat.combine = oldMat.combine;
                newMat.reflectivity = oldMat.reflectivity;
                newMat.refractionRatio = oldMat.refractionRatio;
                newMat.wireframe = oldMat.wireframe;
    
                // Replace material
                child.material = newMat;
            }
        });
    }

    static getSolid(mesh) {
        
        return this.searchForMesh(
            mesh, "solid"
        );
    }

    static copyObj(obj) {
        if(!obj || typeof(obj) != "object") return obj;
        // Create a new empty object or array depending on the original object
        let objCopy = Array.isArray(obj) ? [] : {};
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                objCopy[key] = this.copyObj(obj[key]);
            } else {
                objCopy[key] = obj[key];
            }
        }
        return objCopy;
    }
    
    static stringifyFunctions(obj) {
        // Create a new empty object or array depending on the original object
        let objCopy = Array.isArray(obj) ? [] : {};
        for (let key in obj) {
            if (typeof obj[key] === 'function') {
                // Add "function" keyword before the function name
                const funcAsString = `function ${obj[key].toString()}`;
                objCopy[key] = `/*B"H\nThis has been stringified with Awtsmoos!\n*/\n${funcAsString}`;

                
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                objCopy[key] = this.stringifyFunctions(obj[key]);
            } else {
                objCopy[key] = obj[key];
            }
        }
        return objCopy;
    }

    /**
     * @function capsuleSphereColliding
     * checks if THREE.Capsule and THREE.Sphere
     * are colliding.
     * @param {THREE.Capsule} capsule
     * @param {THREE.Sphere} sphere 
     * @returns {boolean} 
     * if colliding or not
     */

    static capsuleSphereColliding(capsule, sphere) {
        /**
         * get center of input capsule
         */
        const emtsaCapsule/*center*/ = _vector1.addVectors(
            capsule.start, capsule.end
        );

        const emtsaSphere/*center of sphere*/ =
            sphere.center;

            const radius = capsule.radius + sphere.radius;

            const r2 = radius * radius;

        for(
            const nikooduh/*point*/ of 
            [
                capsule.start,
                capsule.end,
                emtsaCapsule
            ]
        ) {
            const reechook2/*distance squared*/=
                nikooduh.distanceToSquared(
                    emtsaSphere
                );
            if(
                reechook2 < r2
                /**
                 * if the squared distance
                 * is less than the squared radius,
                 * they are colliding.
                 */
            ) {
                return true;
            }
        }

        return false;
    }
    /* Evaluate stringified Functions */
    static evalStringifiedFunctions(obj) {
        // Create a new empty object or array depending on the original object
        let objCopy = Array.isArray(obj) ? [] : {};
    
        const comment = '/*B"H\nThis has been stringified with Awtsmoos!\n*/\n';
        for (let key in obj) {
            if (typeof obj[key] === 'string' && obj[key].startsWith(comment)) {
  
                
                // Use eval to convert stringified function back to function
                objCopy[key] = eval('(' + obj[key] + ')');

                
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                // Recursively copy and evaluate functions in nested objects
                objCopy[key] = this.evalStringifiedFunctions(obj[key]);
            } else {
                // Copy primitive values and non-function references as is
                objCopy[key] = obj[key];
            }
        }
    
        return objCopy;
    }
    


    static searchForMesh(mesh,name) {
        
        if(
            mesh &&
            mesh instanceof THREE.Object3D
        ) {
            var found = null;
            mesh.traverse(child => {
                if(child.name == name) {
                    found = child;
                }
            });
            return found;
        }
        return null;
    }
}