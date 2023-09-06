/**
 * B"H
 */


import Tzomayach from "./tzomayach.js";
import * as THREE from '/games/scripts/build/three.module.js';


import {Capsule} from '/games/scripts/jsm/math/Capsule.js';
import Utils from "../utils.js";
export default class Chai extends Tzomayach {
    type = "chai";
    rotationSpeed;
    
    defaultSpeed = 17;
    _speed = this.defaultSpeed;
    _originalSpeed = this._speed;
    _movementSpeed = this._speed;
    _animationSpeed = this._speed;


    get speed () {
        return this._speed;
    }

    set speed(v) {
        this._speed = v;
    }

    get animationSpeed() {
        return this._animationSpeed;
    }

    set animationSpeed(v) {

        if(this.animationMixer) {
          //  this.animationMixer.timeScale = v * (1 / this.defaultSpeed) ;
        }
        if(this._movementSpeed != this.speed)
            this._movementSpeed = v;
        this._animationSpeed = v;
    }
    /**
     * The velocity vector of the character
     * @type {THREE.Vector3}
     */
    velocity = new THREE.Vector3();  // Added velocity property

    /**
     * Collider object for the character, for detecting and handling collisions
     * @type {Capsule}
     */
    collider;
   
    cameraRotation = null;

    offset = 0;
    gotOffset = false;

    rotateOffset = 0;
    worldDirectionVector = new THREE.Vector3();

    height = 0.75;
    radius = 0.35;

    empty;
    modelMesh = null;
    dontRotateMesh = false;
     /**
     * Flag to check if the character is on the floor
     * @type {Boolean}
     */
     onFloor = false;

     // Added moving property
     moving = {
        stridingLeft: false,
        stridingRight: false,
        forward: false,
        backward: false,
        turningLeft: false,
        turningRight: false,
        jump: false
    };

    /**
     * @method resetMoving
     * @description resets the moving object,
     * for use in a loop to keep track of 
     * if the character is currently moving or not.
     */
    resetMoving() {
        Object.keys(this.moving)
        .forEach(q => {
            this.moving[q] = false;
        })
    }

    chaweeyoosMap = {
        run: "run",
        idle: {
            stand: 0.4,
            "stand 1": 0.6
        },
        walk: "walk",
        jump: "jump",
        falling: "falling",
        "right turn": "right turn",
        "left turn": "left turn"
    }

    /**
     * @method chaweeyoos
     * @description selects the relevant
     * chaweeyoos (animation name) from the map to
     * be used with playChaweeyoos.
     * 
     * The difference between this and just
     * selecting it is regarding those animations
     * that have multiple possibilities and probabilities.
     */
    getChaweeyoos(nm) {
        var c = this.chaweeyoosMap[nm];
        if(!c) return null;
        if(typeof(c) == "string") {
            return c;
        }

        if(typeof(c) == "object") {
            /**
             * select random index based on numbers.
             */
            var ran = Math.random();
            var sum = 0;
            var entries = Object.entries(c);
            var found = null;
            entries.forEach(q => {
                if(found !== null)
                    return found;
                if(
                    typeof(q[1]/*value*/) == "number" &&
                    q[1] <= 1
                ) {
                    sum += q[1]
                }
                if(ran <= sum) {
                    found = q[0];
                }
            });
            return found;
        }
    }

    constructor(options) {
        super(options);
        console.log("HI!!", this.getChaweeyoos)
        this.rotationSpeed = options
            .rotationSpeed || 2;
        this.heesHawveh = true;
    
        this.height = options.height || this.height;
        this.radius = options.radius || this.radius;
        // Create a new collider for the character
        this.collider = new Capsule(
            new THREE.Vector3(0, this.height / 2, 0), 
            new THREE.Vector3(0, this.height, 0), 
            this.radius
        );

        var cm = options.chaweeyoosMap;
        if(cm && typeof(cm) == "object") {
            Object.keys(cm)
            .forEach(k => {
                this.chaweeyoosMap[k] = cm[k];

            })
        }
        
        // Additional properties can be set here
    }

    async heescheel(olam) {
        super.heescheel(olam);
        // Implement Chai-specific behavior here
    }

