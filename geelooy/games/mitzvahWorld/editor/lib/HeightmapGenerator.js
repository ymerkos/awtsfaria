
import * as THREE from 'https://awtsmoos.com/games/scripts/build/three.module.js';

export default class HeightmapGenerator {
    generateHeightmap(mesh, filename) {
        if (!(mesh instanceof THREE.Mesh)) {
            throw new Error('The object provided is not a valid mesh.');
        }

        // Extract necessary data from the mesh
        const data = {
            position: mesh.position.toArray(),
            rotation: mesh.rotation.toArray(),
            scale: mesh.scale.toArray(),
            vertices: mesh.geometry.attributes.position.array
        };

        const worker = new Worker("./lib/heightmapWorker.js", {
            type: "module"
        });

        worker.onmessage = (event) => {
            if (event.data.opened) {
                worker.postMessage({ data: data });
                return;
            }
            var { 
                heightmap,
                blobUrl
             } = event.data;
           /* var blobUrl = URL.createObjectURL(new Blob([
                heightmap
            ], {
                type: "application/octet-stream"
            }))*/
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            link.click();

            URL.revokeObjectURL(blobUrl);
        };
    }
}