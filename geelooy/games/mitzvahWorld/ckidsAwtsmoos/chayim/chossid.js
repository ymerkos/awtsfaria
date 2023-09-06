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

const CAMERA_FPS_TOGGLE = "KeyT";

var pressedFps = false;
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
    _optionsSpeed = null;
    constructor(options) {
        super(options);
        
        
        this.rotateOffset = 0;
        this.optionsSpeed = options.speed;
    }
    

    
    /**
     * Controls character movement based on key input
     * 
     * @param {number} deltaTime Time since the last frame
     */
    controls( deltaTime ) {
        
        this.resetMoving();
        //this.rotateOffset  = 0;

        if(this.olam.inputs.RUNNING) {
            this.moving.running = true;
        }
        // Forward and Backward controls
        
        if ( this.olam.inputs.FORWARD ) {
            this.moving.forward = true;
        }

        if ( this.olam.inputs.BACKWARD ) {
            this.moving.backward = true;
        }

        
        // Rotation controls
        if ( 
            this.olam.inputs.LEFT_ROTATE
        ) {
            
            this.moving.turningLeft = true;
        }

        if ( 
            this.olam.inputs.RIGHT_ROTATE
        ) {
            
            this.moving.turningRight = true;
        }

        // Striding controls
        if ( this.olam.inputs.LEFT_STRIDE ) {
            this.moving.stridingLeft = true;
        }

        if ( this.olam.inputs.RIGHT_STRIDE ) {
            this.moving.stridingRight = true;
        }

        
        if(this.olam.inputs.JUMP) {
            this.moving.jump = true;
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

        }

        if(
            this.olam.keyStates[
                CAMERA_FPS_TOGGLE
            ]
        ) {
            if(!pressedFps) {
                this.olam.ayin.isFPS = 
                !this.olam.ayin.isFPS;
                pressedFps = true
            }
        } else {
            pressedFps = false;
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
        if(this.optionsSpeed) {
            this.speed = this.optionsSpeed;
        }
        
    }

    /**
     * Update function called each frame. Controls the character and handles collisions.
     * 
     * @param {number} deltaTime Time since the last frame
     */
    heesHawvoos(deltaTime) {
        this.controls(deltaTime);
        super.heesHawvoos(deltaTime);
    
        
        
       
    }

    
}
