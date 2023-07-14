//B"H
/**
 * Ayin - An enhanced Three.js camera class that follows a target object in the scene. 
 * Provides functionalities for rotating around the target, zooming in/out, 
 * and collision avoidance with scene objects.
 */
import * as THREE from '/games/scripts/build/three.module.js';

const BUFFER = 0.1;
const LERP_FACTOR = 0.1;
const OFFSET_FROM_WALL = 0.1;
const ZOOM_DAMPENING = 0.02;
const MIN_CAMERA_DISTANCE = 0.6;
const MAX_CAMERA_DISTANCE = 20;
const ROTATION_DAMPENING = 0.3;
export default class Ayin {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.theta = 0; // azimuthal angle
        this.phi = Math.PI / 2; // polar angle
        this.radius = 5; // distance from player to camera
        this.desiredDistance = this.radius;
        this.originalDistance = this.desiredDistance;
        this.targetRotationY = 0; // rotation of the target


        this.userInputTheta = 0;
        this.userInputPhi = 0;
        this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
        this.camera.rotation.order = 'YXZ';
        this.raycaster = new THREE.Raycaster();
        this.targetDirection = new THREE.Vector3();
        this.desiredCameraPosition = new THREE.Vector3();
        this.objectsInScene = [];


        this.isColliding = false;
    }

    get target() {
        return this._target;
    }

    set target(target) {
        if (!target) return;
        this.camera.position.copy(target.mesh.position);
 
        this._target = target;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

     update(deltaTime) {
        if (!this.target) return;

        const targetPosition = this.target.mesh.position;
        this.targetRotationY += (this.target.mesh.rotation.y - this.targetRotationY) * LERP_FACTOR;
        this.theta = THREE.MathUtils.lerp(this.theta, this.targetRotationY + this.userInputTheta, ROTATION_DAMPENING);
        this.phi = THREE.MathUtils.lerp(this.phi, this.userInputPhi, ROTATION_DAMPENING);

        this.updateTargetDirection();
        this.updateDesiredCameraPosition(targetPosition);
        this.performCollisionDetection();

        // If not colliding, reset to the original desired distance
        if (!this.isColliding) {
            this.radius = this.desiredDistance;
        }

        this.camera.position.lerp(this.desiredCameraPosition, LERP_FACTOR);
        this.camera.lookAt(targetPosition);
    }

    rotateAroundTarget(movementX, movementY) {
        this.userInputTheta -= movementX / 500; // horizontal rotation -> azimuthal angle
        this.userInputPhi -= movementY / 500; // vertical rotation -> polar angle
    }
    
    zoom(deltaY) {
        // Only allow zooming when the camera is not colliding
        if (!this.isColliding) {
            // experiment with different factors for deltaY. It could be much smaller than 0.02.
            this.desiredDistance -= deltaY * 0.001 * Math.abs(this.desiredDistance);
            this.desiredDistance = THREE.MathUtils.clamp(this.desiredDistance, MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE);
            this.originalDistance = this.desiredDistance;
        }
    }
    
    updateTargetDirection() {
        this.targetDirection.set(
            Math.sin(this.phi) * Math.sin(this.theta),
            Math.cos(this.phi),
            Math.sin(this.phi) * Math.cos(this.theta)
        ).normalize().negate();
    }

    updateDesiredCameraPosition(targetPosition) {
        this.desiredCameraPosition.copy(this.targetDirection)
            .multiplyScalar(this.radius) // use this.radius here instead of this.desiredDistance
            .add(targetPosition);
    }

    performCollisionDetection() {
        const targetPosition = this.target.mesh.position;
        this.raycaster.set(targetPosition, this.targetDirection.clone());

        const intersections = this.raycaster.intersectObjects(this.objectsInScene, true);
        let correctedDistance = this.desiredDistance;

        if (intersections.length > 0) {
            correctedDistance = intersections[0].distance - BUFFER - OFFSET_FROM_WALL;
            correctedDistance = Math.max(correctedDistance, MIN_CAMERA_DISTANCE);
            this.isColliding = true;
        } else {
            this.isColliding = false;
        }

        if (this.isColliding) {
            this.radius = THREE.MathUtils.lerp(this.radius, correctedDistance, ZOOM_DAMPENING);
            this.radius = THREE.MathUtils.clamp(this.radius, MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE);
        }

        this.updateDesiredCameraPosition(targetPosition);
    }
    
}