    async ready() {
        await super.ready();
        this.speed = this.speed;
        this.animationSpeed = this.speed;
        var solid = Utils.getSolid(this.mesh);
        if(solid) {
            solid.visible = false;
        }
        /*set mesh to half down if has collider*/
        /*not really wokring just for test*/
        this.empty = new THREE.Object3D();
        this.olam.scene.add(this.empty);
        this.empty.position.copy(this.mesh.position);
        //this.empty.position.y += 2
        this.modelMesh = this.mesh;
        this.mesh = this.empty;

        this.setPosition(this.mesh.position);
        
    }

    
    /**
     * Checks and handles collisions for the character
     * 
     * @param {number} deltaTime Time since the last frame
     */

    collisions(deltaTime) {
        const result = this.olam.worldOctree.capsuleIntersect( this.collider );
        this.onFloor = false;
    
        if ( result ) {
            this.onFloor = result.normal.y > 0;
    
            if (this.onFloor) {

                if(!this.gotOffset) {
                // We're touching the ground, so calculate the offset
                    this.calculateOffset();
                    this.gotOffset = true;
                }
            }
    
            if ( ! this.onFloor ) {
                this.velocity.addScaledVector( result.normal, - result.normal.dot( this.velocity ) );
            }
    
            this.collider.translate( result.normal.multiplyScalar( result.depth ) );
        }
    }

    async calculateOffset() {
        if (!this.onFloor) {
            return;
        }
    
        // Wait for the next frame so that the collider's position is updated
        await new Promise(resolve => requestAnimationFrame(resolve));
    
        const raycaster = new THREE.Raycaster();
        raycaster.set(this.collider.start, new THREE.Vector3(0, -1, 0));
    
        const intersects = raycaster.intersectObjects(this.olam.scene.children, true);
        if (intersects.length > 0) {
            this.offset = intersects[0].distance;
        }

        
    }

    
    /**
     * Sets the position of the character's collider
     * 
     * @param {THREE.Vector3} vec3 Position to set
     */
    setPosition(vec3) {
        this.collider.start.set(
            vec3.x, 
            vec3.y + this.height / 2, 
            vec3.z
        );
        this.collider.end.set(
            vec3.x, 
            vec3.y + this.height, 
            vec3.z
        );
        this.collider.radius = this.radius;
    }

