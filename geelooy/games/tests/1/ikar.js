//B"H
import * as THREE from  "../../scripts/build/three.module.min.js";
import { GLTFLoader } from '../../scripts/jsm/loaders/GLTFLoader.js'; 
// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 5;

// Add Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // soft white light
scene.add(ambientLight);

// Add Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Create a renderer and attach it to the DOM
const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var grs = "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/textures%2Fgrass%2Fgrass1.jpg?alt=media"
var glb = "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fenvironemnts%2Fzone1%2Fzone.1.1.glb?alt=media"
var pth = "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fenvironemnts%2Fzone1%2Fmasks%2Fmask%20grass.png?alt=media"
// Load a texture

const textureLoader = new THREE.ImageBitmapLoader();
                
textureLoader.load(
    // resource URL
    grs,
    
    // onLoad callback
    function (imageBitmap) {
        
        const texture = new THREE.Texture(imageBitmap);
        console.log("Loaded!", grs, imageBitmap,window.ww=texture);

        

// Create a mesh with a plane geometry and a basic material, then add it to the scene
const geometry = new THREE.BoxGeometry(7, 7,7,7);

const material = new THREE.MeshLambertMaterial({ map:texture });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 500
scene.add(mesh);
// Load your GLB model
const loader = new GLTFLoader();
loader.load(glb, (gltf) => { // replace 'path_to_your_glb' with the actual path
    const model = gltf.scene;

    // Traverse the model to find the "Landscape" object
    model.traverse((child) => {
        if (child.name.includes("Landscape")) {
            child.material.map = texture;
            
            camera.position.y = 522
            camera.lookAt(child.position)
            child.material.needsUpdate=true;
        }
    });

    scene.add(model);
});

// Create the animation
const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

// Run the animation
animate();
        /*
        const texture = new THREE.Texture(imageBitmap);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
       
        if (shouldRepeat) {
           // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
           // texture.repeat.set(repeatX, repeatY);
        } else {
           // texture.repeat.set(0, 0);
        }
        texture.offset.set( .0001, .00001 );
        texture.needsUpdate = true; // Ensure the texture updates
        
        resolve(texture);*/


    },
    
    // onProgress callback currently not supported
    undefined,
    
    // onError callback
    function (err) {
        console.log('An error happened while loading texture:', err);
    }
);
// The following settings will prevent the texture from repeating
 //THREE.ClampToEdgeWrapping;


