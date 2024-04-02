/**
 * B"H
 * 
 * environment manager 
 * for weather and other effects to happen in the game
 */
import * as THREE from '/games/scripts/build/three.module.js';
import RainEffect from "./rain.js";
export default class Environment {
    raindropsGroup = new THREE.Group();
    isRaining = false;
    cloudsGroup = new THREE.Group();
    originalLighting = null;
    groupBoundingBox = null;
    raindropBufferGeometry = null;
    constructor({ scene, renderer, camera }) {
        this.scene = scene;
        this.renderer=renderer;
        this.camera = camera;
    }

    modifyLighting(on) {
        if(on) {
            if(!this.scene) return;

            this.originalColors = {
                fog: this.scene.fog.color.clone(),
                background: this.scene.background.clone()
            }

            this.scene.fog.color.set("#1b315c");
            this.scene.background.set("#2f4875")
            this.originalLighting = {};
        
            this.scene.traverse(child => {
                if (child instanceof THREE.Light) {
                    const lightId = child.uuid;
                    const originalLight = child.clone();
                    this.originalLighting[lightId] = originalLight;
        
                    switch (child.type) {
                        case 'AmbientLight':
                            child.intensity *= 0.2;
                            break;
                        default:
                            break;
                    }
                }
            });
        
            this.scene.userData.originalLighting = this.originalLighting;
        } else {
            this.scene.traverse(child => {
                if (child instanceof THREE.Light) {
                    const lightId = child.uuid;
                    const originalLight = this.originalLighting[lightId];
                    if (originalLight) {
                        this.scene.remove(child);
                        this.scene.add(originalLight.clone());
                    }
                }
            });


            this.scene.fog.color.set(
                "#"+this.originalColors.fog.getHexString()
            )
            this.scene.background.set(
                "#"+this.originalColors.background.getHexString()
            )
        }
    }

    startRain() {
        if (!this.scene || this.isRaining) return;


        const nivrayimGroup = this.scene.getObjectByName('nivrayimGroup');
        
        if (!nivrayimGroup) {
            console.error("nivrayimGroup not found in the scene.");
            return;
        }

        if(!this.groupBoundingBox)
            // Assume calculateGroupBoundingBox somehow calculates the bounding box for the rain effect area
            this.groupBoundingBox = this.calculateGroupBoundingBox(nivrayimGroup); // You need to define or update this method

        if (!this.groupBoundingBox) {
            console.error("Bounding box for rain not set.");
            return;
        }

        this.modifyLighting(true)
        if(!this.rainEffect)
            // Initialize RainEffect with the scene and bounding box
            this.rainEffect = new RainEffect({
                scene: this.scene, 
                renderer: this.renderer,
                camera: this.camera,
                boundingBox: this.groupBoundingBox
            });
        else {
            this.rainEffect.initRain({
                start: Date.now()
            })
        }
        this.isRaining = true;
    }


    calculateGroupBoundingBox(group) {
        if (!group) return null;

        const boundingBox = new THREE.Box3();

        group.traverse(child => {
            if (child instanceof THREE.Mesh) {
                boundingBox.expandByObject(child);
            }
        });

        return boundingBox;
    }

    stopRain() {
        if (!this.isRaining || !this.rainEffect) return;

        // Assuming RainEffect class has a method to clean up or remove the rain effect from the scene
        this.rainEffect.stop(); // You need to implement this method in RainEffect or handle cleanup here
        this.modifyLighting(false)
        this.rainEffect = null;
        this.isRaining = false;
    }

    update(d) {
        if (!this.isRaining || !this.rainEffect) return;
        return this.rainEffect.update(d)
    }
}
