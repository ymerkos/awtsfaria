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

        this.collider = new Capsule(
            new THREE.Vector3(0, 0.35, 0), 
            new THREE.Vector3(0, 1, 0), 0.35
        );
    
        collisions = () => {
    
            const result = olam.worldOctree.capsuleIntersect( collider );
            this.onFloor = false;
            if ( result ) {
                this.onFloor = result.normal.y > 0;
                if ( ! this.onFloor ) {
                    velocity.addScaledVector( result.normal, - result.normal.dot( velocity ) );
                }
                collider.translate( result.normal.multiplyScalar( result.depth ) );
            }
        }
        update = (deltaTime) => {
    
            let damping = Math.exp( - 4 * deltaTime ) - 1;
    
            if ( ! this.onFloor ) {
    
                velocity.y -= olam.GRAVITY * deltaTime;
    
                // small air resistance
                damping *= 0.1;
    
            }
    
            velocity.addScaledVector( velocity, damping );
    
            const deltaPosition = velocity.clone().multiplyScalar( deltaTime );
            collider.translate( deltaPosition );
    
            collisions();
    
            mesh.position.copy( collider.end );
            mesh.rotation.y = this.rotation.y;
        }
    }

    controls( deltaTime ) {
        const speedDelta = deltaTime * ( this.onFloor ? 25 : 8 );
        const backwardsSpeedDelta = speedDelta * 0.7;
        const rotationSpeed = this.rotationSpeed * deltaTime; // Adjust as needed
    
        // Forward and Backward controls
        if ( this.olam.keyStates[ 'KeyW' ] || this.olam.keyStates[ 'ArrowUp' ] ) {
            velocity.add( getForwardVector().multiplyScalar( speedDelta ) );
        }
    
        if ( this.olam.keyStates[ 'KeyS' ] || this.olam.keyStates[ 'ArrowDown' ] ) {
            velocity.add( getForwardVector().multiplyScalar( -backwardsSpeedDelta ) );
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
            velocity.add( getSideVector().multiplyScalar( -speedDelta ) );
        }
    
        if ( this.olam.keyStates[ 'KeyE' ] ) {
            velocity.add( getSideVector().multiplyScalar( speedDelta ) );
        }
    
        // Jump control
        if ( this.onFloor &&this.olam. keyStates[ 'Space' ]) {
            velocity.y = 15;
            jumping = true;
        } else {
            jumping = false;
        }
    }

    /**
     * Starts the Chossid.
     * 
     * @param {Olam} olam The world in which this Chossid is being started.
     */
    async heescheel(olam) {
        super.heescheel(olam);
        // Implement Chossid-specific behavior here
    }
    
}