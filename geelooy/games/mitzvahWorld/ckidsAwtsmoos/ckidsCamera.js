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

        this.cameraPivot = new THREE.Object3D();
        this.cameraPivot.add(this.camera);
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

    rotationDampening = 3.0;
    zoomDampening = 5.0;
    desiredDistance;
    correctedDistance;
    update(deltaTime) {
        if (!this.target) return;
    
        const BUFFER = 0.1; // Offset to avoid direct collision
        const LERP_FACTOR = 0.1; // Factor for linear interpolation
        const offsetFromWall = 0.1; // Additional offset when collision detected
        const zoomDampening = 0.02; // Speed at which zoom changes happen
        const MIN_CAMERA_DISTANCE = 0.6; // Minimum allowed camera distance
        const MAX_CAMERA_DISTANCE = 20; // Maximum allowed camera distance
    
        const targetPosition = this.target.mesh.position;
        const targetRotation = this.target.mesh.rotation.y;
    
        // Calculate the desired camera position
        this.targetDirection.set(Math.sin(this.theta) * Math.sin(this.phi), Math.cos(this.phi), Math.cos(this.theta) * Math.sin(this.phi));
        this.desiredCameraPosition.copy(this.targetDirection).multiplyScalar(this.radius).add(targetPosition);
    
        // Initialize the raycaster if it's not set
        if (!this.raycaster) {
            this.raycaster = new THREE.Raycaster();
        }
    
        // Set raycaster
        this.raycaster.set(targetPosition.clone(), this.targetDirection);
    
        // Calculate intersections with objects in the scene
        const intersections = this.raycaster.intersectObjects(this.objectsInScene, true);
        let distanceToTarget = this.radius;
    
        if (intersections.length > 0) {
            // Calculate distance to the closest object, apply the offset
            distanceToTarget = intersections[0].distance - BUFFER - offsetFromWall;
        }
    
        // Clamp the distance between min and max distances
        distanceToTarget = THREE.MathUtils.clamp(distanceToTarget, MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE);
    
        // Lerp between the current and desired distances
        this.radius = THREE.MathUtils.lerp(this.radius, distanceToTarget, deltaTime * zoomDampening);
    
        this.desiredCameraPosition.copy(this.targetDirection).multiplyScalar(this.radius).add(targetPosition);
    
        // If there was a collision, correct the camera position and calculate the corrected distance
        let correctedDistance = this.radius;
        if(intersections.length > 0) {
            correctedDistance = intersections[0].distance - BUFFER;
            this.radius = correctedDistance > this.radius ? THREE.MathUtils.lerp(this.radius, correctedDistance, deltaTime * zoomDampening) : correctedDistance;
        }
    
        // keep within legal limits
        this.radius = THREE.MathUtils.clamp(this.radius, MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE);
    
        // recalculate position based on the new currentDistance
        this.desiredCameraPosition.copy(this.targetDirection).multiplyScalar(this.radius).add(targetPosition);
    
        // Smooth movement of the camera
        this.camera.position.lerp(this.desiredCameraPosition, LERP_FACTOR);
    
        // Make the camera look at the target
        this.camera.lookAt(targetPosition);
    }
    
    
    
    

    
    zoom(deltaY) {
        // Adjust the speed of zooming here. The '- event.deltaY * 0.01' part can be changed as needed
        this.desiredDistance -= deltaY * 0.01;
        // Clamp the radius between the minimum and maximum camera distance
        this.desiredDistance = Math.max(this.MIN_CAMERA_DISTANCE, Math.min(this.MAX_CAMERA_DISTANCE, this.desiredDistance));
    }

    rotateAroundTarget(movementX, movementY) {
        this.theta -= movementX / 500;
        this.phi -= movementY / 500;

        this.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.phi)); // prevent camera flip at zenith
    }

}
