/**
 * B"H
 */

import * as THREE from '/games/scripts/build/three.module.js';
export default class RainEffect {
    timeElapsed = 0; /*in seconds, float precision*/
    startTime = Date.now()
    constructor({
        scene, 
        boundingBox, 
        density = 0.13,
        dropSpeed=10,
        dropLength=0.05,
    }) {
        this.scene = scene;
        this.boundingBox = boundingBox;
        this.density = density;
        this.isRaining = true;
        this.dropSpeed = dropSpeed||8.0; // Increase for faster rain
        this.dropLength = dropLength||0.1; // Decrease for shorter raindrops
        this.initRain({
            start: Date.now()
        });
    }
    started = false;

    initRain({
        start /**
        started milliseconds timestamp
         */
    }) {
        if(!start) {
            start = Date.now()
        }
        this.startTime = start;
        this.timeElapsed = (Date.now() - start) / 1000;
        if(!this.started) {
            this.started = true;
            // Calculate the volume of the bounding box to adjust the number of raindrops based on the desired density
            const volume = (this.boundingBox.max.x - this.boundingBox.min.x) * 
                        (this.boundingBox.max.y - this.boundingBox.min.y) * 
                        (this.boundingBox.max.z - this.boundingBox.min.z);
            const raindropCount = Math.ceil(volume * this.density); 

            const vertices = new Float32Array(raindropCount * 6); // Two vertices per line, three components per vertex

            const indices = new Float32Array(raindropCount * 2); // One index for each vertex in a raindrop

            const raindropIdentifiers = new Float32Array(raindropCount * 2); // Two vertices per raindrop


            for (let i = 0; i < raindropCount; i++) {
                const x = THREE.MathUtils.randFloat(this.boundingBox.min.x, this.boundingBox.max.x+1);
                const y = THREE.MathUtils.randFloat(this.boundingBox.min.y, this.boundingBox.max.y+1);
                const z = THREE.MathUtils.randFloat(this.boundingBox.min.z, this.boundingBox.max.z+1);
                const length = this.dropLength;

                // Start vertex
                vertices[i * 6] = x;
                vertices[i * 6 + 1] = y;
                vertices[i * 6 + 2] = z;
                // End vertex
                vertices[i * 6 + 3] = x; // Same x to keep the raindrop vertical
                vertices[i * 6 + 4] = y;// - length; // y - length to make the line vertical and downwardsß
                vertices[i * 6 + 5] = z; // Same z

                // Assign indices
                indices[i * 2] = i * 2;     // Index for the start vertex
                indices[i * 2 + 1] = i * 2 + 1; // Index for the end vertex (assuming lines, so every pair is a new raindrop)
                raindropIdentifiers[i * 2] = i;
                raindropIdentifiers[i * 2 + 1] = i;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geometry.setAttribute('vertexIndex', new THREE.BufferAttribute(indices, 1)); // Add this line
            // Add the identifier as an attribute to your geometry
            geometry.setAttribute('raindropIdentifier', new THREE.BufferAttribute(raindropIdentifiers, 1));
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0.0 },
                    boundingBoxMinY: { value: this.boundingBox.min.y },
                    currentTime: {value: 0},
                    boundingBoxMaxY: { value: this.boundingBox.max.y },
                    dropSpeed: { value: this.dropSpeed }, // Use the class property
                    dropLength: { value: this.dropLength }, // Use the class property
                },
                vertexShader: /*glsl*/`
                uniform float dropSpeed;          // Speed of raindrops falling
                uniform float boundingBoxMinY;    // Minimum Y coordinate of bounding box
                uniform float boundingBoxMaxY;    // Maximum Y coordinate of bounding box
                uniform float currentTime;        // Current time in seconds
                uniform float dropLength;         // Length of each raindrop
                attribute float vertexIndex;
                void main() {
                    vec3 originalPosition = position.xyz;
                    float totalDistance = boundingBoxMaxY - boundingBoxMinY;

                    // Create a unique offset for each raindrop based on its original Y position
                    // This uses the Y position to influence the phase of the raindrop's falling animation
                    float positionOffset = (originalPosition.y - boundingBoxMinY) / totalDistance;

                    // Calculate drop offset for looping effect, incorporating positionOffset
                    // The positionOffset ensures that each raindrop's reset timing is slightly different
                    float dropOffset = mod(currentTime * dropSpeed + positionOffset, totalDistance);

                    bool isTop = mod(vertexIndex, 2.0) == 0.0;
                    
                    // Apply offset to Y position
                    float newYPosition = originalPosition.y - dropOffset;
                    if(!isTop) {
                        newYPosition -= dropLength;

                    }

                    if(isTop) {
                        // Adjust newYPosition to ensure it wraps correctly within the bounding box
                        if (newYPosition < boundingBoxMinY) {
                            newYPosition += totalDistance;
                        }
                    } else if(newYPosition < boundingBoxMinY - dropLength) {
                        newYPosition += totalDistance;
                    }

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(originalPosition.x, newYPosition, originalPosition.z, 1.0);
                }


                `,
                fragmentShader: /*glsl*/`
                    void main() {
                        gl_FragColor = vec4(0.67, 0.84, 0.90, 0.5); // Light blue color, semi-transparentaw 
                    }
                `,
                transparent: true,
                depthTest: true,
                depthWrite: false, // Consider setting this to false for transparent objects
            });

            console.log("Set unfiormes",material.uniforms)

            this.rain = new THREE.LineSegments(geometry, material);
            this.scene.add(this.rain);
        } else {
            if(this.rain) {
                this.rain.visible = true;
            }
        }
    }

    stop() {
        this.isRaining = false;
        if(this.rain) {
            this.rain.visible = false;
        }
    }

    update(deltaTime) {
        if (!this.isRaining) return;
        this.timeElapsed = (Date.now() - this.startTime) / 1000;
        
        this.rain.material.uniforms.currentTime.value = this.timeElapsed;
        //console.log("Time elapsed", this.timeElapsed, this.rain.material.uniforms.currentTime,
        /*
        this.boundingBox.min.y,
        this.boundingBox.max.y
        )*/
    }
}