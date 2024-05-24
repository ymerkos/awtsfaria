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
        this.renderer = new THREE.WebGLRenderer({
            format: THREE.RGBFormat
        });

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
        const width = this.boundingBox.getSize(new THREE.Vector3()).x;
        const height = this.boundingBox.getSize(new THREE.Vector3()).z;

        // Use a power of 2 for better performance
        const mapWidth = width//
        const mapHeight = height//Math.pow(2, Math.ceil(Math.log2(height)));

        this.highresWidth = Math.pow(2, Math.ceil(Math.log2(width)));
        this.highresHeight = Math.pow(2, Math.ceil(Math.log2(height)));;
        this.mapWidth=mapWidth;
        this.mapHeight=mapHeight;
        this.renderTarget = new THREE.WebGLRenderTarget(this.highresWidth, this.highresHeight, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            // Use RGBAUnsignedPack16Type for 16-bit heightmap
            type: THREE.RGBAUnsignedPack16Type
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

        this.renderer.setSize(this.highresWidth, this.highresHeight);
        this.renderer.setRenderTarget(this.renderTarget);

       

        this.scene.overrideMaterial = depthMaterial;

        // Set the mesh to a specific layer
        this.mesh.layers.enable(14);
        this.orthoCamera.layers.set(14)

        this.renderer.render(this.scene, this.orthoCamera);
        this.mesh.layers.disable(14);
        this.scene.overrideMaterial = null;

        
        
        this.renderer.setRenderTarget(null);

        const readPixels = new Uint8Array(this.highresWidth * this.highresHeight * 4);
        this.renderer.readRenderTargetPixels(
            this.renderTarget, 0, 0, this.highresWidth, this.highresHeight, readPixels);

        this.heightMap = new Uint8Array(this.highresWidth * this.highresHeight);
        for (let i = 0; i < this.highresWidth * this.highresHeight; i++) {
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

    getPNGfromHeightmap() {
        return new Promise((r,j) => {
            const heightMap = this.heightMap;
            const mapWidth = this.mapWidth;
            const mapHeight = this.mapHeight;

            var highresW = this.highresWidth;
            var highrestH = this.highresHeight;
            // Create a canvas element
            const highResCanvas = document.createElement('canvas');
            highResCanvas.width = highresW;
            highResCanvas.height = highrestH;
            const ctx = highResCanvas.getContext('2d');

            // Create an ImageData object to store the heightmap as image data
            const imageData = ctx.createImageData(highresW, highrestH);

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

            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = mapWidth;
            finalCanvas.height = mapHeight;
            const finalCtx = finalCanvas.getContext('2d');

            finalCtx.drawImage(highResCanvas, 0, 0, mapWidth, mapHeight);


            // Convert the canvas to a Blob
            finalCanvas.toBlob(function(blob) {
                r(URL.createObjectURL(blob))
                
            }, 'image/png');
        })
        
    }

    async downloadHeightmapAsPNG(nm = "BH.png") {
        var url = await this.getPNGfromHeightmap();
        // Create a download link for the Blob
        const link = document.createElement('a');
        link.href = url
        link.download = nm;

        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
