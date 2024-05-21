//B"H
/**
 * Ayin - An enhanced Three.js camera class that follows a target object in the scene. 
 * Provides functionalities for rotating around the target, zooming in/out, 
 * and collision avoidance with scene objects.
 */import * as THREE from '/games/scripts/build/three.module.js';

 export default class Ayin {
    constructor(olam) {
        var width, height, target;
        this.olam = olam;
        this.width = width;
        this.height = height;
        this.target = target;
        this.isFPS = false;

        this.mouseX = 0;
        this.mouseY = 0;
        this.deltaY =0;

        this.targetHeight = 1.5;

        this.amountToStartHidingTarget = 1.8784726090363273
        this.amountToHideTargetCompletely = 1.7821312470527046
        

        this.distance = 5.0;
        this.offsetFromWall = 3.6

        this.maxDistance = 20;
        this.minDistance = 0.1;
        this.speedDistance = 5;

        this.xSpeed = 75.0;
        this.ySpeed = 75.0;

        this.yMinLimit = -40;
        this.yMaxLimit = 80;

        this.movedRotation = null;

        this.zoomRate = .01;

        this.rotationDampening = 3.0;
        this.zoomDampening = 5.0;

        this.xDeg = 0.0;
        this.yDeg = 0.0;
        this.currentDistance = this.distance;
        this.desiredDistance = this.distance;
        this.correctedDistance = this.distance;
        this.previousResults = new Map(); // Cache for storing previous results

        
        this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
        this.cameraFollower = this.camera.clone();
        this.camera.rotation.order = 'YXZ';
        this.raycaster = new THREE.Raycaster();

        this.mouseRaycaster = new THREE.Raycaster();


        this.objectsInScene = [];

        this.userInputTheta = 0;
        this.userInputPhi = 0;
     
        this.mouseIsDown = false;

        this.lastDistance = null;

        this.panAmount = 0.5;
    }

    get target() {
        return this._target;
    }

    set target(v) {
        this._target = v;
        if(v && typeof(v.height) == "number") {
            this.targetHeight = v.height;
        }
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    updateSceneObjects(newObjects) {
        this.objectsInScene = newObjects;
        this.previousResults.clear(); // Clear cache when scene objects change
    }

    performOptimizedRaycasting(isCorrected) {
        let isSceneChanged = this.isSceneChanged();

        for (let obj of this.objectsInScene) {
            let collisionResults;
            if (isSceneChanged || !this.previousResults.has(obj)) {
                collisionResults = this.raycaster.intersectObject(obj, true);
                this.previousResults.set(obj, collisionResults);
            } else {
                collisionResults = this.previousResults.get(obj);
            }

            if (collisionResults.length > 0) {
                let distanceToObject = collisionResults[0].distance - this.offsetFromWall;
                if (distanceToObject < this.correctedDistance) {
                    this.correctedDistance = distanceToObject;
                    isCorrected = true;
                }
            }
        }

        return isCorrected;
    }

    isSceneChanged() {
        // Implement logic to determine if scene objects have changed
        // This can be based on a flag that is set when objects are added/removed/modified
        return false;
    }

    clampAngle(angle, min, max) {
        if (angle < -360)
            angle += 360;
        if (angle > 360)
            angle -= 360;
        return Math.max(Math.min(angle, max), min);
    }
    
    sensitivity = 0.001;

    sentToOlam = false;
    update() {
        if (!this.target) return;

        this.newMovement=false
        if(
            this.rightMouseIsDown &&
            this.mouseIsDown
        ) {
            if(this.target.olam) {
                this.target.olam.ayshPeula("setInput", {
                    code: "KeyW"
                })
                this.sentToOlam = true;
            }    
        } else {
            if(this.sentToOlam) {
                this.sentToOlam = false;
                this.target.olam.ayshPeula("setInputOut", {
                    code: "KeyW"
                })
            }
        }


        if(!this.isFPS) {
            if(this.lastDistance) {
                this.desiredDistance = this.lastDistance;
                this.lastDistance = null; 
                var f = this.target.modelMesh || this.target.mesh;
                f.visible = true;

                this.target.rotation.y = this.userInputTheta 
                * THREE.MathUtils.DEG2RAD;
                this.previousTargetRotation = this.target.rotation.y * 180/Math.PI;

                this.target.rotateOffset = 0;
            } else {
                this.desiredDistance -= this.deltaY * 0.02 * this.zoomRate * Math.abs(this.desiredDistance) * this.speedDistance;
                this.desiredDistance = Math.max(Math.min(this.desiredDistance, this.maxDistance), this.minDistance);
            }
        } else {
            if(this.lastDistance === null) {
                this.lastDistance = this.desiredDistance;
                var f = this.target.modelMesh || this.target.mesh;

                f.visible = false;
                this.target.rotation.y = this.userInputTheta 
                * THREE.MathUtils.DEG2RAD;
                this.previousTargetRotation = this.target.rotation.y * 180/Math.PI;

                this.target.rotateOffset = 0;
            }
            this.desiredDistance = 0;
        }
        let vTargetOffset;
    
        // Get the target's rotation in degrees
        this.targetRotation = this.target.mesh.rotation.y * 180 / Math.PI;
 
        // If it's the first update call, set the previous rotation to the current one
        if (this.previousTargetRotation === undefined) {
            this.previousTargetRotation = this.targetRotation;
        }
    
        // Compute the change in the target's rotation
        let rotationDelta = this.targetRotation - this.previousTargetRotation;
    
        
        // The rest of your code...
         // Calculate the desired distance

        if(!this.isFPS) {
            
          // Update the camera's horizontal rotation based on the target's rotation and the user's input
            if (this.mouseIsDown || this.rightMouseIsDown) {
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
            this.previousTargetRotation = this.targetRotation;

            
        } 

        
        // Reset deltaY
        this.deltaY = 0;
        this.userInputPhi = this.clampAngle(this.userInputPhi, this.yMinLimit, this.yMaxLimit);
    
        let rotation = null;
        let position = null;

        // If there was a collision, correct the camera position and calculate the corrected distance
        let isCorrected = false;
        // Set camera rotation
        this.euler = new THREE.Euler(this.userInputPhi * THREE.MathUtils.DEG2RAD, this.userInputTheta * THREE.MathUtils.DEG2RAD, 0, 'YXZ');
        rotation = new THREE.Quaternion();
        rotation.setFromEuler(this.euler);
    
        
        this.correctedDistance = this.desiredDistance;
    
        // Calculate desired camera position
        vTargetOffset = new THREE.Vector3(0, -this.targetHeight, 0);
        position = new THREE.Vector3().copy(this.target.mesh.position);
        position.sub(vTargetOffset);
        position.sub(new THREE.Vector3(0, 0, this.desiredDistance).applyQuaternion(rotation)); 
    
        
        
        
        if(this.isFPS) {
            if(this.mouseIsDown) {
               
            } else {

               
            }
        } else {
    


            
            // Check for collision using the true target's desired registration point as set by user using height
            let trueTargetPosition = new THREE.Vector3().copy(this.target.mesh.position);
            trueTargetPosition.sub(vTargetOffset);
        
            
        
            this.raycaster.set(trueTargetPosition, position.clone().sub(trueTargetPosition).normalize());
        
       
            
            // Assuming raycaster is set up and pointing in the right direction
            let collisionResult = this.olam.worldOctree.rayIntersect(this.raycaster.ray);

            if (collisionResult) {
                // collisionResult contains the nearest intersection
                let distanceToObject = collisionResult.distance - this.offsetFromWall;
                if (distanceToObject < this.correctedDistance) {
                    this.correctedDistance = distanceToObject;
                    isCorrected = true;
                }
            }
/*
            let isSceneChanged = true//this.isSceneChanged();

            for (let obj of this.objectsInScene) {
                let collisionResults;
                if (isSceneChanged || !this.previousResults.has(obj)) {
                    collisionResults = this.raycaster.intersectObject(obj, true);
                    this.previousResults.set(obj, collisionResults);
                   // console.log("Got results!",collisionResults,this.previousResults.get(obj))
                } else {
                    collisionResults = this.previousResults.get(obj);
                }

                if (collisionResults.length > 0) {
                    let distanceToObject = collisionResults[0].distance - this.offsetFromWall;
                    if (distanceToObject < this.correctedDistance) {
                        this.correctedDistance = distanceToObject;
                        isCorrected = true;
                    }
                }
            }

            */
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
        
        
       
        
        var did = false;
        if(this.isFPS) {
            if(
                this.mouseIsDown ||
                this.rightMouseIsDown
            ) {
               
                this.target.rotation.y = this.euler.y;
                
            }
            else {
                did = true;
                
                this.euler.y = this.target.rotation.y
                rotation = new THREE.Quaternion();
                rotation.setFromEuler(this.euler);
                position = new THREE.Vector3().copy(this.target.mesh.position);
                position.sub(vTargetOffset);
                position.sub(new THREE.Vector3(0, 0, this.currentDistance).applyQuaternion(rotation)); 
                this.userInputTheta = this.euler.y * 180/Math.PI
               
           
            }
        } else if(this.rightMouseIsDown) {
            this.target.rotation.y = this.euler.y;
        }

        this.camera.rotation.copy(this.euler);
        if(position) {
            this.camera.position.copy(position);
            this.cameraFollower.position.copy(position);
        }

        var pos = this.target.mesh.position.clone();
        pos.y += this.targetHeight
        this.camera.lookAt(pos);
        this.cameraFollower.lookAt(pos)
        if(did) {
          //  this.userInputTheta = this.euler.y
        }

        this.adjustBlur();
        
    }
    _lastFocalDepth;
    adjustBlur() {
        if(
            !this.olam || 
     
            !this.target ||
            !this.currentDistance ||
            this.dontCopyDepth
        ) {
            return console.log("Skipped")
        };

        var dist = null
        
        // Assuming 'this.target' is the object you want to focus on
        var targetPosition = new THREE.Vector3();
        this.target.mesh.getWorldPosition(targetPosition);
        var roundAmount = 0.0001
        var myPos = new THREE.Vector3();
        this.camera.getWorldPosition(myPos)
        // Calculate the distance from the camera to the target object
        var distanceToTarget = Math.floor(myPos.distanceTo(
            targetPosition
        ) * 100000) / 100000;
        
        // Now, use this distance as your focalDepth
        dist = distanceToTarget;
       
        
        var fd = dist

        
        if(this._lastDistance != dist) {
            
            //pp.setFocalDepth(fd);
            //this.amountToHideTargetCompletely = 1.7821312470527046
            if(dist <= this.amountToStartHidingTarget) {
                var amount = Math.max(
                    (dist - this.amountToHideTargetCompletely),
                    0
                );
                this.target.ayshPeula("opacity", amount)
            } else {
                this.target.ayshPeula("opacity", 1)
            }
            
        }
        this._lastDistance = fd;
        

        
    }

    newMovement=false
    
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
        this.newMovement=true
        this.deltaY = deltaY;
    }

    panDown(amount) {
        this.userInputPhi += amount || this.panAmount
    }

    panUp(amount) {
        this.userInputPhi -= amount || this.panAmount
    }

    rotateAroundTarget(dx, dy) {
        this.newMovement=true
        // Convert degrees to radians
        var degreeToRadian = Math.PI / 180;
        // Update the theta and phi values based on the mouse movement
        this.userInputTheta += dx * this.xSpeed * degreeToRadian;
        this.userInputPhi -= dy * this.ySpeed * degreeToRadian;
    }

    getHovered() {
        this.mouseRaycaster.setFromCamera(
            this.olam.pointer,
            this.camera

        );
        var d = this.olam.nivrayimWithDialogue;
        if(!d) return;
        var m = this.olam.meshesToInteractWith;
       
        var ob = this.olam.scene.children;//this.olam.meshesAsPlaceholders;
        if(!Array.isArray(ob)) return;

        let cr = m ? this.mouseRaycaster.intersectObjects(m) : [];
        var oct = this.olam.worldOctree.rayIntersect(this.mouseRaycaster.ray);
       

        if(cr[0]) {
            if(oct) {
                if(cr[0].distance >= oct.distance) {
                    oct.object = oct.triangle.awtsmoosification;
                    return oct;
                }
            }
            return cr[0];
        }
        return cr;
        var isGoodMesh = null;

        if(cr.length > 0) {
            var ob = null;
            cr.forEach(w => {
                ob = w?.object;
                if(isGoodMesh) return;
                if(d.includes(ob?.nivraAwtsmoos) || ob?.hasDialogue) {
                    isGoodMesh = w;
                }
            })
            return isGoodMesh
        }
        
        

        return null;

        //
    }

    onMouseDown(event) {
        if (event.button === 0) {
            this.mouseIsDown  = true;
        }

        if(event.button == 2) {
            this.rightMouseIsDown = true;
        }

    }

    onRightMouseDown() {
        this.rightMouseIsDown = true;
    }

    onRightMouseUp() {
        this.rightMouseIsDown = true;
    }

    onMouseMove(event) {
        
        if(
            (this.mouseIsDown || this.rightMouseIsDown)
            && 
            (event.movementX !== 0 || event.movementY !== 0)
        ) {
            let dx = event.movementX * (this.xSpeed / this.width);
            let dy = event.movementY * (this.ySpeed / this.height);
            
            
            this.rotateAroundTarget(dx, dy);
        }
    }

    onMouseUp(event) {
        if (event.button === 0) {
            this.mouseIsDown = false;
        }

        if(event.button == 2) {
            this.rightMouseIsDown = false;
        }
    }
}