    resetJump = false;
    jumped = false;
    heesHawvoos(deltaTime) {
        super.heesHawvoos(deltaTime);
        // Speed of movement on floor and in air
        const speedDelta = deltaTime * ( this.onFloor ? this.speed : 8 );
        const backwardsSpeedDelta = speedDelta * 0.7;
       
        // Speed of rotation
        const rotationSpeed = this.rotationSpeed * deltaTime;

        
        var isWalking = false;
        var isWalkingForOrBack = false;
        var isWalkingForward = false;
        var isWalkingBack = false;

        var velocityAddAmounts = [];
        var velocitySpeedDelta = speedDelta;
        this.dontRotateMesh = false;
        
        if(this.moving.forward) {
            if(this.onFloor)
                this.playChaweeyoos("run");
            isWalking = true;
            isWalkingForOrBack = true;
            isWalkingForward = true;
            

            velocityAddAmounts.push([
                    Utils.getForwardVector(
                    this.empty,
                    this.worldDirectionVector
                ),
                speedDelta
            ]);
            

            this.rotateOffset = 0;
        } else if(this.moving.backward) {
            velocityAddAmounts.push([
                    Utils.getForwardVector(
                    this.empty,
                    this.worldDirectionVector
                ),
                -speedDelta
            ]);

            
            isWalkingForOrBack = true;
            isWalkingBack = true;
            
            if(this.onFloor)
                    this.playChaweeyoos(this.getChaweeyoos("run"));

            this.rotateOffset = -Math.PI;
            isWalking = true;
        }

        

        if(this.moving.stridingLeft) {
            this.rotateOffset = Math.PI/2;
            if(isWalkingForward) {
                this.rotateOffset  -= Math.PI / 4
            } else if(isWalkingBack) {
                this.rotateOffset  += Math.PI / 4
            
            }

            if(!isWalkingForOrBack)
            if(this.onFloor)
                this.playChaweeyoos(this.getChaweeyoos("run"));
            isWalking = true;

            velocityAddAmounts.push([
                this.olam.getSideVector(),
                -speedDelta
            ]);
            
            
        } else if(this.moving.stridingRight) {
            this.rotateOffset = -Math.PI/2;
            if(isWalkingForward) {
                this.rotateOffset  += Math.PI / 4
            } else if(isWalkingBack) {
                this.rotateOffset  -= Math.PI / 4
            
            }

            if(!isWalkingForOrBack)
            if(this.onFloor)
                this.playChaweeyoos(this.getChaweeyoos("run"));
            isWalking = true;
            velocityAddAmounts.push([
                this.olam.getSideVector(),
                speedDelta
            ]);
        }

        if(this.moving.turningLeft) {
            if(!isWalking) {
                //this.rotateOffset = -Math.PI/2;
                if(this.onFloor)
                    this.playChaweeyoos(this.getChaweeyoos("left turn"));
                this.dontRotateMesh = true;
            }
            this.rotation.y += rotationSpeed; // Rotate player left

        } else if(this.moving.turningRight) {
            if(!isWalking) {
                if(this.onFloor)
                    this.playChaweeyoos(this.getChaweeyoos("right turn"));
                //this.rotateOffset = Math.PI/2;
                this.dontRotateMesh = true;
            }
            this.rotation.y -= rotationSpeed; // Rotate player right
   
        }

         // Jump control
         if ( this.onFloor && this.moving.jump) {
            this.jumped = true;
            this.velocity.y = 15;
            this.jumping = true;
            
        } else {
            this.jumping = false;
        }
        


        if(this.onFloor) {
            if(this.jumped && !this.moving.jump) {
                this.jumped = false;
            }
            if(!this.resetJump) {
                this.resetChaweeyoos("jump");
                this.resetJump = true;
                
            }
            if(!isWalking) {
                this.playChaweeyoos(this.getChaweeyoos("idle"));
            }
        } else {
            if(this.resetJump) {
                this.resetJump = false;
            }

            if(this.velocity.y > 0 && this.jumped) {
                    this.playChaweeyoos(this.getChaweeyoos("jump"));
            }
            else if (this.jumped && this.velocity.y < -9) {
                
                this.playChaweeyoos(this.getChaweeyoos("falling"));
            } else if (!this.jumped && this.velocity.y < -2) {
                /**
                 * make it fall right when moving downwards
                 * if didn't jump before. If did, rely on part
                 * of jump animation that anyways falls down.
                 */
                this.playChaweeyoos(this.getChaweeyoos("falling"));
            }
        }

        // Sum all vectors without scaling, but also keep track of their original scales.
        let combinedVector = new THREE.Vector3();
        velocityAddAmounts.forEach(q => {
            combinedVector.add(q[0].clone().multiplyScalar(q[1]));
        });

        // Compute the excess scaling factor
        let totalMagnitude = combinedVector.length();
        let maxMagnitude = Math.abs(speedDelta);  // Assuming speedDelta is your limit
        let scalingFactor = 1;  // Default to 1 (no scaling)

        if (totalMagnitude > maxMagnitude) {
            scalingFactor = maxMagnitude / totalMagnitude;
        }

        // Apply the scaling factor to each component and then add it to the velocity.
        velocityAddAmounts.forEach(q => {
            let scaledVector = q[0].clone().multiplyScalar(q[1] * scalingFactor);
            this.velocity.add(scaledVector);
        });
        
        

       


        

        



        let damping = Math.exp( - 20 * deltaTime ) - 1;
    
        if ( ! this.onFloor ) {
            // Apply gravity if the character is not on the floor
            this.velocity.y -= this.olam.GRAVITY * deltaTime;

            // small air resistance
            damping *= 0.1;
        }
        
        
        this.velocity.addScaledVector( this.velocity, damping );
        
        /*
        if(isWalking)
            this.velocity.normalize()
                .multiplyScalar(speedDelta);
*/
        const deltaPosition = this.velocity.clone().multiplyScalar( deltaTime );
        this.collider.translate( deltaPosition );

        this.collisions(deltaTime);

        // Sync character's mesh position with collider's end position
        this.mesh.position.copy( this.collider.start );
        this.mesh.position.y -= this.offset;
        
        
        if(this.cameraRotation === null) {
            this.mesh.rotation.y = this.rotation.y;
            if(!this.dontRotateMesh) {
                this.modelMesh.rotation.copy(this.mesh.rotation);
                this.modelMesh.rotation.y += this.rotateOffset;
            }
            
        }
        this.modelMesh.position.copy(this.mesh.position);
        
    }
}

