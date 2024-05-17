//B"H
//B"H
var g = 3
try {
    g = await import("/games/scripts/build/three.module.js")
    self.THREE={}

} catch(e) {
    console.log("ER",e)
}
// import * as THREE from '/games/scripts/build/three.module.js';
console.log("HI there!!",self.THREE=g)

self.addEventListener('message', (event) => {
    console.log("Hi there! again",event.data)
    const { heightmapSize, bboxMin, size, cameraProjectionMatrix, vertices } = event.data;
    const heightmapData = new Uint8Array(heightmapSize * heightmapSize);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    for (let y = 0; y < heightmapSize; y++) {
        console.log("Going...")
        for (let x = 0; x < heightmapSize; x++) {
            mouse.x = x / heightmapSize * 2 - 1;
            mouse.y = -(y / heightmapSize) * 2 + 1;

            raycaster.setFromCamera(mouse, { projectionMatrix: cameraProjectionMatrix });
            raycaster.ray.intersectPlane(event.data.plane, mouse);

            const height = (mouse.y + 1) / 2; // Range [0, 1]
            heightmapData[y * heightmapSize + x] = Math.floor(height * 255);
        }
    }

    self.postMessage({ heightmapData: heightmapData, heightmapSize: heightmapSize });

    console.log("got it!",heightmapData)
});

self.postMessage({
    opened: "yes"
})