/**
 * B"H
 */
import * as THREE from 'https://awtsmoos.com/games/scripts/build/three.module.js';

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
        this.boundingBox = boundingBox;
        console.log(window.g=size)
        this.orthoCamera = new THREE.OrthographicCamera(
            boundingBox.min.x, boundingBox.max.x,
            boundingBox.max.z, boundingBox.min.z,
            0.01, 123456789
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
                boundingBoxMin: { value: this.boundingBox.min },
                boundingBoxMax: { value: this.boundingBox.max }
            },
            vertexShader: /*glsl*/`
                varying vec4 vWorldPosition;
                void main() {
                    vWorldPosition = modelMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: /*glsl*/`
                uniform vec3 boundingBoxMin;
                uniform vec3 boundingBoxMax;
                varying vec4 vWorldPosition;
                
                void main() {
                    // Calculate normalized height within bounding box
                    float normalizedHeight = (vWorldPosition.y - boundingBoxMin.y) / (boundingBoxMax.y - boundingBoxMin.y);
                    
                    gl_FragColor = vec4(vec3(normalizedHeight), 1.0);
                }
            `,
            side: THREE.DoubleSide
        });

        this.renderer.setSize(this.mapWidth, this.mapHeight);
        this.renderer.setRenderTarget(this.renderTarget);

       

        this.scene.overrideMaterial = depthMaterial;

        // Set the mesh to a specific layer
        this.mesh.layers.enable(14);
        this.orthoCamera.layers.set(14)

        this.renderer.render(this.scene, this.orthoCamera);
        this.mesh.layers.disable(14);
        this.scene.overrideMaterial = null;

        
        
        this.renderer.setRenderTarget(null);

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

    downloadHeightmapAsPNG(nm = "BH.png") {
        const heightMap = this.heightMap;
        const mapWidth = this.mapWidth;
        const mapHeight = this.mapHeight;

        // Create a canvas element
        const canvas = document.createElement('canvas');
        canvas.width = mapWidth;
        canvas.height = mapHeight;
        const ctx = canvas.getContext('2d');

        // Create an ImageData object to store the heightmap as image data
        const imageData = ctx.createImageData(mapWidth, mapHeight);

        // Fill the ImageData with heightmap data
        for (let i = 0; i < heightMap.length; i++) {
            const value = heightMap[i];
            // Set R, G, B channels to the heightmap value (greyscale)
            imageData.data[i * 4] = value;
            imageData.data[i * 4 + 1] = value;
            imageData.data[i * 4 + 2] = value;
            // Set the alpha channel to fully opaque
            imageData.data[i * 4 + 3] = 255;
        }

        // Put the ImageData onto the canvas
        ctx.putImageData(imageData, 0, 0);

        // Convert the canvas to a Blob
        canvas.toBlob(function(blob) {
            // Create a download link for the Blob
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = nm;

            // Trigger the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 'image/png');
    }
}
