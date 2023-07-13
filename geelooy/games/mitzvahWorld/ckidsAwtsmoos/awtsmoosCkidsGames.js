/**
 * B"H
 * 
 * This is the base class for all nivrayim (creations). Each nivra (creation) has a name and a path to its
 * glTF model.
 * 
 * @class
 */

import {Octree} from '/games/scripts/jsm/math/Octree.js';
import {Capsule} from '/games/scripts/jsm/math/Capsule.js';
import {
    Kav
} from "./roochney.js"
/*
import {
    Kav, Heeoolee
} from "./roochney.js";

*/
export class Nivra{
    /**
     * Constructs a new Nivra.
     * 
     * a Nivra doesn't necessarily have a model or path, can
     * be abstract
     * @param {string} name The name of the nivra.
     * 
     * @property {String} type the type of the creation, "domem" etc.
     * @property {Object} serialized The basic object form of data of 
     *  Nivra, used for importing, exporting and transferring data
     * without including methods etc.
     */
    type = "nivra";
    serialized = {};
    constructor(name) {
        this.name = name;
    }

    serialize() {
        this.serialized = {
            ...this.serialized,
            name: this.name
        };
        return this.serialized;
    }
    /**
     * Starts the nivra. This function can be overridden by subclasses to provide
     * nivra-specific behavior.
     * 
     * @param {Olam} olam The world in which this nivra is being started.
     */
    async heescheel(olam) {
       
        // This can be overridden by subclasses
    }
}

/**
 * Domem is a subclass of Nivra representing inanimate matter.
 * 
 * @class
 * @extends Nivra
 */
export class Domem extends Nivra {
    /**
     * Constructs a new Domem.
     * 
     * @param {Object} options The options for this Domem.
     * @param {string} options.name The name of this Domem.
     * @param {string} options.path The path to the glTF model for this Domem.
     * @param {Object} options.position The initial position of this Domem.
     * @param {Boolean} options.isSolid If an object can be collided with
     * @param {Olam} olam The "world" object to interact with
     * @property {Array} animations the animations loaded from the 3D model, if any
     */
    type = "domem";
    animations = [];
    path = "";
    position = new Kav();
    constructor(options) {
        super(options.name);
        this.path = options.path;
        this.position.set(options.position);
        this.isSolid = !!options.isSolid;
        // Additional properties can be set here
    }

    serialize() {
        super.serialize();
        this.serialized = {
            ...this.serialized,
            position: this.position.serialize(),
            //path: this.path
        }
        return this.serialized;
    }

    /**
     * Starts the Domem. This function can be overridden by subclasses to provide
     * Domem-specific behavior.
     * 
     * @param {Olam} olam The world in which this Domem is being started.
     */
    async heescheel(olam) {
        await super.heescheel(olam);
        try {
            var gltf = await new Promise(async (r,j) => {
                var res;  
                try {
                    res = await olam.boyrayNivra(this);
                } catch(e) {
                    j(e);
                }
                /*initial "creation" in the world and return it.*/
                if(res) r(res); 
                else r(null);
            });
            console.log("doing",this,gltf)
            if(gltf) {
                if(gltf.scene) {
                    this.mesh = gltf.scene;
                }

                if(gltf.animations) {
                    this.animations = gltf.animations;
                }
                olam.hoyseef(this);
                return true;
            }
        } catch(e) {
            throw e;
        }
        // Implement Domem-specific behavior here
    }
}

export class Tzoayach extends Domem {
    constructor(options) {
        super(options);
        // Additional properties can be set here
    }

    async heescheel(olam) {
        super.heescheel(olam);
        // Implement Tzoayach-specific behavior here
    }
}

export class Chai extends Tzoayach {
    constructor(options) {
        super(options);
        // Additional properties can be set here
    }

    async heescheel(olam) {
        super.heescheel(olam);
        // Implement Tzoayach-specific behavior here
    }
}

export class Medabeir extends Chai {
    constructor(options) {
        super(options);
        // Additional properties can be set here
    }

    async heescheel(olam) {
        super.heescheel(olam);
        // Implement Tzoayach-specific behavior here
    }
}

/**
 * Chossid is a subclass of Medabeir representing the player's character.
 * 
 * @class
 * @extends Medabeir
 */

export class Chossid extends Medabeir {
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
    constructor(options) {
       /* super(options);
        
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
    
            collisions();
    
            playerMesh.position.copy( playerCollider.end );
            playerMesh.rotation.y = playerRotation;
        }*/
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
