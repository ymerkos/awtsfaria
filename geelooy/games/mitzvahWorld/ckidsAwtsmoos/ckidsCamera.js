//B"H
/**
 * @class Ayin
 *
 * Meet Ayin, a nifty lens to see,
 * Its wisdom unfolds, as Chochmah's decree.
 * The code in this class, though complex it may be,
 * Manages to monitor, a digital spree.
 *
 * @param {number} width - The initial width of the camera view.
 * @param {number} height - The initial height of the camera view.
 * @param {Object} target - The initial target the camera will follow.
 */
var isFPS = true;
var oldTargetRotation = null;

// Convert degrees to radians
const degreeToRadian = Math.PI / 180;

import * as THREE from '/games/scripts/build/three.module.js';
export default class Ayin {
    /**
     * @constructor
     * Constructs an instance of the Ayin class.
     *
     * @example
     * let camera = new Ayin(window.innerWidth, window.innerHeight, player);
     *
     * @param {number} width - The initial width of the camera view.
     * @param {number} height - The initial height of the camera view.
     * @param {Object} target - The initial target the camera will follow.
     */
    constructor(width, height, target) {
        // Set properties like height, width and target
        this.width = width;
        this.height = height;
        this.target = target;

        // Ayin's private eyes, keen and spry,
        // Track every movement, as time goes by.
        this.mouseX = 0;
        this.mouseY = 0;
        this.deltaY = 0;

        // Set properties for the height and distance to target
        this.targetHeight = 0.75;
        this.distance = 5.0;
        this.offsetFromWall = 0.3;

        // Set properties for controlling the distance
        this.maxDistance = 20;
        this.minDistance = .6;
        this.speedDistance = 5;

        // Set properties for controlling the speed
        this.xSpeed = 75.0;
        this.ySpeed = 75.0;

        // Set properties for limiting vertical angle
        this.yMinLimit = -40;
        this.yMaxLimit = 80;

        // Set property for controlling the zoom rate
        this.zoomRate = .01;

        // Set properties for controlling dampening
        this.rotationDampening = 3.0;
        this.zoomDampening = 5.0;

        // Set properties for initial rotation degrees
        this.xDeg = 0.0;
        this.yDeg = 0.0;
        this.currentDistance = this.distance;
        this.desiredDistance = this.distance;
        this.correctedDistance = this.distance;

        // Set up the camera and raycaster
        this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
        this.camera.rotation.order = 'YXZ';
        this.raycaster = new THREE.Raycaster();

        // Set up the objects array to store scene objects for collision detection
        this.objectsInScene = [];

        // Set properties for user input rotation
        this.userInputTheta = 0;
        this.userInputPhi = 0;
     
        // Set property for mouse down status
        this.mouseIsDown = false;

        //movements speed, for example for panning
        this.speed = 5;
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
    estimatedTargetPosition = new THREE.Vector3();

    // Add these properties
    mouseTheta = 0;
    mousePhi = 0;

    panUp() {
        this.userInputPhi += this.speed * degreeToRadian;
    }

    panDown() {
        this.userInputPhi -= this.speed * degreeToRadian;
    }

    update() {
        if (!this.target) return;
        this.estimatedTargetPosition.copy(this.target.mesh.position);
        let vTargetOffset;
        this.estimatedTargetPosition.y += this.targetHeight;
        // Get the target's rotation in degrees
        let targetRotation = this.target.mesh.rotation.y * 180 / Math.PI;
    
        // If it's the first update call, set the previous rotation to the current one
        if (this.previousTargetRotation === undefined) {
            this.previousTargetRotation = targetRotation;
        }
    
        // Compute the change in the target's rotation
        let rotationDelta = targetRotation - this.previousTargetRotation;
    
        

        // Then in your update method, modify these lines:
        if (this.mouseIsDown) {
            // Add the mouseTheta and mousePhi to the userInputTheta and userInputPhi
            this.userInputTheta += this.mouseTheta* (
                isFPS ? -1 : 1
            );
            this.userInputPhi += this.mousePhi;

            // Reset mouseTheta and mousePhi after they've been added
            this.mouseTheta = 0;
            this.mousePhi = 0;
        } else  {
            // If the mouse button is not down, make the camera follow the target
            this.userInputTheta += rotationDelta;
        }

    
        // Update the camera's vertical rotation based on the user's input
        // Subtracting the mouseY component inverts the controls
        this.userInputPhi += this.mouseY * this.ySpeed * this.sensitivity * (
            isFPS ? -1 : 1
        )
        
        
        // Remember the target's current rotation for the next update call
        this.previousTargetRotation = targetRotation;
    
        // The rest of your code...


        // Reset deltaY
        this.deltaY = 0;
        this.userInputPhi = this.clampAngle(this.userInputPhi, this.yMinLimit, this.yMaxLimit);
        var extra = 0;
        if(isFPS) {
            
            extra = 180;
        

        }
        // Set camera rotation
        let euler = new THREE.Euler(
            (this.userInputPhi) * THREE.MathUtils.DEG2RAD, 
            (this.userInputTheta + extra) * THREE.MathUtils.DEG2RAD, 
            0,
            'YXZ'
        );
        let rotation = new THREE.Quaternion();
        rotation.setFromEuler(euler);
        
        
    
        // Calculate desired camera position
        vTargetOffset = new THREE.Vector3(0, -this.targetHeight, 0);
        let position = new THREE.Vector3().copy(this.estimatedTargetPosition);
        position.sub(vTargetOffset);
        if(!isFPS) {

            // Calculate the desired distance
            this.desiredDistance -= this.deltaY * 0.02 * this.zoomRate * Math.abs(this.desiredDistance) * this.speedDistance;
            this.desiredDistance = Math.max(Math.min(this.desiredDistance, this.maxDistance), this.minDistance);

            this.correctedDistance = this.desiredDistance;
            position.sub(new THREE.Vector3(0, 0, this.desiredDistance).applyQuaternion(rotation)); 
    
        
    
            let trueTargetPosition = new THREE.Vector3().copy(this.estimatedTargetPosition);
            trueTargetPosition.sub(vTargetOffset);
        
            // If there was a collision, correct the camera position and calculate the corrected distance
            let isCorrected = false;
        
            this.raycaster.set(trueTargetPosition, position.clone().sub(trueTargetPosition).normalize());
        
            for (let obj of this.objectsInScene) {
                let collisionResults = this.raycaster.intersectObject(obj, true);
                if (collisionResults.length > 0) {
                    let distanceToObject = collisionResults[0].distance;
                    if (distanceToObject < this.correctedDistance) {
                        // Add some extra offset to ensure the camera doesn't clip through the wall
                        this.correctedDistance = Math.max(distanceToObject - this.offsetFromWall, 0);
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
            position = new THREE.Vector3().copy(this.estimatedTargetPosition);
            position.sub(vTargetOffset);
            position.sub(new THREE.Vector3(0, 0, this.currentDistance).applyQuaternion(rotation)); 
        } else if(
            this.target.modelMesh &&
            this.target.modelMesh.visible
            
        ) {

            this.target.modelMesh.visible = false;

        }

        this.camera.rotation.copy(euler);
        this.camera.position.copy(position);

        if(!isFPS)
            this.camera.lookAt(this.estimatedTargetPosition);
            if(this.target.cameraRotation !== null) {
                this.target.cameraRotation = null;
            }
        else {
            if(
                this.target.cameraRotation === null
            ) {
                this.target.cameraRotation = new THREE.Vector3();
                if(!oldTargetRotation) {
                    oldTargetRotation = this.target.mesh.rotation.clone();
                }
            }
            
            this.target.rotation.y = euler.y + Math.PI;

            
        }
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
        
        // Update the theta and phi values based on the mouse movement
        this.mouseTheta += dx * this.xSpeed * degreeToRadian;
        this.mousePhi -= dy * this.ySpeed * degreeToRadian;
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
