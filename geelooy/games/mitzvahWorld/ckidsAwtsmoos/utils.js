/**
 * B"H
 * 
 * Utils
 * 
 * @file a utils file
 * @description utilities for ckids
 */
import * as THREE from '/games/scripts/build/three.module.js';
export default class Utils {
    static getForwardVector(camera, direction) {

        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();
    
        return direction;
    
    }
    
    static getSideVector(camera, direction) {
    
        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();
        direction.cross(camera.up);
    
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

    static stringifyFunctions(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'function') {
                // Add "function" keyword before the function name
                const funcAsString = `function ${obj[key].toString()}`;
                obj[key] = `/*B"H\nThis has been stringified with Awtsmoos!\n*/\n${funcAsString}`;
                console.log("Did it", funcAsString,obj[key])
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                this.stringifyFunctions(obj[key]);
            }
        }
    }

    /* Evaluate stringified Functions */
    static evalStringifiedFunctions(obj) {
        const comment = '/*B"H\nThis has been stringified with Awtsmoos!\n*/\n';
        for (let key in obj) {
            if (typeof obj[key] === 'string' && obj[key].startsWith(comment)) {
                console.log("Yo", obj,key,obj[key])
                obj[key] = eval('(' + obj[key] + ')');
                console.log("did",obj[key],key)
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                this.evalStringifiedFunctions(obj[key]);
            }
        }
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