/**
 * B"H
 */

import * as THREE from 'three';
import * as THREE from 'three';

export default class HeightMapGenerator {
    constructor(mesh, scene, mapWidth = 512, mapHeight = 512) {
        this.mesh = mesh;
        this.scene = scene;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.orthoCamera = null;
        this.renderTarget = null;
        this.heightMap = null;
        this.renderer = new THREE.WebGLRenderer();

        this.init();
    }

    init() {
        this.setupCamera();
        this.setupRenderTarget();
        this.generateHeightMap();
    }

    setupCamera() {
        const boundingBox = new THREE.Box3().setFromObject(this.mesh);
        const size = boundingBox.getSize(new THREE.Vector3());
        const aspect = this.mapWidth / this.mapHeight;

        this.orthoCamera = new THREE.OrthographicCamera(
            boundingBox.min.x, boundingBox.max.x,
            boundingBox.max.z, boundingBox.min.z,
            boundingBox.min.y - 1, boundingBox.max.y + 1
        );
        this.orthoCamera.position.set(0, boundingBox.max.y + 1, 0);
        this.orthoCamera.lookAt(0, boundingBox.min.y, 0);

        // Add the orthographic camera to the scene
        this.scene.add(this.orthoCamera);
    }

    setupRenderTarget() {
        this.renderTarget = new THREE.WebGLRenderTarget(this.mapWidth, this.mapHeight, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        });
    }

    generateHeightMap() {
        const depthMaterial = new THREE.ShaderMaterial({
            uniforms: {
                cameraNear: { value: this.orthoCamera.near },
                cameraFar: { value: this.orthoCamera.far }
            },
            vertexShader: `
                varying vec4 vWorldPosition;
                void main() {
                    vWorldPosition = modelMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float cameraNear;
                uniform float cameraFar;
                varying vec4 vWorldPosition;

                float linearizeDepth(float depth) {
                    float z = depth * 2.0 - 1.0;
                    return (2.0 * cameraNear * cameraFar) / (cameraFar + cameraNear - z * (cameraFar - cameraNear));
                }

                void main() {
                    float depth = linearizeDepth(gl_FragCoord.z) / cameraFar;
                    gl_FragColor = vec4(vec3(depth), 1.0);
                }
            `,
            side: THREE.DoubleSide
        });

        // Set the mesh to a specific layer
        const originalLayer = this.mesh.layers.mask;
        const heightMapLayer = 1;
        this.mesh.layers.set(heightMapLayer);
        this.orthoCamera.layers.enable(heightMapLayer);

        this.renderer.setSize(this.mapWidth, this.mapHeight);
        this.renderer.setRenderTarget(this.renderTarget);
        this.scene.overrideMaterial = depthMaterial;
        this.renderer.render(this.scene, this.orthoCamera);
        this.scene.overrideMaterial = null;
        this.renderer.setRenderTarget(null);

        // Restore the original layer
        this.mesh.layers.mask = originalLayer;

        const readPixels = new Uint8Array(this.mapWidth * this.mapHeight * 4);
        this.renderer.readRenderTargetPixels(this.renderTarget, 0, 0, this.mapWidth, this.mapHeight, readPixels);

        this.heightMap = new Uint8Array(this.mapWidth * this.mapHeight);
        for (let i = 0; i < this.mapWidth * this.mapHeight; i++) {
            const r = readPixels[i * 4];
            const g = readPixels[i * 4 + 1];
            const b = readPixels[i * 4 + 2];
            const depth = (r + g + b) / 3;
            this.heightMap[i] = depth;
        }
    }

    getHeightAt(x, z, boundingBox) {
        const worldWidth = boundingBox.max.x - boundingBox.min.x;
        const worldHeight = boundingBox.max.z - boundingBox.min.z;
        const cellWidth = worldWidth / this.mapWidth;
        const cellHeight = worldHeight / this.mapHeight;

        const gridX = Math.floor((x - boundingBox.min.x) / cellWidth);
        const gridZ = Math.floor((z - boundingBox.min.z) / cellHeight);

        if (gridX < 0 || gridX >= this.mapWidth || gridZ < 0 || gridZ >= this.mapHeight) {
            return boundingBox.min.y;
        }

        const heightIndex = gridZ * this.mapWidth + gridX;
        const heightValue = this.heightMap[heightIndex];
        const normalizedHeight = heightValue / 255;
        const worldHeightValue = normalizedHeight * (boundingBox.max.y - boundingBox.min.y) + boundingBox.min.y;

        return worldHeightValue;
    }

    updateObjectPosition(object, boundingBox) {
        const position = object.position;
        const height = this.getHeightAt(position.x, position.z, boundingBox);
        if (!object.isJumping) {
            position.y = height;
        }
    }
}