/**
 * B"H
 * Player = Chossid
 */

import * as THREE from '/games/scripts/build/three.module.js';
import {Capsule} from '/games/scripts/jsm/math/Capsule.js';
import Utils from "../utils.js";
/**
 * Chossid is a subclass of Medabeir representing the player's character.
 * 
 * @class
 * @extends Medabeir
 */
import Medabeir from './medabeir.js';

const ACTION_TOGGLE = "KeyC";
const ACTION_SELECT = "Enter";

const CAMERA_PAN_UP = "KeyR";
const CAMERA_PAN_DOWN = "KeyF";

var pressedToggle = false;
var pressedSelect = false;
export default class Chossid extends Medabeir {
    /**
     * The type of the character (Chossid)
     * @type {String}
     */
    type = "chossid";

   

    
    
    /**
     * Constructs a new Chossid (character).
     * 
     * @param {Object} options The options for this Chossid.
     * @param {string} options.name The name of this Chossid.
     * @param {string} options.path The path to the glTF model for this Chossid.
     * @param {Object} options.position The initial position of this Chossid.
     * @param {Array<Object>} options.inventory The initial inventory of this Chossid.
     */
    
    constructor(options) {
        super(options);
        
        

        
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
        this.rotateOffset = 0;
        var isWalking = false;
        // Forward and Backward controls
        if ( this.olam.keyStates[ 'KeyW' ] || this.olam.keyStates[ 'ArrowUp' ] ) {
            this.playChaweeyoos("mihawlaych");
            isWalking = true;
            this.velocity.add( Utils.getForwardVector(
                this.empty,
                this.worldDirectionVector
            ).multiplyScalar( speedDelta ) );
        }

        if ( this.olam.keyStates[ 'KeyS' ] || this.olam.keyStates[ 'ArrowDown' ] ) {
            this.velocity.add( Utils.getForwardVector(
                this.empty,
                this.worldDirectionVector
            ).multiplyScalar( -backwardsSpeedDelta ) );
            this.playChaweeyoos("mihawlaych");
            this.rotateOffset = -Math.PI;
            isWalking = true;
        }

        // Rotation controls
        if ( 
            this.olam.keyStates[ 'KeyA' ]  ||
            this.olam.keyStates["ArrowLeft"]
        ) {
            this.playChaweeyoos("mihawlaych");

            this.rotation.y += rotationSpeed; // Rotate player left
            isWalking = true;
        }

        if ( 
            this.olam.keyStates[ 'KeyD' ] ||
            this.olam.keyStates["ArrowRight"]
        ) {
            this.playChaweeyoos("mihawlaych");
            
    
            this.rotation.y -= rotationSpeed; // Rotate player right
            isWalking = true;
        }

        // Striding controls
        if ( this.olam.keyStates[ 'KeyQ' ] ) {
            this.rotateOffset = Math.PI/2;
            this.playChaweeyoos("mihawlaych");
            isWalking = true;
            this.velocity.add( this.olam.getSideVector().multiplyScalar( -speedDelta ) );
        }

        if ( this.olam.keyStates[ 'KeyE' ] ) {
            this.rotateOffset = -Math.PI/2;
            this.playChaweeyoos("mihawlaych");
            isWalking = true;
            this.velocity.add( this.olam.getSideVector().multiplyScalar( speedDelta ) );
        }

        if(!isWalking) {
            this.playChaweeyoos("stand");
        }

        // Jump control
        if ( this.onFloor && this.olam. keyStates[ 'Space' ]) {
            this.velocity.y = 15;
            this.jumping = true;
        } else {
            this.jumping = false;
        }


        
        this.cameraControls();
        this.dialogueControls();
    }


    cameraControls() {
        if(
            this.olam
            .keyStates[CAMERA_PAN_UP]
        ) {
            this.olam.ayin
            .panUp();
        } else if(
            this.olam.keyStates[CAMERA_PAN_DOWN]
        ) {
            this.olam.ayin
            .panDown();

            console.log("Panning")
        }
    }
    
    dialogueControls() {
        if(!this.talkingWith) {
            return;
        }

        

        
        if(this.olam.keyStates[ACTION_TOGGLE]) {
            if(!pressedToggle) {
                this.talkingWith.toggleOption();
                pressedToggle = true;
            }
        } else {
            pressedToggle = false;
        }

        
        
        if(this.olam.keyStates[ACTION_SELECT]) {
            if(!pressedSelect) {
                this.talkingWith.selectOption();
                pressedSelect = true;
            }
        } else {
            pressedSelect = false;
        }



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
    
        
    }

    /**
     * Update function called each frame. Controls the character and handles collisions.
     * 
     * @param {number} deltaTime Time since the last frame
     */
    heesHawvoos(deltaTime) {
        super.heesHawvoos(deltaTime);
        
        this.controls(deltaTime);
        
       
    }

    
}
