//B"H
/**
 * Ayin - An enhanced Three.js camera class that follows a target object in the scene. 
 * Provides functionalities for rotating around the target, zooming in/out, 
 * and collision avoidance with scene objects.
 */import * as THREE from '/games/scripts/build/three.module.js';

export default class Ayin {
    constructor(width, height, target) {
        this.width = width;
        this.height = height;
        this.target = target;

        this.mouseX = 0;
        this.mouseY = 0;
        this.deltaY =0;

        this.targetHeight = 1;
        this.distance = 5.0;
        this.offsetFromWall = 0.3;

        this.maxDistance = 20;
        this.minDistance = .6;
        this.speedDistance = 5;

        this.xSpeed = 75.0;
        this.ySpeed = 75.0;

        this.yMinLimit = -40;
        this.yMaxLimit = 80;

        this.zoomRate = .01;

        this.rotationDampening = 3.0;
        this.zoomDampening = 5.0;

        this.xDeg = 0.0;
        this.yDeg = 0.0;
        this.currentDistance = this.distance;
        this.desiredDistance = this.distance;
        this.correctedDistance = this.distance;

        this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
        this.camera.rotation.order = 'YXZ';
        this.raycaster = new THREE.Raycaster();

        this.objectsInScene = [];

        this.userInputTheta = 0;
        this.userInputPhi = 0;
     
        this.mouseIsDown = false;
    }

    get target() {
        return this._target;
    }

    set target(v) {
        this._target = v;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    clampAngle(angle, min, max) {
        if (angle < -360)
            angle += 360;
        if (angle > 360)
            angle -= 360;
        return Math.max(Math.min(angle, max), min);
    }
    
    sensitivity = 0.001;

    update() {
        if (!this.target) return;

        let vTargetOffset;
    
        // Get the target's rotation in degrees
        let targetRotation = this.target.mesh.rotation.y * 180 / Math.PI;
    
        // If it's the first update call, set the previous rotation to the current one
        if (this.previousTargetRotation === undefined) {
            this.previousTargetRotation = targetRotation;
        }
    
        // Compute the change in the target's rotation
        let rotationDelta = targetRotation - this.previousTargetRotation;
    
        // Update the camera's horizontal rotation based on the target's rotation and the user's input
        if (this.mouseIsDown) {
            // If the mouse button is down, allow the user to control the rotation
            this.userInputTheta -= this.mouseX * this.xSpeed * this.sensitivity;
        } else {
            // If the mouse button is not down, make the camera follow the target
            this.userInputTheta += rotationDelta;
        }
    
        // Update the camera's vertical rotation based on the user's input
        // Subtracting the mouseY component inverts the controls
        this.userInputPhi -= this.mouseY * this.ySpeed * this.sensitivity;
    
        // Remember the target's current rotation for the next update call
        this.previousTargetRotation = targetRotation;
    
        // The rest of your code...
         // Calculate the desired distance
        this.desiredDistance -= this.deltaY * 0.02 * this.zoomRate * Math.abs(this.desiredDistance) * this.speedDistance;
        this.desiredDistance = Math.max(Math.min(this.desiredDistance, this.maxDistance), this.minDistance);

        // Reset deltaY
        this.deltaY = 0;
        this.userInputPhi = this.clampAngle(this.userInputPhi, this.yMinLimit, this.yMaxLimit);
    
        // Set camera rotation
        let euler = new THREE.Euler(this.userInputPhi * THREE.MathUtils.DEG2RAD, this.userInputTheta * THREE.MathUtils.DEG2RAD, 0, 'YXZ');
        let rotation = new THREE.Quaternion();
        rotation.setFromEuler(euler);
    
        this.correctedDistance = this.desiredDistance;
    
        // Calculate desired camera position
        vTargetOffset = new THREE.Vector3(0, -this.targetHeight, 0);
        let position = new THREE.Vector3().copy(this.target.mesh.position);
        position.sub(vTargetOffset);
        position.sub(new THREE.Vector3(0, 0, this.desiredDistance).applyQuaternion(rotation)); 
    
        // Check for collision using the true target's desired registration point as set by user using height
        let trueTargetPosition = new THREE.Vector3().copy(this.target.mesh.position);
        trueTargetPosition.sub(vTargetOffset);
    
        // If there was a collision, correct the camera position and calculate the corrected distance
        let isCorrected = false;
    
        this.raycaster.set(trueTargetPosition, position.clone().sub(trueTargetPosition).normalize());
    
        for (let obj of this.objectsInScene) {
            let collisionResults = this.raycaster.intersectObject(obj, true);
            if (collisionResults.length > 0) {
                let distanceToObject = collisionResults[0].distance - this.offsetFromWall;
                if (distanceToObject < this.correctedDistance) {
                    this.correctedDistance = distanceToObject;
                    isCorrected = true;
                }
            }
        }
    
        // For smoothing, lerp distance only if either distance wasn't corrected, or correctedDistance is more than currentDistance
        this.currentDistance = (!isCorrected || this.correctedDistance > this.currentDistance) ? 
            this.lerp(this.currentDistance, this.correctedDistance, 0.02 * this.zoomDampening) : 
            this.correctedDistance;
    
        // Keep within legal limits
        this.currentDistance = Math.max(Math.min(this.currentDistance, this.maxDistance), this.minDistance);
    
        // Recalculate position based on the new currentDistance
        position = new THREE.Vector3().copy(this.target.mesh.position);
        position.sub(vTargetOffset);
        position.sub(new THREE.Vector3(0, 0, this.currentDistance).applyQuaternion(rotation)); 
    
        this.camera.rotation.copy(euler);
        this.camera.position.copy(position);

        this.camera.lookAt(this.target.mesh.position)
    }
    
    lerp(start, end, percent) {
        return (start + percent*(end - start));
    }

    lerpAngle(start, end, percent) {
        let difference = Math.abs(end - start);
        if (difference > 180) {
            // We need to add on to one of the values.
            if (end > start) {
                // We'll add it on to start...
                start += 360;
            } else {
                // Add it on to end.
                end += 360;
            }
        }

        // Interpolate it.
        let value = (start + ((end - start) * percent));

        // Wrap it..
        let rangeZero = 360;

        if (value >= 0 && value <= 360)
            return value;

        return (value % rangeZero);
    }

    zoom(deltaY) {
        this.deltaY = deltaY;
    }

    rotateAroundTarget(dx, dy) {
        // Convert degrees to radians
        const degreeToRadian = Math.PI / 180;
        // Update the theta and phi values based on the mouse movement
        this.userInputTheta += dx * this.xSpeed * degreeToRadian;
        this.userInputPhi -= dy * this.ySpeed * degreeToRadian;
    }

    onMouseDown(event) {
        if (event.button === 0) {
            this.mouseIsDown  = true;
        }
    }

    onMouseMove(event) {
        if(this.mouseIsDown && (event.movementX !== 0 || event.movementY !== 0)) {
            let dx = event.movementX * (this.xSpeed / this.width);
            let dy = event.movementY * (this.ySpeed / this.height);
            this.rotateAroundTarget(dx, dy);
        }
    }

    onMouseUp(event) {
        if (event.button === 0) {
            this.mouseIsDown = false;
        }
    }
}