/**
 * B"H
 * 
 * Utils
 * 
 * @file a utils file
 * @description utilities for ckids
 */



import * as AWTSMOOS from "../ckidsAwtsmoos/awtsmoosCkidsGames.js";

import * as THREE from '/games/scripts/build/three.module.js';
var IDs = 0;
/**
 * @private {THREE.Vector3} _vector1
 * used for various private vector operations
 */

export default class Utils {
    static getForwardVector(object3D, direction) {
        /**
         * Make sure to use a DIFFERENT
         * direction vector for forward and 
         * side or else it will get messed up
         */
        var dir = direction;
        object3D.getWorldDirection(dir).clone();
        dir.y = 0;
        dir.normalize();
    
        return dir;
    
    }
    
    static getSideVector(object3D, direction) {
        var dir = direction;
        object3D.getWorldDirection(dir).clone();
        dir.y = 0;
        dir.normalize();
        dir.cross(object3D.up);
    
        return dir;
    
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

        if(event instanceof Touch) {
            return {
                
                screenX: event.screenX,
                screenY: event.screenY,
                clientX: event.clientX,
                clientY: event.clientY,
                radiusX: event.radiusX,
                radiusY: event.radiusY,
                deltaX: event.screenX,
                deltaY: event.screenY
            }
        }
        // Return a basic cloned event if not a keyboard or mouse event
        return {
            
        };
    }

    static replaceMaterialsWithLambert(gltf) {
        gltf.scene.traverse((child) => {
            replaceMaterialWithLambert(child)
        });
    }

    static replaceMaterialWithLambert(mesh) {
        if (mesh.isMesh && mesh.material instanceof THREE.MeshStandardMaterial) {
            let oldMat = mesh.material;
            let newMat = new THREE.MeshLambertMaterial();
            Object.keys(oldMat)
            .forEach(k => {
                newMat[k] = oldMat[k]
            });
            /*
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
            */
            // Replace material
            mesh.material = newMat;
            return newMat;
        }

        return null;
        
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
                var s = obj[key] +"";
                s = s.trim();

                var hasF = s.indexOf("function") == 0 
                
                 
                var funcAsString = hasF ? s : `function ${s}`;

                objCopy[key] = `/*B"H\nThis has been stringified with Awtsmoos!\n*/\n${funcAsString}`;
                
                
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                objCopy[key] = this.stringifyFunctions(obj[key]);
            } else {
                objCopy[key] = obj[key];
            }
        }
        return objCopy;
    }

    static generateID() {
        return "BH_"+
        Date.now() + "_"
        +(IDs++);
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
		 
		var _vector1 = new THREE.Vector3();
        var direction = new THREE.Vector3().subVectors(capsule.end, capsule.start);
        var halfDirection = direction.multiplyScalar(0.5);
        var emtsaCapsule = _vector1.addVectors(capsule.start, halfDirection);

        var emtsaSphere/*center of sphere*/ =
            sphere.center;

            var radius = capsule.radius + sphere.radius;

            var r2 = radius * radius;

		var ar = [
                capsule.start,
                capsule.end,
                emtsaCapsule
            ]
        for(
            var nikooduh/*point*/ of 
            ar
        ) {
            var reechook2/*distance squared*/=
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
        var objCopy = null;
        
            // Create a new empty object or array depending on the original object
            objCopy = Array.isArray(obj) ? [] : {};
        
            var comment = '/*B"H\nThis has been stringified with Awtsmoos!\n*/\n';
            for (let key in obj) {
                var evaled = '(' + obj[key] + ')'
                try {
                    if (typeof obj[key] === 'string' && obj[key].startsWith(comment)) {
        
                        
                        // Use eval to convert stringified function back to function
                        objCopy[key] = eval(evaled);

                        
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        // Recursively copy and evaluate functions in nested objects
                        objCopy[key] = this.evalStringifiedFunctions(obj[key]);
                    } else {
                        // Copy primitive values and non-function references as is
                        objCopy[key] = obj[key];
                    }
                } catch(e) {
                    console.log("key in fucntion problem", e, evaled)
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