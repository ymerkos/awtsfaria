//B"H
/**
 * Camera = ayin
 */

import * as THREE from '/games/scripts/build/three.module.js';

export default class Ayin {

    MIN_CAMERA_DISTANCE = 3;
    MAX_CAMERA_DISTANCE = 10;
    theta = 0; // azimuthal angle
    phi = Math.PI / 2; // polar angle

    radius = 5; // distance from player to camera
    width;
    height
    camera;

    raycaster;

    targetDirection;
    desiredCameraPosition;
    objectsInScene = [];
    target;
    targetPosition;
    targetRotation;
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



    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    rotateAroundTarget(movementX, movementY) {

        this.theta -= movementX / 500;
        this.phi -= movementY / 500;

        this.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.phi)); // prevent camera flip at zenith
        
    }
    zoom(deltaY) {
         // Adjust the speed of zooming here. The '- event.deltaY * 0.01' part can be changed as needed
         this.radius -= deltaY * 0.01;
        // Clamp the radius between the minimum and maximum camera distance
        this.radius = Math.max(this.MIN_CAMERA_DISTANCE, Math.min(this.MAX_CAMERA_DISTANCE,this. radius));
    }
    setToTarget() {

        this.camera.position.copy( targetPosition );
        this.camera.rotation.set( 0, 0, 0 );
    }
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


        // Lerp camera position
        // Lerp camera position
        // Instead of using a fixed lerp factor of 0.1, we make it dependent on deltaTime to ensure a smooth and frame rate independent camera movement
        let lerpFactor = clamp(deltaTime * 10, 0, 1); // The lerp factor is based on deltaTime and clamped between 0 and 1
        
        if(this.camera.position.distanceToSquared(this.desiredCameraPosition) > 0.01) {
            this.camera.position.lerp(this.desiredCameraPosition, lerpFactor);
        }

        function clamp(val, min, max) {
            return Math.min(Math.max(min, val), max);
        }
        
        // Always look at player
        this.camera.lookAt(targetPosition);
    }
    adjustCameraPositionBasedOnIntersections(intersections) {
        let closestIntersection = null;
        let intersectionDistance = null;
    
        intersections.forEach(intersection => {
            let distance = targetPosition.distanceTo(intersection.point);
            
            if (closestIntersection === null || distance < intersectionDistance) {
                closestIntersection = intersection;
                intersectionDistance = distance;
            }
        });
    
        if (closestIntersection !== null) {
            let newPosition = closestIntersection.point.clone();
    
            // Nudge camera out of the object, include a buffer
            let buffer = 1; // Increase this as necessary
            let offset = closestIntersection.face.normal.clone().multiplyScalar(0.5 + buffer);
            newPosition.add(offset);
    
            // Smoothly transition camera to newPosition
            if (this.camera.position.distanceToSquared(newPosition) > 0.01) {
                this.camera.position.lerp(newPosition, 0.2); // Increase the lerp value
            }
        } else {
            if (this.camera.position.distanceToSquared(this.desiredCameraPosition) > 0.01) {
                this.camera.position.lerp(this.desiredCameraPosition, 0.2); // Increase the lerp value
            }
        }
    
        if (jumping) {
            if (this.camera.position.distanceToSquared(this.targetPosition) > 0.01) {
                let newPosition = this.targetPosition.clone().add(new THREE.Vector3(0, 2, -5));
                this.camera.position.lerp(newPosition, 0.2); // Adjust as necessary
            }
        }
    }
    
    cameraCollisions() {
        this.targetDirection.copy(this.desiredCameraPosition).sub(this.targetPosition).normalize();
        this.raycaster.set(this.targetPosition, this.targetDirection);
        
        // Raycast from player to camera
        const playerToCameraIntersections = this.raycaster.intersectObjects(this.objectsInScene, true);
        this.adjustCameraPositionBasedOnIntersections(playerToCameraIntersections);
    }
}