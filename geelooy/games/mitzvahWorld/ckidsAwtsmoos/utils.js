/**
 * B"H
 * 
 * Utils
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
            console.log("wheely",event)
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
}