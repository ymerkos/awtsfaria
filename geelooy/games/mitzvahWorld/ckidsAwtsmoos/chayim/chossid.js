/**
 * B"H
 * Player = Chossid
 */

import * as THREE from '/games/scripts/build/three.module.js';
import {Capsule} from '/games/scripts/jsm/math/Capsule.js';

/**
 * Chossid is a subclass of Medabeir representing the player's character.
 * 
 * @class
 * @extends Medabeir
 */
import Medabeir from './medabeir.js';

export default class Chossid extends Medabeir {
    /**
     * The type of the character (Chossid)
     * @type {String}
     */
    type = "chossid";

    /**
     * Flag to check if the character is on the floor
     * @type {Boolean}
     */
    onFloor = false;

    /**
     * The velocity vector of the character
     * @type {THREE.Vector3}
     */
    velocity = new THREE.Vector3();

    /**
     * Collider object for the character, for detecting and handling collisions
     * @type {Capsule}
     */
    collider;
   

    offset = 0;
    gotOffset = false;
    /**
     * Constructs a new Chossid (character).
     * 
     * @param {Object} options The options for this Chossid.
     * @param {string} options.name The name of this Chossid.
     * @param {string} options.path The path to the glTF model for this Chossid.
     * @param {Object} options.position The initial position of this Chossid.
     * @param {Array<Object>} options.inventory The initial inventory of this Chossid.
     */
    height = 0.75;
    radius = 0.35;
    constructor(options) {
        super(options);
        this.heesHawveh = true;
        this.height = options.height || this.height;
        this.radius = options.radius || this.radius;
        // Create a new collider for the character
        this.collider = new Capsule(
            new THREE.Vector3(0, this.height / 2, 0), 
            new THREE.Vector3(0, this.height, 0), 
            this.radius
        );
        

     //   this.collider.material.opacity = 0.3;
     //   this.collider.material.needsUpdate = true;
        this.capsuleMesh = new THREE.Mesh(
            new THREE.CapsuleGeometry(this.radius,this.height + this.radius + (this.radius/2),4,8),
            new THREE.MeshBasicMaterial(),
            
        )
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
    /**
     * Controls character movement based on key input
     * 
     * @param {number} deltaTime Time since the last frame
     */
    controls( deltaTime ) {
        // Speed of movement on floor and in air
        const speedDelta = deltaTime * ( this.onFloor ? 25 : 8 );
        const backwardsSpeedDelta = speedDelta * 0.7;

        // Speed of rotation
        const rotationSpeed = this.rotationSpeed * deltaTime;

        // Forward and Backward controls
        if ( this.olam.keyStates[ 'KeyW' ] || this.olam.keyStates[ 'ArrowUp' ] ) {
            this.velocity.add( this.olam.getForwardVector().multiplyScalar( speedDelta ) );
        }

        if ( this.olam.keyStates[ 'KeyS' ] || this.olam.keyStates[ 'ArrowDown' ] ) {
            this.velocity.add( this.olam.getForwardVector().multiplyScalar( -backwardsSpeedDelta ) );
        }

        // Rotation controls
        if ( this.olam.keyStates[ 'KeyA' ] ) {
            this.rotation.y += rotationSpeed; // Rotate player left
        }

        if ( this.olam.keyStates[ 'KeyD' ] ) {
            this.rotation.y -= rotationSpeed; // Rotate player right
        }

        // Striding controls
        if ( this.olam.keyStates[ 'KeyQ' ] ) {
            this.velocity.add( this.olam.getSideVector().multiplyScalar( -speedDelta ) );
        }

        if ( this.olam.keyStates[ 'KeyE' ] ) {
            this.velocity.add( this.olam.getSideVector().multiplyScalar( speedDelta ) );
        }

        // Jump control
        if ( this.onFloor && this.olam. keyStates[ 'Space' ]) {
            this.velocity.y = 15;
            this.jumping = true;
        } else {
            this.jumping = false;
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
    

    /**
     * Starts the Chossid. Sets the initial position and sets this Chossid as the target of the camera
     * 
     * @param {Olam} olam The world in which this Chossid is being started.
     */
    async heescheel(olam) {
        super.heescheel(olam);
        this.setPosition(new THREE.Vector3());
        
    }

    async ready() {
        await super.ready();
        this.olam.ayin.target = this;
        this.olam.scene.add(this.capsuleMesh);

        /*set mesh to half down if has collider*/
        /*not really wokring just for test*/
        var empty = new THREE.Object3D();
        this.olam.scene.add(empty);
        empty.position.copy(this.mesh);
        empty.position.y += 2
        empty.add(this.mesh);
        this.mesh = empty;
    }

    /**
     * Update function called each frame. Controls the character and handles collisions.
     * 
     * @param {number} deltaTime Time since the last frame
     */
    heesHawvoos(deltaTime) {
        super.heesHawvoos(deltaTime);
       // this.capsuleMesh.position.copy(this.mesh.position)
        this.controls(deltaTime);
        
        let damping = Math.exp( - 4 * deltaTime ) - 1;
    
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

        
        this.mesh.rotation.y = this.rotation.y;

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
}
