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
    _speed = 25;
    get speed() {
        return this._speed;
    }

    set speed(v) {
        if(this.animationMixer) {
            var old = this.animationMixer.timeScale;
            var oldSpeed = this._speed;
            this.animationMixer.timeScale = v / oldSpeed;
        }
        this._speed = v;
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
     /**
     * Flag to check if the character is on the floor
     * @type {Boolean}
     */
     onFloor = false;

     // Added moving property
     moving = {
        left: false,
        right: false,
        forward: false,
        backward: false,
        jump: false
    };

    constructor(options) {
        super(options);
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
        
        // Additional properties can be set here
    }

    async heescheel(olam) {
        super.heescheel(olam);
        // Implement Chai-specific behavior here
    }

    async ready() {
        await super.ready();
        
        this.speed = 50;
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


    heesHawvoos(deltaTime) {
        super.heesHawvoos(deltaTime);
        let damping = Math.exp( - 10 * deltaTime ) - 1;
    
        if ( ! this.onFloor ) {
            // Apply gravity if the character is not on the floor
            this.velocity.y -= this.olam.GRAVITY * deltaTime;

            // small air resistance
            damping *= 0.1;
        }

        this.velocity.addScaledVector( this.velocity, damping );
        
        const deltaPosition = this.velocity.clone().multiplyScalar( deltaTime );
        this.collider.translate( deltaPosition );

        this.collisions(deltaTime);

        // Sync character's mesh position with collider's end position
        this.mesh.position.copy( this.collider.start );
        this.mesh.position.y -= this.offset;
        
        
        if(this.cameraRotation === null) {
            this.mesh.rotation.y = this.rotation.y;
            this.modelMesh.rotation.copy(this.mesh.rotation);
            this.modelMesh.rotation.y += this.rotateOffset;
        } else {
            //this.rotation.y = this.cameraRotation.y;
           // this.mesh.rotation.y = this.cameraRotation.y;
         //   this.modelMesh.rotation.copy(this.mesh.rotation);

        }
        this.modelMesh.position.copy(this.mesh.position);

    }
}

