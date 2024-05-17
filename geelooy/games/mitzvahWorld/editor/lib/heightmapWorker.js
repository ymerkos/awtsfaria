//B"H
import * as THREE from "https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js"
//"/games/scripts/build/three.module.js";

self.onmessage = async (event) => {
  const { position, rotation, scale, vertices } = event.data.data;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  // Create mesh
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Set your desired material
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.fromArray([0, 0, 0]);
  mesh.rotation.fromArray(rotation);
  mesh.scale.fromArray(scale);

  const scene = new THREE.Scene();
  scene.add(mesh);

  // Calculate bounding box
  const boundingBox = new THREE.Box3().setFromObject(mesh);

  // Set up camera
  const aspect = boundingBox.getSize(new THREE.Vector3()).x / boundingBox.getSize(new THREE.Vector3()).z;
  const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.set(0, boundingBox.max.y * 2, 0); // Position the camera above the mesh
  camera.lookAt(mesh.position);

  const raycaster = new THREE.Raycaster();

  // Calculate heightmap size based on mesh size
  const meshSizeX = boundingBox.getSize(new THREE.Vector3()).x;
  const meshSizeZ = boundingBox.getSize(new THREE.Vector3()).z;
  const resolutionFactor = 1; // Adjust this factor based on your needs
  const heightmapSize = Math.ceil(Math.max(meshSizeX, meshSizeZ) * resolutionFactor);

  const heightmapData = new Uint8Array(heightmapSize * heightmapSize);

  // Add reference plane
  const referencePlaneGeometry = new THREE.PlaneGeometry(meshSizeX, meshSizeZ);
  const referencePlaneMaterial = new THREE.MeshBasicMaterial({ visible: false }); // Make the plane invisible
  const referencePlane = new THREE.Mesh(referencePlaneGeometry, referencePlaneMaterial);

  referencePlane.position.copy(boundingBox.min); // Position the plane at the bottom of the bounding box
  referencePlane.rotation.x = Math.PI / 2; // Rotate the plane to lie flat on the x-z plane

  scene.add(referencePlane); // Add the plane to the scene

  for (let i = 0; i < heightmapSize; i++) {
    for (let j = 0; j < heightmapSize; j++) {
      const x = boundingBox.min.x + i 
      const z = boundingBox.min.z + j 

      raycaster.set(camera.position, new THREE.Vector3(x, referencePlane.position.y, z).normalize());
      const intersects = raycaster.intersectObject(mesh);

      if (intersects.length > 0) {
        const height = intersects[0].distance * 255; // Use distance for height

        // Normalize height based on bounding box height (optional)
       // const normalizedHeight = height / boundingBox.getSize(new THREE.Vector3()).y * 255;

        heightmapData[i * heightmapSize + j] = Math.floor(height);
      } else {
        // Set default value for no intersection (adjust as needed)
        heightmapData[i * heightmapSize + j] = 0;
      }
    }
  }

  console.log("Data", heightmapData, heightmapSize);
  const blob = await generatePNGFromRawData(heightmapData, heightmapSize, heightmapSize);
  const blobUrl = URL.createObjectURL(blob);

  // Send heightmap data back to the main thread
  self.postMessage({ blobUrl });

  return;
};

async function generatePNGFromRawData(rawData, width, height) {
    // Create an offscreen canvas
    const offscreen = new OffscreenCanvas(width, height);
    const ctx = offscreen.getContext('2d');

    // Create a Uint8ClampedArray from the raw data
    const imageDataArray = new Uint8ClampedArray(rawData.length * 4); // Each pixel has 4 values (RGBA)

    // Fill the imageDataArray with the raw data (assuming grayscale, so R=G=B)
    for (let i = 0; i < rawData.length; i++) {
        const pixelIndex = i * 4;
        const value = rawData[i];
        imageDataArray[pixelIndex] = value; // Red
        imageDataArray[pixelIndex + 1] = value; // Green
        imageDataArray[pixelIndex + 2] = value; // Blue
        imageDataArray[pixelIndex + 3] = 255; // Alpha (fully opaque)
    }

    // Create ImageData object
    const imageData = new ImageData(imageDataArray, width, height);

    // Put the ImageData onto the canvas
    ctx.putImageData(imageData, 0, 0);

    // Convert the canvas to a Blob
    const blob = await new Promise(resolve => offscreen.convertToBlob({ type: 'image/png' }).then(resolve));

    // Return the Blob
    return blob;
}

// Notify that the worker is open
self.postMessage({
    opened: "yes"
});
