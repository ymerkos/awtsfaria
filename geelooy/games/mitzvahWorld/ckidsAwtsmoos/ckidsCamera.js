//B"H
/**
 * Ayin - A class that represents a camera in Three.js. The camera is designed to follow a target
 * object (player) in the scene, with options to rotate around the target, zoom in and out, 
 * and avoid colliding with other objects in the scene.
 */
import * as THREE from '/games/scripts/build/three.module.js';

const BUFFER = 1; // Buffer for the camera intersection
const LERP_FACTOR = 0.2; // Lerp factor for camera movement
const EPSILON = 0.01; // Small value to check against squared distances


export default class Ayin {

    // Minimum and maximum distance the camera can be from the player
    MIN_CAMERA_DISTANCE = 3;
    MAX_CAMERA_DISTANCE = 10;
    theta = 0; // azimuthal angle
    phi = Math.PI / 2; // polar angle

    radius = 5; // distance from player to camera

    // Camera and viewport properties
    width;
    height;
    camera;

    // The raycaster is used for collision detection between the camera and other objects in the scene
    raycaster;

    // Properties for tracking the direction of the camera and its desired position
    targetDirection;
    desiredCameraPosition;

    // The list of objects in the scene that the camera can collide with
    objectsInScene = [];
    scene
    // The target object (player) that the camera follows
    target;

    // The current position and rotation of the target (player)
    targetPosition;
    targetRotation;

    /**
     * @param {number} width - The width of the viewport.
     * @param {number} height - The height of the viewport.
     * @param {THREE.Object3D} target - The target object (usually the player) that the camera will follow.
     * 
     * @example
     * const ayin = new Ayin(window.innerWidth, window.innerHeight, player);
     */
    constructor(width, height, target) {
        this.width=width;
        this.height=height;
        this.camera = new THREE.PerspectiveCamera( 70, width / height, 0.1, 1000 );
        this.camera.rotation.order = 'YXZ';
        console.log("HI", this.camera)
        this.raycaster = new THREE.Raycaster();
        this.targetDirection = new THREE.Vector3();
        this.desiredCameraPosition = new THREE.Vector3();

        this.target=target;
    }


     /**
     * Sets the size of the viewport and updates the aspect ratio of the camera.
     *
     * @param {number} width - The new width of the viewport.
     * @param {number} height - The new height of the viewport.
     *
     * @example
     * ayin.setSize(window.innerWidth, window.innerHeight);
     */
    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    
    /**
     * Rotates the camera around the target based on mouse movement.
     *
     * @param {number} movementX - The amount of horizontal mouse movement.
     * @param {number} movementY - The amount of vertical mouse movement.
     *
     * @example
     * window.addEventListener('mousemove', (event) => {
     *     ayin.rotateAroundTarget(event.movementX, event.movementY);
     * });
     */
    rotateAroundTarget(movementX, movementY) {

        this.theta -= movementX / 500;
        this.phi -= movementY / 500;

        this.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.phi)); // prevent camera flip at zenith
        
    }

    /**
     * Zooms the camera in or out based on the scroll wheel.
     *
     * @param {number} deltaY - The scroll delta.
     *
     * @example
     * window.addEventListener('wheel', (event) => {
     *     ayin.zoom(event.deltaY);
     * });
     */
    zoom(deltaY) {
         // Adjust the speed of zooming here. The '- event.deltaY * 0.01' part can be changed as needed
         this.radius -= deltaY * 0.01;
        // Clamp the radius between the minimum and maximum camera distance
        this.radius = Math.max(this.MIN_CAMERA_DISTANCE, Math.min(this.MAX_CAMERA_DISTANCE,this. radius));
    }

    /**
     * Sets the camera to the target's position and resets its rotation.
     *
     * @example
     * ayin.setToTarget();
     */
    setToTarget() {

        this.camera.position.copy( targetPosition );
        this.camera.rotation.set( 0, 0, 0 );
    }

    /**
 * Updates the position and orientation of the camera based on the target's position and rotation. 
 * This should be called in the animation loop of the game.
 *
 * @param {number} deltaTime - The time elapsed since the last frame.
 *
 * @example
 * function animate() {
 *     requestAnimationFrame(animate);
 *     const deltaTime = clock.getDelta();
 *     ayin.update(deltaTime);
 * }
 * animate();
 */
