//B"H
import * as THREE from '/games/scripts/build/three.module.js';

export default class HeightmapGenerator {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.heightmapSize = 512; // Default size, will be adjusted based on mesh size
    }

    generateHeightmap(mesh, filename) {
        if (!(mesh instanceof THREE.Mesh)) {
            throw new Error('The object provided is not a valid mesh.');
        }

        this.scene.add(mesh.clone());

        // Calculate bounding box of the mesh
        const bbox = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxSize = Math.max(size.x, size.y, size.z);
        this.heightmapSize = Math.ceil(maxSize * 10); // Scale up for more detail, adjust as needed

        // Set up camera
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);

        // Set up renderer
        this.renderer.setSize(this.heightmapSize, this.heightmapSize);
        this.renderer.setClearColor(0xffffff);
        this.renderer.render(this.scene, this.camera);

     
        const workerURL = "./lib/heightmapWorker.js"
        const worker = new Worker(workerURL,
            {
                type: "module"
            });

            console.log("new worker?",workerURL,worker)
            worker.onerror = e => {
                console.log(e,e.message)
            }
          
        // Handle messages from the worker
        worker.onmessage = (event) => {
            var d = event.data;

            console.log("Got message",event.data)
            if(d.opened) {
                // Send data to the worker
                const cameraProjectionMatrix = this.camera.projectionMatrix.toArray();
                const vertices = mesh.geometry.attributes.position.array;
                const bboxMinArray = bbox.min.toArray(); // Convert to array for transfer
                const sizeArray = size.toArray(); // Convert to array for transfer
                const planeNormal = [0, 1, 0]; // Define the normal array directly

                // Create a new array with the buffers to transfer
                const transferableBuffers = [
                //    vertices.buffer
                ];
                console.log(bboxMinArray,sizeArray,vertices,transferableBuffers)
                worker.postMessage({
                    heightmapSize: this.heightmapSize,
                    bboxMin: bboxMinArray,
                    size: sizeArray,
                    cameraProjectionMatrix: cameraProjectionMatrix,
                    planeNormal: planeNormal,
                    vertices: vertices,
                    hi:123
                },transferableBuffers); // Transfer the buffers
                return;
            }
            const { heightmapData, heightmapSize } = event.data;
            // Create offscreen canvas and context for image
            const offscreen = new OffscreenCanvas(heightmapSize, heightmapSize);
            const ctx = offscreen.getContext('2d');

            // Create imageData from heightmap data
            const imageData = ctx.createImageData(heightmapSize, heightmapSize);
            for (let i = 0; i < heightmapData.length; i++) {
                imageData.data[i * 4] = heightmapData[i];
                imageData.data[i * 4 + 1] = heightmapData[i];
                imageData.data[i * 4 + 2] = heightmapData[i];
                imageData.data[i * 4 + 3] = 255; // Alpha channel
            }

            // Draw imageData onto offscreen canvas
            ctx.putImageData(imageData, 0, 0);

            // Convert offscreen canvas to data URL and download
            offscreen.convertToBlob().then((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();

                // Clean up
                this.scene.remove(mesh);
                this.renderer.dispose();
                URL.revokeObjectURL(url);
                URL.revokeObjectURL(workerURL);
            }).catch((error) => {
                console.error('Error converting canvas to blob:', error);
            });
        };

        
        
    
    
    }
}