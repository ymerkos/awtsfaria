/**
 * B"H
 * Player = Chossid
 */

import * as THREE from 'three';
import {Octree} from 'three/addons/math/Octree.js';
import {Capsule} from 'three/addons/math/Capsule.js';

export default class Player {
    Player() {
        this.controls = ( deltaTime ) => {
            const speedDelta = deltaTime * ( playerOnFloor ? 25 : 8 );
            const backwardsSpeedDelta = speedDelta * 0.7;
            const rotationSpeed = 2.0 * deltaTime; // Adjust as needed
        
            // Forward and Backward controls
            if ( keyStates[ 'KeyW' ] || keyStates[ 'ArrowUp' ] ) {
                playerVelocity.add( getForwardVector().multiplyScalar( speedDelta ) );
            }
        
            if ( keyStates[ 'KeyS' ] || keyStates[ 'ArrowDown' ] ) {
                playerVelocity.add( getForwardVector().multiplyScalar( -backwardsSpeedDelta ) );
            }
        
            // Rotation controls
            if ( keyStates[ 'KeyA' ] ) {
                playerRotation += rotationSpeed; // Rotate player left
            }
        
            if ( keyStates[ 'KeyD' ] ) {
                playerRotation -= rotationSpeed; // Rotate player right
            }
        
            // Striding controls
            if ( keyStates[ 'KeyQ' ] ) {
                playerVelocity.add( getSideVector().multiplyScalar( -speedDelta ) );
            }
        
            if ( keyStates[ 'KeyE' ] ) {
                playerVelocity.add( getSideVector().multiplyScalar( speedDelta ) );
            }
        
            // Jump control
            if ( playerOnFloor && keyStates[ 'Space' ]) {
                playerVelocity.y = 15;
                jumping = true;
            } else {
                jumping = false;
            }
        }
    
    
        collisions = () => {
    
            const result = worldOctree.capsuleIntersect( playerCollider );
            playerOnFloor = false;
            if ( result ) {
                playerOnFloor = result.normal.y > 0;
                if ( ! playerOnFloor ) {
                    playerVelocity.addScaledVector( result.normal, - result.normal.dot( playerVelocity ) );
                }
                playerCollider.translate( result.normal.multiplyScalar( result.depth ) );
            }
        }
        update = (deltaTime) => {
    
            let damping = Math.exp( - 4 * deltaTime ) - 1;
    
            if ( ! playerOnFloor ) {
    
                playerVelocity.y -= GRAVITY * deltaTime;
    
                // small air resistance
                damping *= 0.1;
    
            }
    
            playerVelocity.addScaledVector( playerVelocity, damping );
    
            const deltaPosition = playerVelocity.clone().multiplyScalar( deltaTime );
            playerCollider.translate( deltaPosition );
    
            playerCollisions();
    
            playerMesh.position.copy( playerCollider.end );
            playerMesh.rotation.y = playerRotation;
        }
    }
    
}