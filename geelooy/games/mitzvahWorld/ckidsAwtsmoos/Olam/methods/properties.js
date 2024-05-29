/**
 * B"H
 * 
 * inital properties to set for Olam
 */

import * as THREE from '/games/scripts/build/three.module.js';

import { GLTFLoader } from '/games/scripts/jsm/loaders/GLTFLoader.js';
import { Octree } from '/games/scripts/jsm/math/Octree.js';

import WebGPURenderer from "/games/scripts/jsm/gpu/WebGPURenderer.js"
export default class {
    loader = new GLTFLoader(); // A GLTFLoader for loading 3D models

    cameraObjectDirection = new THREE.Vector3();

   

    nivrayimGroup = new THREE.Group();
    
    //DOF effect
    coby = 0;
    // constants
    STEPS_PER_FRAME = 5;
    GRAVITY = 30;
    currentLoadingPercentage = 0;
    destroyed = false;
    
    // Camera-related properties
    aynaweem = []; // "Eyes" or cameras for the scene
   
    
    ayinRotation = 0;
    ayinPosition = new THREE.Vector3();
    cameraObjectDirection = new THREE.Vector3();
    usingGPU = false;
    rendererTemplate = canvas => navigator.gpu  && this.usingGPU
        ? WebGPURenderer : 
            canvas.getContext("webgl2") ? THREE.WebGLRenderer :
            THREE.WebGL1Renderer;
  
    // Scene-related properties
    scene = new THREE.Scene();
    
    isGPU = () => 
        this.usingGPU
    
    // Physics-related properties
    worldOctree = new Octree(); // An octree for efficient collision detection

    achbar = new THREE.Vector2() // mouse position
    // Misc properties
    
    clock = new THREE.Clock(); // A clock for tracking time
    



    nivrayimBeforeLoad = [];
    renderer; // A renderer for the scene
    
    deltaTime = 1; // The amount of time that has passed since the last frame

    /**
     * @property components
     * components are raw bytes
     * of data loaded from fines
     */
    components = {};

    vars = {};

    /**
     * @property assets
     * assets are instantiated JavaScript
     * Objects (such as a GLTF instance)
     * loaded from raw byte data (component).
     * 
     * Useful for reusing same resources 
     * (that can be cloned etc.)
     * 
     * 
     * Can also be used for 
     * global (within world)
     * variables.
     */
    assets = {};
    shlichusHandler = null;

    
    inputs = {
        FORWARD: false,
        BACKWARD: false,
        LEFT_ROTATE: false,
        RIGHT_ROTATE: false,
        LEFT_STRIDE: false,
        RIGHT_STRIDE: false,
        JUMP: false,
        RUNNING: true
    };

    keyBindings = {
        "KeyW": "FORWARD",
        "ArrowUp": "FORWARD",
        "ArrowDown": "BACKWARD",
        "ArrowRight":"RIGHT_ROTATE",
        "ArrowLeft": "LEFT_ROTATE",

        "KeyA": "LEFT_ROTATE",
        "KeyD": "RIGHT_ROTATE",

        "KeyS": "BACKWARD",
        "KeyE": "RIGHT_STRIDE",
        "KeyQ": "LEFT_STRIDE",

        "KeyR": "PAN_UP",
        "KeyF": "PAN_DOWN",

        "Space": "JUMP",

        //"ShiftLeft": "RUNNING",
        //"ShiftRight": "RUNNING"

    }
    completedShlichuseem = []
    startedShlichuseem = []

    // Input-related properties
    keyStates = {}; // State of key inputs
    mouseDown = false; // State of mouse input
    ohros = []; // Lights for the scene
    enlightened = false;
    minimapCanvas = null;
    minimapRenderer = null;
 
    objectsInScene = []; // Objects in the scene

    // Animation-related properties
    isHeesHawvoos = false; // Flag to indicate if the scene is currently animating
    nivrayim = []; // Objects to be animated
    nivrayimWithShlichuseem = [];

    nivrayimWithDialogue = []
    /**
     * @property {Array} nivrayim 
     * creations that can be interacted with.
     * 
     * Used in Tzomaaych class to check,
     * if proximity is set, which pool
     * of objects to search for for collision
     * detection.
     */
    interactableNivrayim = [];

    nivrayimWithPlaceholders = [];
    nivrayimWithEntities = [];
    meshesToInteractWith = [];
    html = null;


    waterMesh = null;
    
    actions = {
        reset(player, nivra/*that collided with*/, olam) {
           // console.log("Reset!",player, nivra)
           
           if(!player.teleporting) {
            
            
            player.teleporting = true;
            setTimeout(() => {
                olam.ayshPeula('reset player position')
                player.teleporting = false
            }, 500)
           }
        }
    }
}