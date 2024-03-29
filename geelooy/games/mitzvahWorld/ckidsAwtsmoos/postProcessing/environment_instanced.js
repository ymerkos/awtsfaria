/**
 * B"H
 * 
 * environment manager 
 * for weather and other effects to happen in the game
 */
import * as THREE from '/games/scripts/build/three.module.js';
import RainEffect from "/ckidsAwtsmoos/postProcessing/rain.js";
export default class Environment {
    raindropsGroup = new THREE.Group();
    isRaining = false;
    cloudsGroup = new THREE.Group();
    originalLighting = null;
    groupBoundingBox = null;
    raindropBufferGeometry = null;
    numberOfRaindrops = 6666; // Adjust based on desired density
    constructor({ scene }) {
        this.scene = scene;
    }

    startRain() {
        if (!this.scene || this.isRaining) return;

        const nivrayimGroup = this.scene.getObjectByName('nivrayimGroup');
        
        if (!nivrayimGroup) {
            console.error("nivrayimGroup not found in the scene.");
            return;
        }

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
    
        const numClouds = 5;
        const cloudGeometry = new THREE.SphereGeometry(10, 32, 32);
        const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd, transparent: true, opacity: 0.7 });
    
        this.groupBoundingBox = this.calculateGroupBoundingBox(nivrayimGroup);
        const topY = this.groupBoundingBox.max.y;
    
        for (let i = 0; i < numClouds; i++) {
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                THREE.MathUtils.randFloat(this.groupBoundingBox.min.x, this.groupBoundingBox.max.x),
                THREE.MathUtils.randFloat(topY + 10, topY + 30),
                THREE.MathUtils.randFloat(this.groupBoundingBox.min.z, this.groupBoundingBox.max.z)
            );
            this.cloudsGroup.add(cloud);
        }
    
        this.raindropsGroup.add(this.cloudsGroup);
        this.scene.add(this.raindropsGroup);
    
        this.isRaining = true;
        this.addRaindrops();
    }

    stopRain() {
        if (!this.isRaining) return;

        this.scene.traverse(child => {
            if (child instanceof THREE.Light) {
                const lightId = child.uuid;
                const originalLight = this.originalLighting[lightId];
                if (originalLight) {
                    this.scene.remove(child);
                    this.scene.add(originalLight.clone());
                }
            }
        })
        
        this.raindropsGroup.remove(this.cloudsGroup);
        this.cloudsGroup.clear();
        this.raindropsGroup.clear();
        this.scene.remove(this.raindropsGroup);
        
        this.isRaining = false;
        this.groupBoundingBox = null;
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

    addRaindrops() {
        if (!this.groupBoundingBox) return;
    
        // Geometry for raindrop shape, using ConeGeometry for a better raindrop effect
        const geometry = new THREE.ConeGeometry(0.02, 0.1, 8); // Dimensions for a raindrop shape
        //geometry.rotateX(Math.PI / 2); // Adjusting the rotation here
    
        // Correct the orientation to make the raindrop vertical
        // Previously rotated on X-axis, which might have made it horizontal.
        // Rotating on Y-axis to correct the orientation
        geometry.rotateY(Math.PI / 2); // This rotation will make the geometry stand vertical
    
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
        const numberOfRaindrops = 54254; // Adjust as needed
    
        this.raindropInstance = new THREE.InstancedMesh(geometry, material, numberOfRaindrops);
        this.raindropInstance.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    
        const { min, max } = this.groupBoundingBox;
        for (let i = 0; i < numberOfRaindrops; i++) {
            const position = new THREE.Vector3(
                THREE.MathUtils.randFloat(min.x, max.x),
                THREE.MathUtils.randFloat(min.y, max.y),
                THREE.MathUtils.randFloat(min.z, max.z)
            );
    
            const matrix = new THREE.Matrix4();
            matrix.setPosition(position);
            this.raindropInstance.setMatrixAt(i, matrix);
        }
    
        this.raindropInstance.instanceMatrix.needsUpdate = true;
        this.raindropsGroup.add(this.raindropInstance);
    }

    updateRaindrops() {
        const gravity = -0.1; // Example gravity effect
        const maxGrav = -0.7;
        for (let i = 0; i < this.raindropInstance.count; i++) {
            const matrix = new THREE.Matrix4();
            this.raindropInstance.getMatrixAt(i, matrix); // Get the current matrix
            
            const position = new THREE.Vector3();
            position.setFromMatrixPosition(matrix); // Extract position from the matrix
            position.y += gravity; // Apply gravity effect
            
            if (position.y < -50) { // Reset position if below a certain threshold
                position.y = 50;
            }
            
            matrix.setPosition(position); // Update the matrix with the new position
            this.raindropInstance.setMatrixAt(i, matrix); // Set the updated matrix
        }
      //  console.log("Set",this.raindropInstance.instanceMatrix)
        this.raindropInstance.instanceMatrix.needsUpdate = true; // Inform THREE.js that the matrices have been updated
    }

    update() {
        if (!this.isRaining || !this.raindropInstance) return;
        this.updateRaindrops();

        this.raindropInstance.instanceMatrix.needsUpdate = true;
    }
}
