/*

B"H

*/

import * as THREE from "/games/scripts/build/three.module.min.js";
import {FontLoader} from "/games/scripts/jsm/loaders/FontLoader.js"
import {TextGeometry} from "/games/scripts/jsm/utils/TextGeometry.js";
import {EffectComposer} from "/games/scripts/jsm/utils/EffectComposer.js";
import {UnrealBloomPass} from "/games/scripts/jsm/utils/UnrealBloomPass.js";
import {RenderPass} from "/games/scripts/jsm/utils/RenderPass.js"
// Initialize Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Initialize Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load Hebrew Font and Create Particles
const loader = new FontLoader();
let particles;

loader.load('/resources/fonts/Tinos_Bold.json', function (font) {
    const particleCount = 100; // Number of particles
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x00aaff });
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = [];

    for (let i = 0; i < particleCount; i++) {
        const randomCharacter = String.fromCharCode(1488 + Math.floor(Math.random() * 27)); // Generate a random Hebrew letter
        const textGeometry = new TextGeometry(randomCharacter, {
            font: font,
            size: 0.1,
            height: 0.01 // Adjust the height as needed
        });
    
       
    
        const x = Math.random() * 10 - 5; // Random x position within a range
        const y = Math.random() * 10 - 5; // Random y position within a range
        const z = Math.random() * 10 - 5; // Random z position within a range
    
        const particleMesh = new THREE.Mesh(textGeometry, particleMaterial);
        particleMesh.position.set(x, y, z);
    
        particlePositions.push(x, y, z);
        scene.add(particleMesh);
    }
    
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
});

// Create Lightning Effect
const light = new THREE.PointLight(0xFFFFFF);
light.position.set(0, 0, 5);
scene.add(light);

// Create Waterfall Effect (Placeholder)
// You will need to add a shader or other method to create the waterfall effect

// Create Post-Processing Bloom

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass();
composer.addPass(renderPass);
composer.addPass(bloomPass);




// English Font Description & Alias
loader.load('/resources/fonts/Montserrat.json', function(font) {
    const geometry = new TextGeometry('Alias Name: Awtsmoos', {
        font: font,
        size: 0.5,
        height: 0.1
    });
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const aliasText = new THREE.Mesh(geometry, material);
    aliasText.position.set(-3, 2, 0);
    scene.add(aliasText);

    const descriptionGeometry = new TextGeometry('Description: The Essence of Creation', {
        font: font,
        size: 0.5,
        height: 0.1
    });
    const descriptionText = new THREE.Mesh(descriptionGeometry, material);
    descriptionText.position.set(-3, 1.5, 0);
    scene.add(descriptionText);
});


// Create Clickable Link to Heichelos
const linkElement = document.createElement('a');
linkElement.href = 'https://www.awtsmoos.com';
linkElement.innerText = 'Visit Heichelos';
linkElement.style.position = 'absolute';
linkElement.style.top = '10px';
linkElement.style.left = '10px';
document.body.appendChild(linkElement);






// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Add your mouse interactivity logic here
    if(!particles) return;

    
     // Example: rotate each individual particle (you can customize this as needed)
     scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.geometry
             instanceof TextGeometry) {
            child.rotation.x += 0.01;
            child.rotation.y += 0.01;
        }
    });

    // Use composer to render with post-processing effects
    composer.render();
    //composer.render();
}

// Add English Font (Placeholder)
// Load your English font and add it to the scene similar to how the Hebrew font was added

// Add Clickable Link (Placeholder)
// Create a clickable link, either as 3D text or by using DOM elements overlayed on the canvas

// Call Animation Loop
animate();