update(deltaTime) {
    if(!this.target) return;
    const targetPosition = this.target.mesh.position;
    const targetRotation = this.target.mesh.rotation.y;

    // Calculate the desired camera position based on the target's position and rotation
    let totalRotation = this.theta + targetRotation; // Combine mouse and player rotation
    this.desiredCameraPosition.x = targetPosition.x + this.radius 
        * Math.sin(this.phi) * Math.sin(totalRotation);
    this.desiredCameraPosition.y = targetPosition.y + this.radius 
        * Math.cos(this.phi);
    this.desiredCameraPosition.z = targetPosition.z + this.radius 
        * Math.sin(this.phi) * Math.cos(totalRotation);


    this.targetPosition = targetPosition;
    this.targetRotation = targetRotation;

    

    

    this.cameraCollisions(deltaTime)
    // Always look at player
    this.camera.lookAt(targetPosition);
}

    
    /**
     * Helper method to lerp camera position.
     * @param {THREE.Vector3} newPosition 
     */
    lerpCameraPosition(newPosition) {
        if (this.camera.position.distanceToSquared(newPosition) > EPSILON) {
            this.camera.position.lerp(newPosition, LERP_FACTOR);
        }
    }

    /**
     * Adjusts the camera position based on intersections with other objects in the scene.
     *
     * @param {Array<THREE.Intersection>} intersections - An array of intersection objects.
     *
     * @example
     * const intersections = raycaster.intersectObjects(objectsInScene);
     * ayin.adjustCameraPositionBasedOnIntersections(intersections);
     */
    adjustCameraPositionBasedOnIntersections(intersection) {
        if (intersection) {
            let newPosition = intersection.point.clone();
            let offset = intersection.face.normal.clone().multiplyScalar(0.5 + BUFFER);
            newPosition.add(offset);
    
            this.desiredCameraPosition.copy(newPosition);
        }
    }

    adjustCameraPositionWhenTargetInAir() {
        let newPosition = this.targetPosition.clone().add(new THREE.Vector3(0, 2, -5));
        this.desiredCameraPosition.copy(newPosition);
    }

    getLerpFactor(deltaTime) {
        return clamp(deltaTime * 10, 0, 1); // The lerp factor is based on deltaTime and clamped between 0 and 1
    }

    /**
     * Checks for collisions between the camera and other objects in the scene, and adjusts the camera 
     * position if a collision is detected. This should be called in the animation loop of the game.
     *

     */
    cameraCollisions(deltaTime) {
        this.targetDirection.copy(this.desiredCameraPosition).sub(this.targetPosition).normalize();
        this.raycaster.set(this.targetPosition, this.targetDirection);
        
        // Raycast from player to camera
        const playerToCameraIntersections = this.raycaster.intersectObjects(this.objectsInScene, true);
        
        const closestIntersection = this.findClosestIntersection(playerToCameraIntersections);

        if (this.targetInAir) {
            this.adjustCameraPositionWhenTargetInAir();
        } else {
            this.adjustCameraPositionBasedOnIntersections(closestIntersection);
        }

        // Lerp camera position
        let lerpFactor = this.getLerpFactor(deltaTime);
        this.camera.position.lerp(this.desiredCameraPosition, lerpFactor);
    }
    findClosestIntersection(intersections) {
        let closestIntersection = null;
        let intersectionDistance = null;
    
        intersections.forEach(intersection => {
            let distance = this.targetPosition.distanceTo(intersection.point);
    
            if (closestIntersection === null || distance < intersectionDistance) {
                closestIntersection = intersection;
                intersectionDistance = distance;
            }
        });
    
        return closestIntersection;
    }
    
}

function clamp(val, min, max) {
    return Math.min(Math.max(min, val), max);
}