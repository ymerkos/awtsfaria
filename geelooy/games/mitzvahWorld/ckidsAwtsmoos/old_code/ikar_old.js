/**
 * B"H
 * Main
 */

// main.js
import * as THREE from 'three';

import {
	GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

import {
	Octree
} from 'three/addons/math/Octree.js';

import {
	Capsule
} from 'three/addons/math/Capsule.js';

import Ayin from './ckidsCamera.js';

const clock = new THREE.Clock();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x88ccee);
scene.fog = new THREE.Fog(0x88ccee, 0, 50);


const fillLight1 = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 0.5);
fillLight1.position.set(2, 1, 1);
scene.add(fillLight1);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-5, 25, -1);

scene.add(directionalLight);

const container = document.getElementById('container');

const renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild(renderer.domElement);

const GRAVITY = 30;

const STEPS_PER_FRAME = 5;
const worldOctree = new Octree();
const playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);
const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();
var ayin = new Ayin();
window.aa = ayin
let playerOnFloor = false;

const keyStates = {};

const raycaster = new THREE.Raycaster();

document.addEventListener('keydown', (event) => {
	keyStates[event.code] = true;
});

document.addEventListener('keyup', (event) => {
	keyStates[event.code] = false;
});

let mouseDown = false;
let angle = 0;

addEventListener('mousedown', (event) => {
	if (event.button === THREE.MOUSE.LEFT) {
		document.body.requestPointerLock();
		mouseDown = true;
	}
});

addEventListener('mouseup', (event) => {

	document.exitPointerLock();
	mouseDown = false;

});
// Variables to handle spherical coordinates
let theta = 0; // azimuthal angle
let phi = Math.PI / 2; // polar angle

document.body.addEventListener('mousemove', (event) => {
	if (document.pointerLockElement === document.body && mouseDown) {
		ayin.rotateAroundTarget(event.movementX, event.movementY)
	}
});



document.addEventListener('wheel', (event) => {

	ayin.zoom(event.deltaY)
});

function teleportPlayerIfOob() {

	if (ayin.camera.position.y <= -25) {

		playerCollider.start.set(0, 0.35, 0);
		playerCollider.end.set(0, 1, 0);
		playerCollider.radius = 0.35;

        ayin.update(playerRotation, playerCollider.end);
		ayin.setToTarget()
		
	}

}

let playerRotation = 0;
let jumping = false;

function controls(deltaTime) {
	const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);
	const backwardsSpeedDelta = speedDelta * 0.7;
	const rotationSpeed = 2.0 * deltaTime; // Adjust as needed

	// Forward and Backward controls
	if (keyStates['KeyW'] || keyStates['ArrowUp']) {
		playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
	}

	if (keyStates['KeyS'] || keyStates['ArrowDown']) {
		playerVelocity.add(getForwardVector().multiplyScalar(-backwardsSpeedDelta));
	}

	// Rotation controls
	if (keyStates['KeyA']) {
		playerRotation += rotationSpeed; // Rotate player left
	}

	if (keyStates['KeyD']) {
		playerRotation -= rotationSpeed; // Rotate player right
	}

	// Striding controls
	if (keyStates['KeyQ']) {
		playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));
	}

	if (keyStates['KeyE']) {
		playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
	}

	// Jump control
	if (playerOnFloor && keyStates['Space']) {
		playerVelocity.y = 15;
		jumping = true;
	} else {
		jumping = false;
	}
}

function playerCollisions() {

	const result = worldOctree.capsuleIntersect(playerCollider);
	playerOnFloor = false;
	if (result) {
		playerOnFloor = result.normal.y > 0;
		if (!playerOnFloor) {
			playerVelocity.addScaledVector(result.normal, -result.normal.dot(playerVelocity));
		}
		playerCollider.translate(result.normal.multiplyScalar(result.depth));
	}
}

playerCollider.isAwduhm = true;
let objectsInScene = [];





const playerGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.65, 8);
const playerMaterial = new THREE.MeshBasicMaterial({
	color: 0xffff00
});
const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);

scene.add(playerMesh);

function updatePlayer(deltaTime) {

	let damping = Math.exp(-4 * deltaTime) - 1;

	if (!playerOnFloor) {

		playerVelocity.y -= GRAVITY * deltaTime;

		// small air resistance
		damping *= 0.1;

	}

	playerVelocity.addScaledVector(playerVelocity, damping);

	const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
	playerCollider.translate(deltaPosition);

	playerCollisions();

	playerMesh.position.copy(playerCollider.end);
	playerMesh.rotation.y = playerRotation;

}

function animate() {
	const deltaTime = Math.min(0.1, clock.getDelta()) / STEPS_PER_FRAME;

	for (let i = 0; i < STEPS_PER_FRAME; i++) {

		controls(deltaTime);

		updatePlayer(deltaTime);

		teleportPlayerIfOob();

		if (!jumping) {
			//cameraCollisions();
		}

		

	}


    ayin.update(playerRotation, playerCollider.end);
	renderer.render(scene, ayin.camera);

	requestAnimationFrame(animate);

}

const loader = new GLTFLoader()

loader.load('./models/gltf/collision-world.glb', (gltf) => {
	replaceMaterialWithLambert(gltf);
	window.sett = gltf;
	scene.add(gltf.scene);
	gltf.scene.traverse(child => {
		if (child.isMesh && !child.isAwduhm) {
			objectsInScene.push(child);
		}
	});
	worldOctree.fromGraphNode(gltf.scene);

	gltf.scene.traverse(child => {

		if (child.isMesh) {

			// child.castShadow = true;
			child.receiveShadow = true;

			if (child.material.map) {

				child.material.map.anisotropy = 4;

			}

		}

	});


	animate();

});



function getForwardVector() {

	ayin.camera.getWorldDirection(playerDirection);
	playerDirection.y = 0;
	playerDirection.normalize();

	return playerDirection;

}

function getSideVector() {

	ayin.camera.getWorldDirection(playerDirection);
	playerDirection.y = 0;
	playerDirection.normalize();
	playerDirection.cross(ayin.camera.up);

	return playerDirection;

}

function replaceMaterialWithLambert(gltf) {
	gltf.scene.traverse((child) => {
		if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {
			let oldMat = child.material;
			let newMat = new THREE.MeshLambertMaterial();

			// Copy properties
			newMat.color.copy(oldMat.color);
			newMat.map = oldMat.map;
			newMat.lightMap = oldMat.lightMap;
			newMat.lightMapIntensity = oldMat.lightMapIntensity;
			newMat.aoMap = oldMat.aoMap;
			newMat.aoMapIntensity = oldMat.aoMapIntensity;
			newMat.emissive.copy(oldMat.emissive);
			newMat.emissiveMap = oldMat.emissiveMap;
			newMat.emissiveIntensity = oldMat.emissiveIntensity;
			newMat.specularMap = oldMat.specularMap;
			newMat.alphaMap = oldMat.alphaMap;
			newMat.envMap = oldMat.envMap;
			newMat.combine = oldMat.combine;
			newMat.reflectivity = oldMat.reflectivity;
			newMat.refractionRatio = oldMat.refractionRatio;
			newMat.wireframe = oldMat.wireframe;

			// Replace material
			child.material = newMat;
		}
	});
}