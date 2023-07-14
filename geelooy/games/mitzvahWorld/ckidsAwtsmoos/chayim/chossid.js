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
    * Constructs a new Chossid.
    * 
    * @param {Object} options The options for this Chossid.
    * @param {string} options.name The name of this Chossid.
    * @param {string} options.path The path to the glTF model for this Chossid.
    * @param {Object} options.position The initial position of this Chossid.
    * @param {Array<Object>} options.inventory The initial inventory of this Chossid.
    * 
    * 
    */
   type = "chossid";
   onFloor = false;
   velocity = new THREE.Vector3();
   collider;
   
   constructor(options) {
        super(options);
        this.heesHawveh = true;

        this.collider = new Capsule(
            new THREE.Vector3(0, 0.35, 0), 
            new THREE.Vector3(0, 1, 0), 0.35
        );
        console.log("Col",this.collider,3)
        
    }
    
    collisions(deltaTime) {
        const result = this.olam.worldOctree.capsuleIntersect( this.collider );
        this.onFloor = false;
        if ( result ) {
            this.onFloor = result.normal.y > 0;
            if ( ! this.onFloor ) {
                this.velocity.addScaledVector( result.normal, - result.normal.dot( this.velocity ) );
            }
            this.collider.translate( result.normal.multiplyScalar( result.depth ) );
        }
    }

    controls( deltaTime ) {
        const speedDelta = deltaTime * ( this.onFloor ? 25 : 8 );
        const backwardsSpeedDelta = speedDelta * 0.7;
        const rotationSpeed = this.rotationSpeed * deltaTime; // Adjust as needed
    
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
    setPosition(vec3) {
        this.collider.start.set(
            vec3.x+0, 
            vec3.y+0.35, 
            vec3.z+0
        );
		this.collider.end.set(
            vec3.x+0, 
            vec3.y+1, 
            vec3.z+0
        );
		this.collider.radius = 0.35;
    }
    /**
     * Starts the Chossid.
     * 
     * @param {Olam} olam The world in which this Chossid is being started.
     */
    async heescheel(olam) {
        super.heescheel(olam);
        var vec3=new THREE.Vector3();
        console.log(333,vec3)
        this.setPosition(new THREE.Vector3());
        olam.ayin.target = this;
        // Implement Chossid-specific behavior here
    }

    heesHawvoos(deltaTime) {
        super.heesHawvoos(deltaTime);
        this.controls(deltaTime);
        

        let damping = Math.exp( - 4 * deltaTime ) - 1;
    
        if ( ! this.onFloor ) {

            this.velocity.y -= this.olam.GRAVITY * deltaTime;

            // small air resistance
            damping *= 0.1;

        }
        
        this.velocity.addScaledVector( this.velocity, damping );

        const deltaPosition = this.velocity.clone().multiplyScalar( deltaTime );
        this.collider.translate( deltaPosition );
        
        
        this.collisions(deltaTime);
        this.mesh.position.copy( this.collider.end );
        
        this.mesh.rotation.y = this.rotation.y;
        
    }
    
}