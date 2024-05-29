/**
 * B"H
 * method for setting up inital proper lighting in the scene
 */
import * as THREE from '/games/scripts/build/three.module.js';
export default class {
    ohr()/*light*/{
        var lights = new THREE.Group();
        this.lights = lights;
        this.enlightened = true;
    
        // High quality ambient light for subtle background illumination
        var ambientLight = new THREE.AmbientLight(0xffe8c3, 0.3);
        this.scene.add(ambientLight);
    
        // Key light with warm tone, soft shadow, and dynamic falloff for realism
        var keyLight = new THREE.DirectionalLight(0xffd1a3, 1.5);
        keyLight.layers.enable(2)
        /*keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;  // Improved resolution for detailed shadows
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.camera.near = this.camera.near;
        keyLight.shadow.camera.far = this.camera.far;
        keyLight.position.set(-5, 25, -1);
        keyLight.shadow.bias = -0.0005;*/
    
        // Enhanced shadow frustum settings for more accurate shadow casting
        var frustumSize = 75;
        /*keyLight.shadow.camera.right = frustumSize;
        keyLight.shadow.camera.left = -frustumSize;
        keyLight.shadow.camera.top = frustumSize;
        keyLight.shadow.camera.bottom = -frustumSize;
        keyLight.shadow.radius = 4; // Softened shadow edges*/
        this.lights.add(keyLight);
    
        // Fill light to balance the shadows with a cooler tone for depth
        var fillLight = new THREE.HemisphereLight(0xffe8d6, 0x8d6e63, 0.5);
        fillLight.position.set(2, 1, 1);
        this.lights.add(fillLight);
        fillLight.layers.enable(2)
        // Rim light to enhance edge lighting and create a three-dimensional look
        var rimLight = new THREE.SpotLight(0xffe8d6, 0.75);
        rimLight.position.set(-3, 10, -10);
        rimLight.angle = Math.PI / 6;
        rimLight.penumbra = 0.5;
        rimLight.decay = 2;
        rimLight.distance = 100;
        this.lights.add(rimLight);
        rimLight.layers.enable(2)
        // Backlight to create depth and separate objects from the background
        var backLight = new THREE.SpotLight(0xffffff, 0.5);
        backLight.position.set(5, 10, 10);
        backLight.angle = Math.PI / 6;
        backLight.penumbra = 0.5;
        backLight.decay = 2;
        backLight.distance = 100;
        this.lights.add(backLight);
        backLight.layers.enable(2)
        this.lights.layers.enable(2)
        // Optional: Add practical lights to enhance the scene's ambiance
        // Example: Soft glowing lights to simulate environmental light sources
        this.scene.add(this.lights)
        this.ohros.push(keyLight, fillLight, rimLight, ambientLight, backLight);
    }
}