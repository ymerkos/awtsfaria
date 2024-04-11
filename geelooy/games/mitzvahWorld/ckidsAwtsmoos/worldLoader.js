/**
 * B"H
 * The Olam class represents a 3D World or "Scene" in a game.
 * @extends AWTSMOOS.Nivra
 * @param {Object} options The configuration data for the Olam.
 */
import * as THREE from '/games/scripts/build/three.module.js';
import * as AWTSMOOS from './awtsmoosCkidsGames.js';
import { GLTFLoader } from '/games/scripts/jsm/loaders/GLTFLoader.js';

import {TextGeometry} from "/games/scripts/jsm/utils/TextGeometry.js";
import {FontLoader} from "/games/scripts/jsm/loaders/FontLoader.js";
import WebGPURenderer from "/games/scripts/jsm/gpu/WebGPURenderer.js"
import Ayin from "./ckidsCamera.js";
import { Octree } from '/games/scripts/jsm/math/Octree.js';
import Utils from './utils.js'

import { Mayim } from '/games/scripts/jsm/objects/Mayim.js';
import { Sky } from '/games/scripts/jsm/objects/Sky.js';
import ShlichusHandler from "./shleechoosHandler.js";

import { EffectComposer } from '/games/scripts/jsm/postprocessing/EffectComposer.js';



import {RenderPass} from '/games/scripts/jsm/postprocessing/RenderPass.js';
import MinimapPostprocessing from './postProcessing/minimap.js';
//import AwtsmoosRaysShader from "./shaders/AwtsmoosRaysShader.js";


import Environment from "./postProcessing/environment.js";
import PostProcessingManager from 
"./postProcessing/postProcessing.js";

var ASPECT_X = 1920;
var ASPECT_Y = 1080;
/*
used to match return
events
*/

var official = "official"//can be other shared code
var ID = Date.now();
var styled = false;

/**
 * @class Olam
 * @description
 *
 * The 'Olam' class is a living manifestation of the world, a canvas painted by the Awtsmoos.
 * Its landscapes are vibrant with life, its horizons stretch beyond the ordinary,
 * and within its core resides the ShlichusHandler, a divine conductor orchestrating the shlichuseem (quests).
 *
 * The ShlichusHandler is not merely an attribute; it's the soul of the Olam,
 * a spark of the infinite, ready to guide players on a journey towards the essence of the Creator.
 *
 * @example
 * var olam = new Olam();
 * olam.startShlichusHandler(); // Awakens the ShlichusHandler
 * olam.shlichusHandler.createShlichus(data); // Creates a new shlichus
 */
export default class Olam extends AWTSMOOS.Nivra {
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

    //DOF effect
    coby = 0;
    // constants
    STEPS_PER_FRAME = 5;
    GRAVITY = 30;
    currentLoadingPercentage = 0;
    /**
     * @property activeCamera
     * @description if set,
     * then instead of using 
     * default ayin.camera,
     * it uses this. 
     */
    _activeCamera = null;
    get activeCamera () {
        return this._activeCamera;
    }

    destroyed = false;

    set activeCamera(v) {
        this._activeCamera = v;
        this.refreshCameraAspect();
    }
    // Camera-related properties
    aynaweem = []; // "Eyes" or cameras for the scene
    ayin = new Ayin();
    
    ayinRotation = 0;
    ayinPosition = new THREE.Vector3();
    cameraObjectDirection = new THREE.Vector3();

    rendererTemplate = canvas => //WebGPURenderer
        canvas.getContext("webgl2") ? THREE.WebGLRenderer :
        THREE.WebGL1Renderer;
    // Scene-related properties
    scene = new THREE.Scene();
    ohros = []; // Lights for the scene
    enlightened = false;
    minimapCanvas = null;
    minimapRenderer = null;
 
    objectsInScene = []; // Objects in the scene

    // Animation-related properties
    isHeesHawvoos = false; // Flag to indicate if the scene is currently animating
    nivrayim = []; // Objects to be animated
    nivrayimWithShlichuseem = [];

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
    // Physics-related properties
    worldOctree = new Octree(); // An octree for efficient collision detection

    // Input-related properties
    keyStates = {}; // State of key inputs
    mouseDown = false; // State of mouse input

    // Misc properties
    loader = new GLTFLoader(); // A GLTFLoader for loading 3D models
    clock = new THREE.Clock(); // A clock for tracking time
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
    constructor() {
        super();
        var self = this;
        try {
            ;
            this.ayin = new Ayin(this);

            this.ayin.camera.far = 150;
            this.scene.background = new THREE.Color(0x88ccee);

            var nivrayimGroup = new THREE.Group();
            nivrayimGroup.name = "nivrayimGroup"
            this.nivrayimGroup = nivrayimGroup;
            this.scene.add(nivrayimGroup)
            this.scene.fog = new THREE.Fog(0x88ccee,
             this.ayin.camera.near, this.ayin.camera.far);
            this.startShlichusHandler(this);
            

            var c;
            /*setup event listeners*/
            this.on("keydown", peula => {
                c = peula.code;
                if(!this.keyStates[peula.code]) {
                    this.ayshPeula("keypressed", peula);
                }
                this.keyStates[peula.code] = true;
                
                if(this.keyBindings[c]) {
                    this.inputs[this.keyBindings[c]] = true;
                }
            });

            this.on("setInput", peula => {
                var c = peula.code;
                if(this.keyBindings[c]) {
                    this.inputs[this.keyBindings[c]] = true;
                }
            })

            this.on("setInputOut", peula => {
                var c = peula.code;
                if(this.keyBindings[c]) {
                    this.inputs[this.keyBindings[c]] = false;
                }
            })

            this.on("keyup", peula => {
                c = peula.code;
                this.keyStates[peula.code] = false;

                if(this.keyBindings[c]) {
                    this.inputs[this.keyBindings[c]] = false;
                }
            });

            this.on("presskey", peula => {
                this.ayshPeula("keypressed", peula);
                var c= peula.code;

            })

            this.on('wheel', (event) => {

                this.ayin.deltaY = event.deltaY;
                this.ayshPeula("htmlAction",{
                    shaym:"Debug",
                    properties: {
                        textContent: "In world now got diff: "
                        +event.deltaY
                    }
                });
                this.ayin.zoom(event.deltaY)
            })

            this.on("mousedown", peula => {
                if(!peula.isAwtsmoosMobile)
                    this.ayshPeula("mouseLock", true);

                this.ayin.onMouseDown(peula);
                this.mouseDown = true;
                
            });
            
            this.on("mousemove", peula => {
                if(this.mouseDown) {
                    this.ayin.onMouseMove(peula);
                }
            });

            this.on("mouseup", peula => {
                this.ayshPeula("mouseRelease", true);
                this.ayin.onMouseUp(peula);
                this.mouseDown = false;
                
            });


            this.on("htmlPeula peula", ({peulaName, peulaVars}) => {
                if(!Array.isArray(peulaVars)) {
                    peulaVars = [];
                }
                console.log("Doing",peulaName,peulaVars)
                try {
                    this.ayshPeula(peulaName, ...peulaVars)
                } catch(e) {
                    console.log("Issue",e)
                }
            })
            this.on("minimap zoom in", (amount = 0.25) => {

                if(!this.minimap) return;
                this.minimap.zoom += amount
            });

            this.on("minimap zoom out", (amount = 0.25) => {

                if(!this.minimap) return;
                this.minimap.zoom -= amount
            });

            this.on("start minimap", ({canvas, size}) => {
                this.minimapCanvas = canvas;
                var temp = this.rendererTemplate(
                    canvas
                )
                this.minimapRenderer = new temp({ antialias: true, canvas });
                this.minimapRenderer.isMinimap=true
                this.minimapRenderer.setSize(size.width, size.height, false)
                this.minimap = new MinimapPostprocessing({
                    renderer:this.minimapRenderer,
                    scene: this.scene,
                    olam: this
                })
                
            })

            this.on("update minimap camera", ({position, rotation, targetPosition}) => {
                if(!this.minimap) {
                    return;
                }

                this.minimap.ayshPeula(
                    "update minimap camera", {
                        position, 
                        rotation, 
                        targetPosition
                    }
                )     
            });

            var lastAction;
            var lastTime = Date.now();
            this.on("increase loading percentage", ({
                amount, action, info
            }) => {
                var {
                    nivra
                } = info;
                this.currentLoadingPercentage += amount;
                

                if(this.currentLoadingPercentage < 100) {
                    this.ayshPeula("increased percentage", ({
                        amount, action,
                        total: this.currentLoadingPercentage
                    }))
                }
                else {
                    this.ayshPeula(
                        "finished loading", ({
                            amount,  action,
                            total: this.currentLoadingPercentage 
                        })
                    )
                }
                if(lastAction != action) {
                    console.log("New action: ",action,Date.now() - lastTime, info)
                    lastTime = Date.now();
                }
                lastAction = action;
                
                console.log("Doing action",action,amount)
            });

            this.on("ready", () => {
                
            });

            this.on("ready from chossid", () => {
                setTimeout(() => {
                    console.log("rain starting?")
                    //this.ayshPeula("start rain cycle", 77)
                    console.log("Started rain")
                }, 500)
                
            })


            /**
             * 
             */
            /**
             * In order to determine what the
             * inital size of the window is
             * presumably the first time we 
             * resize the canvas represents this.
             * 
             * Currently relevant for THREE.MeshLine
             * that requires the canvas size parameter
             * 
             */
            var setSizeOnce = false;
            this.on("resize", async peula => {
                await this.setSize(peula.width, peula.height, false);
                await this.ayshPeula(
                    "alert", "Set size: "+this.width +
                    " by "+ this.height,
                    "after trying from: ", peula
                )
                if(!setSizeOnce) {
                    await this.ayshPeula(
                        "alert", "First time setting up " + 
                        this.nivrayim.length
                    )
                    
                    
                    
                   // this.postprocessingSetup()
                    await this.ayshPeula("alert", "Finished first size set")
                    this.ayshPeula("ready to start game")
                    setSizeOnce = true;
                }
                if(this.minimap) {
                    this.minimap.resize()
                }
            });

            this.on("rendered first time", async () => {
                /**
                 * actual time when started
                 */
               
                if(this.minimap) {
                    await this
                    .minimap
                    .setMinimapItems(this.nivrayimWithShlichuseem, "Mission statements")
                }
                

                this.nivrayim.forEach(async n => {
                        
                    await n.ayshPeula("started", n, this);
                });
            })
            
            
            
            this.on("htmlPeula", async ob => {
                if(!ob || typeof(ob) != "object") {
                    return;
                }
                
                for(
                    var k in ob
                ) {
                    await this.ayshPeula("htmlPeula "+k,ob[k]);
                }
            });


            this.on("start rain", d => {
                
                this.environment.startRain()
            })

            this.on("stop rain", d => {
                this.environment.stopRain();
            });

            var _rainCycle = null;
            this.on("start rain cycle", seconds => {
                if(!seconds) seconds = 15

                function rainCycle() {
                    if(!self.environment) return;
                    if(self.environment.isRaining) {
                        self.ayshPeula("stop rain")
                    } else
                        self.ayshPeula("start rain");
                      
                    _rainCycle = setTimeout(
                        rainCycle,
                        seconds * 1000
                    )
                }

                rainCycle();

            });

            this.on("stop rain cycle", () => {
                this.ayshPeula("stop rain");
                if(_rainCycle) {
                    clearTimeout(_rainCycle);
                }
            })

            
            this.on("switch worlds", async(worldDayuh) => {
                var gameState = this.getGameState();
                this.ayshPeula("switchWorlds", {
                    worldDayuh,
                    gameState
                })
            });

            this.on("reset player position", () => {
              
                var c = this.nivrayim.find(w => 
                    w.constructor.name == "Chossid"
                );
                if(!c) return console.log("couldn't find player");
                if(this.playerPosition) {
                    console.log("Resseting position",this.playerPosition)
                    try {
                        c
                        .ayshPeula(
                            "change transformation", {
                                position: this
                                    .playerPosition
                            }
                        );
                        console.log("Changed",this.playerPosition,c)
                    } catch(e) {
                        console.log(e)
                    }
                } else {
                    console.log("No player position!?")
                }
            });

            this.on("save player position", () => {
                var c = this.nivrayim.find(w => 
                    w.constructor.name == "Chossid" 
                );
                if(!c) return console.log("no player found");
                this.playerPosition = c.mesh.position.clone();
            //    console.log("Saved!",this.playerPosition,c.mesh.position,c.modelMesh.position)
            });

            this.on("destroy", async() => {
                for(var nivra of this.nivrayim) {
                    await this.sealayk(
                        nivra
                    );
                    
                }
                this.components = {};
                this.vars = {};
                this.ayshPeula("htmlDelete", {
                    shaym: `ikarGameMenu`
                });
                this.renderer.renderAsyncLists.dispose();
            

                            // Function to dispose materials
                var disposeMaterial = (material) => {
                    material.dispose(); // Dispose of the material
                    if (material.map) material.map.dispose(); // Dispose of the texture
                    if (material.lightMap) material.lightMap.dispose();
                    if (material.bumpMap) material.bumpMap.dispose();
                    if (material.normalMap) material.normalMap.dispose();
                    if (material.specularMap) material.specularMap.dispose();
                    if (material.envMap) material.envMap.dispose();
                    // Dispose of any other maps you may have
                };
                
                // Function to dispose hierarchies
                var disposeHierarchy = (node, callback) => {
                    for (var child of node.children) {
                    disposeHierarchy(child, callback);
                    callback(child);
                    }
                };
                
                // Function to dispose node (geometry, material)
                var disposeNode = (node) => {
                    if (node instanceof THREE.Mesh) {
                    if (node.geometry) {
                        node.geometry.dispose(); // Dispose of geometry
                    }
                
                    if (node.material instanceof THREE.Material) {
                        // Dispose of material
                        disposeMaterial(node.material);
                    } else if (Array.isArray(node.material)) {
                        // In case of multi-material
                        for (var material of node.material) {
                        disposeMaterial(material);
                        }
                    }
                    }
                };
                
                // Call this function when you want to clear the scene
                var clearScene = (scene, renderer) => {
                    disposeHierarchy(scene, disposeNode); // Dispose all nodes
                    scene.clear(); // Remove all children
                
                    // Dispose of the renderer's info if needed
                    if (renderer) {
                    renderer.dispose();
                    }
                
                    // Clear any animation frames here
                    // cancelAnimationFrame(animationFrameId);
                    
                    // Remove any event listeners if you have added them to the canvas or renderer
                };
                if(this.scene && this.renderer) {
                    clearScene(
                        this.scene,
                        this.renderer
                    )
                }
                this.clearAll();
                this.nivrayim = [];
                this.nivrayimWithPlaceholders = [];
                
                delete this.renderer;
                delete this.scene;
                
                delete this.worldOctree;

                this.destroyed = true;
                

                
            });

            this.on("get shlichus data", shlichusID => {
                var shl = this.modules.shlichuseem;
                if(!shl) return null;
                if(typeof(shl) != "object") {
                    return null;
                }
                var found = null;
                Object.keys(shl).forEach(w=> {
                    if(found) return;
                    var sh = shl[w];
                    if(sh.id == shlichusID) {
                        found = sh;
                    }
                });
                return found;
            });

            //nivra.iconPath = "indicators/exclamation.svg"
            this.on("is shlichus available", shlichusID => {
                if(Array.isArray(shlichusID)) {
                    var hasIt = false;
                    for(var k of shlichusID) {
                        var isItAvailable = this.ayshPeula("is shlichus available",k);
                        if(isItAvailable) {
                            hasIt = isItAvailable;
                            return hasIt;
                        }
                    }
                }
                let shlichusData =  this.ayshPeula("get shlichus data", shlichusID);
                if(!shlichusData) {
                    return null;
                }
                
                var r = shlichusData.requires;
                if(!r) return shlichusData;
                var st = r.started;
                if(Array.isArray(st)) {
                    /**
                     * if it requires certain shlichuseem to be started check
                     * if they are ALL started
                     */
                    var allStarted = true;
                    for(var n of st) {
                        var started = this.ayshPeula("is shlichus started", n);
                  
                        if(!started) {
                            allStarted = false;
                            return allStarted;
                        }
                    }
                    
                    return shlichusData;
                }
                return shlichusData;
            })
            /**
             * Gets most recent shlichus data in chain of shlichuseem.
             * 
             * @param {number} shlichusID - The ID of the STARTING shlichus.
             * @returns {number|null} The ID of the next shlichus 
             * in the chain that hasn't been completed,
             *  or null if all are completed.
             */
            this.on("get next shlichus data",  (shlichusID) => {
                try {
                    let currentShlichusData =  this.ayshPeula("get shlichus data", shlichusID);
                    
                    if(!currentShlichusData) {
                        
                        return null;
                    }
                    
               //     console.log("Trying",currentShlichusData,shlichusID)

                    var r = currentShlichusData.requires;
                    if(r) {
                        var st = r.started;
                        if(st) {
                            var isStarted = true;
                            if(Array.isArray(st)) {
                                st.forEach(w => {
                                    var started = 
                                    this.ayshPeula("is shlichus started", w);
                                    if(!started) {
                                        isStarted = false;
                                    }
                                })
                            }
                            if(!isStarted) {

                                return null;
                            }
                        }
                    }
                    if(currentShlichusData.type !== "chain") {
                        if(this.completedShlichuseem.includes(shlichusID))
                            return null;

                        return currentShlichusData// null;
                    }
                    if(!currentShlichusData.nextShlichusID) return null;
                    // Recursively check the next shlichus if the current one is completed
                    while (
                        
                        currentShlichusData.nextShlichusID
                    ) {
                        const isDone = this.ayshPeula(
                            "is shlichus completed", 
                            currentShlichusData.id
                        );
                        if (!isDone) {
                            return currentShlichusData;
                        }
        
                        currentShlichusData =  this.ayshPeula(
                            "get shlichus data",
                            currentShlichusData.nextShlichusID
                        );
                    }

                    if(!currentShlichusData) {
                        return null;
                    }
                   
                    // If the chain ends or the 
                    //current shlichus is not completed, return the current shlichus data
                    //(2nd to last one, should be last result at this point)
                    return currentShlichusData.type === "chain" ? currentShlichusData : null;
                } catch (error) {
                    console.error("Error in getting next shlichus data: ", error);
                    return null;
                }
                
            });



            
            this.on("get active shlichus", shlichusID => {
            //    console.log("Trying",shlichusID,this.shlichusHandler)
                if(!this.shlichusHandler) {
                    console.log("NOT!")
                    return null;
                }
                var sh = this.shlichusHandler.getShlichusByID(shlichusID);
                return sh;  
            });

            

            this.on("accept shlichus",async  (shlichusID, giver) => {
                if(!this.shlichusHandler) return null;
                    var shData = this.ayshPeula("get shlichus data", shlichusID);
                    if(!shData) return null;

                    var shl = await this.shlichusHandler.
                        createShlichus(shData, giver);

                    shl.initiate();
                    this.ayshPeula("updateProgress",{
                     
                        ["acceptedShlichus_"+shlichusID]: {
                            shlichusID,
                            time: Date.now()
                        }
                    })

                    /*
                        add to list of started shlichuseem
                        
                    */
                   
                    var ind = this.startedShlichuseem.indexOf(shlichusID);
                    if(ind < 0) {
                        this.startedShlichuseem.push(shlichusID)
                    }
                    return shl;
            });

            this.on("complete shlichus", sID => {
                var ash = this.ayshPeula("get active shlichus", sID)
                if(!ash) return false;

                ash.isActive = false;
                
                this.ayshPeula("updateProgress",{
                     
                    completedShlichus: {
                        shlichusID: sID,
                        time: Date.now()
                    }
                })
                var ind = this.completedShlichuseem.indexOf(sID);
                if(ind < 0) {
                    this.completedShlichuseem.push(sID)
                }

                ash.finish(ash);
            });

            this.on("remove shlichus", sID => {
                var ind = this.startedShlichuseem.indexOf(sID);
                if(ind > -1) {
                    this.startedShlichuseem.splice(ind, 1)
                }
            })
            this.on("is shlichus started", sID => {
                return this.startedShlichuseem.includes(sID)
            });

            this.on("is shlichus completed", sID => {
                return this.completedShlichuseem.includes(sID)
            });

            var sceneEnv;
            var skyRenderTarget;
         
            const parameters = {
                elevation: 12,
                azimuth: 180
            };
            var sun = new THREE.Vector3();
            this.on("start sky", () => {
               // return
                const sky = new Sky();
				sky.scale.setScalar( 10000 );
				this.scene.add( sky );

				const skyUniforms = sky.material.uniforms;

				skyUniforms[ 'turbidity' ].value = 10;
				skyUniforms[ 'rayleigh' ].value = 2;
				skyUniforms[ 'mieCoefficient' ].value = 0.005;
				skyUniforms[ 'mieDirectionalG' ].value = 0.8;


                

			
				sceneEnv = new THREE.Scene();
                this.sky = sky;
                this.ayshPeula("update sun")
            })

            this.on("update sun", () => {
               // return;
                var sky = this.sky;
                if(!sky) return;
                const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
                const theta = THREE.MathUtils.degToRad( parameters.azimuth );

                sun.setFromSphericalCoords( 1, phi, theta );

                sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
                if(this.mayim) {
                    this.mayim.forEach(water => {
                        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();
                    })
                }

                if ( skyRenderTarget !== undefined ) skyRenderTarget.dispose();

                sceneEnv.add( sky );
                //skyRenderTarget = pmremGenerator.fromScene( sceneEnv );
                this.scene.add( sky );

                //this.scene.environment = skyRenderTarget.texture;()
            })
            this.on("start water", async mesh => {
              
               // this.ayshPeula("alert", "WHAT ARE YOU MAYIM",mesh,Mayim)
                var bitmap = await new Promise((r,j) => {

                    new THREE.ImageBitmapLoader().load(
                        'https://firebasestorage.googleapis.com/v0/b/ckids-games.appspot.com/o/chawfawtseem%2Ftextures%2Fwaternormals.jpg?alt=media', 
                        function ( img ) {
                            var texture = new THREE.CanvasTexture(img)
                            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                            r(texture)

                        }
                    )
                });
                
                try {
                    const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
                    var mayim = new Mayim(
                        waterGeometry,
                        {
                            textureWidth: 512,
                            textureHeight: 512,
                            waterNormals: bitmap,
                            sunDirection: new THREE.Vector3(),
                            sunColor: 0xffffff,
                            waterColor: 0x001e0f,
                            distortionScale: 3.7,
                            fog: false
                        }
                    ); 
                   
                    this.scene.add(mayim);
                    mayim.rotation.x = - Math.PI / 2;
                    mayim.updateMatrixWorld(true);
                    mesh.updateMatrixWorld(true)
                    var y = this.placePlaneOnTopOfBox( mayim, mesh);
                    this.resetY = Math.min(-5, y);
                    mesh.visible = false;
                    
                    
                    if(!this.mayim) {
                        this.mayim = [];
                    }
                    this.mayim.push(mayim);
                    
                    this.ayshPeula("start sky");
                    this.ayshPeula("alert", "made mayim",mayim)
                } catch(e) {
                    this.ayshPeula("alert", "issue with mayim",e)
                }
            })

        } catch(e) {

            console.log("Error",e)
            this.ayshPeula("error", {
                code: "constructor_WORLD_PROBLEM",
                details: e,
                message: "An issue happened in the constructor of the "
                +"Olam class, before even starting to load anything."
            })
        }
    }




    async getIconFromType(type) {
        var icon;
		if(type && typeof(type) == "string") {
			var collectableItem = AWTSMOOS[type];
		
			if(collectableItem) {
				var ty = collectableItem.iconId;
				if(ty) {
					icon = ty;
				}
			}
		}
		var iconData = null;
		if(typeof(icon) == "string") {
			try {
				var iconic = await import("../icons/items/"+ icon+".js")
				if(iconic && iconic.default) {
					iconData = iconic.default
				}
			} catch(e){
				
				return null;
			}
		}
		return iconData
    }

    getGameState() {
        var res = {
            nivrayim: this.nivrayim.map(q => ({
                transform: this.getTransformation(q.mesh),
                name: q.name
            })),
            shaym: this.shaym
        };

        return res;
    }

    setGameState(state = {}) {
        if(typeof(state) != "object") {
            state = {};
        }
        if(!state.nivrayim) return;
        if(!state.shaym) return;
        if(!this.nivrayim.length) {
            return false
        }
        for(var n of state.nivrayim) {
            var nivra = this.nivrayim.find(q => 
                q.name && q.name == n.name
            );
            
            if(!nivra) continue;
            
            nivra.ayshPeula("change transformation", n.transform);
            
        }

        return true

    }

    /**
     * Sets the position of one mesh (targetMesh) to the world position of another mesh (sourceMesh),
     * with an option to align the target mesh to the top of the source mesh.
     * @param {THREE.Mesh} sourceMesh - The mesh from which to copy the position.
     * @param {THREE.Mesh} targetMesh - The mesh to which to apply the position.
     * @param {Object} [options] - Optional settings.
     * @param {boolean} [options.alignTop=false] - If true, aligns the bottom of the targetMesh to the top of the sourceMesh.
     */
    setMeshOnTop(sourceMesh, targetMesh) {
        if (!(sourceMesh instanceof THREE.Mesh) || !(targetMesh instanceof THREE.Mesh)) {
          console.error('Invalid arguments: sourceMesh and targetMesh must be instances of THREE.Mesh.');
          return;
        }
      
        // Get world positions of both meshes
        const sourceWorldPos = new THREE.Vector3();
        const targetWorldPos = new THREE.Vector3();
        sourceMesh.getWorldPosition(sourceWorldPos);
        targetMesh.getWorldPosition(targetWorldPos);

        // Calculate the vertical displacement required
        const displacementY = sourceMesh.geometry.boundingBox.max.y - sourceMesh.geometry.boundingBox.min.y;

        // Apply translation to move targetMesh to the top of sourceMesh
        targetMesh.position.y += displacementY;    
    }

    placePlaneOnTopOfBox(plane, box) {
        // Ensure both meshes have updated world matrices
        box.updateMatrixWorld();
        plane.updateMatrixWorld();
    
        // Compute the bounding box of the box mesh to find its top
        const boxBoundingBox = new THREE.Box3().setFromObject(box);
        const boxTopY = boxBoundingBox.max.y;
    
        // Assuming the plane's local axes are aligned with the world axes
        // We'll place the center of the plane on top of the box
        // If the plane's pivot is at its center, we don't need to adjust for the plane's own dimensions
        plane.position.set(plane.position.x, boxTopY, plane.position.z);
        return boxTopY
        // Optionally, if you want the plane to be exactly on top of the box without intersecting,
        // you might want to add a small offset to boxTopY, especially if the plane has some thickness or different pivot
    }
      
      // Example usage:
      // Assuming you have two meshes, sourceMesh and targetMesh
      // setMeshOnTop(sourceMesh, targetMesh);
     /**
     * @method startShlichusHandler
     * @description
     *
     * This method is the key to the Olam's soul, the awakening of the ShlichusHandler.
     * It's a sacred invocation, a dance of creation, where the ShlichusHandler is instantiated,
     * breathing life into the quests and missions.
     *
     * The method resonates with the wisdom of the Awtsmoos, echoing the eternal dance
     * between the finite and the infinite.
     *
     * @example
     * olam.startShlichusHandler(); // The ShlichusHandler is awakened
     */
    startShlichusHandler() {
        this.shlichusHandler = new ShlichusHandler(this); // The ShlichusHandler is born
        // The world trembles, the rivers sing, the mountains bow, a new era begins
    }
    
    /**
     * Load a component and store it in the components property.
     * Components are raw data loaded from a server
     * or stored as static assets directly.
     * @param {String} shaym - The name of the component.
     * @param {String} url - The URL of the component's model.
     */
    async loadComponent(shaym, url) {
        if(typeof(url) == "string") {
            // Fetch the model data
            var response = await fetch(url);

            // Check if the fetch was successful
            if (!response.ok) {
                throw new Error(`Failed to fetch the model from "${url}"`);
            }

            // Get the model data as a Blob
            var blob = await response.blob();

            // Create a URL for the Blob
            var blobUrl = URL.createObjectURL(blob);

            // Store the blob URL in the components property
            this.components[shaym] = blobUrl;
        }

        if(typeof(url) == "object" && url) {
            this.components[shaym] = url;
        }

        if(typeof(url) == "function") {
            var res = await url(this);
            this.components[shaym] = res;
        }

        return shaym;
        
    }

    /**
     * Retrieve a component by its name.
     * @param {String} shaym - The name of the component.
     * @returns {Object|undefined} - The component's data URL, or undefined if the component is not found.
     */
    getComponent(shaym) {
        if(typeof(shaym) != "string") return;

        var awts = shaym.startsWith("awtsmoos://");
        if(awts)
            return this.components[
                shaym.slice(11)
            ];
        var awtsVar = shaym.startsWith("awtsmoos.vars");
        if(awtsVar) {
            return this.vars[
                shaym.slice(16)
            ];
        }
        else return shaym;
    }

    $gc(shaym) {
        return this.getComponent(shaym)
    }

    async loadComponents(components) {
        for (var [shaym, url] of Object.entries(components)) {
            await this.loadComponent(shaym, url);
        }
    }

    modules = {};
    async getModules(modules={}) {
        if(typeof(modules) != "object" || !modules) {
            return;
        }

        var getModulesInValue = async modules => {
            var ks = Object.keys(modules);
            var modulesAdded = {};
            for(var key of ks) {
                
                var v = modules[key];
                if(typeof(v) == "object") {
                    var subModules = await getModulesInValue(v);
                    modulesAdded[key] = subModules;
                   
                } else if(typeof(v) == "string") {
                    var mod = await this.getModule(v);
                    modulesAdded[key] = mod;
                    
                }
            }
            return modulesAdded;
        };

        var mods = await getModulesInValue(modules);
        if(mods) {
            this.modules = {
                ...this.modules,
                ...mods
            }
        }
        return mods;



        
    }

    async getModule(href) {
        if(
            typeof(href) != "string"
        ) return;

        var ob  = null;
        try {
            ob = await import(href);
            if(ob && typeof(ob) != "object") {
                return
            }
            if(!ob.default) {
                return
            }
            return ob.default;
        } catch(e) {
            console.log(e);
            return null;
        }


        

        
    }


    /**
     * @method setAsset simply
     * loads in the instantiated
     * JS object (or other raw data)
     * into the world's assets for later use
     * and local caching. Does not include
     * remote resources. For remote -  see
     * components.
     * @param {String} shaym 
     * @param {*} data 
     */
    setAsset(shaym, data) {
        this.assets[shaym] = data;
    }

    /**
     * @method $ga short for 
     * getAsset.
     * @param {String} shaym 
     */
    $ga(shaym) {
        return this.getAsset(shaym);
    }

    getAsset(shaym) {
        return this.assets[shaym] || null;
    }

    setAssets(assets = {}) {
        if(
            typeof(assets) != "object" ||
            !assets
        ) {
            return;
        }
        Object.keys(assets)
        .forEach(k => {
            this.assets[k] =
            assets[k]
        });
    }

    /**
     * @description gets an entity name
     * across the different current
     * nivrayim that may have it
     */
    getEntity(entityName, nivra=null) {
        var entity/*array of possible
        entities of meshes representing
        the child, see
        "saveEntityInNivra"*/ = 
        nivra ? nivra.entities[entityName] : 
        ((n => n?n.entities[entityName] : null)(this.nivrayim.find(q => q.entities ? 
            q.entities[entityName] : false    
        )));
        if(!entity) return null;
        console.log("GOT entity info",entity);
        var addedTo = null;
        if(entity.forEach)
        entity.forEach(c => {
            if(addedTo) return;
            if(!c.addedTo) {
                addedTo = c;
            }
        });
        
        if(!addedTo/*return first entity*/) {
            return entity[0]
        } else {
            /*
                return entitiy that is availalbe to 
                add to
            */
           return addedTo;
        }
    }

    saveEntityInNivra(entityName, nivra, child) {
        if(!nivra.entities) {
            nivra.entities = {};
        }
        if(!nivra.entities[entityName]) {
            nivra.entities[entityName] = [];
        }
        var ind = nivra.entities[entityName].indexOf(child);
        if(ind < 0) {
            nivra.entities[entityName].push(child);
            
        }
       
    }

     
      
    async loadHebrewFonts() {
        var loader = new FontLoader();
		loader.load('/resources/fonts/Tinos_Bold.json', (font) => {
			this.hebrewLetters = 
				"קראטוןןםפףךלחיעכגדשזסבהנמצתץ"
				.split("");

			this.font = font;
        });
    }
    randomLetter() {
        if(this.hebrewLetters) {
            var r = Math.floor(
                Math.random() * (
                    this.hebrewLetters.length
                )
            );
            var l = this.hebrewLetters[r];
            if(l) return l;
            return this.hebrewLetters[0]
        }
        return "כ"
    }
    randomColor() {
        return new THREE.Color(Math.random(), Math.random(), Math.random());
    }
    colors = {};
    letters = {};
    makeNewHebrewLetter(letter, options={}) {
        if(!this.font) {
            return null;
        }
        var  {colors, letters} = this;
        try {
            if(!options) {
                options = {};
            }
            var color = options.color || "blue";
            var mat;
            var strC = JSON.stringify(color)
            if(!colors[strC]) {
                mat = new THREE.MeshLambertMaterial({
                    color: color,
                   // specular: 0xFFFFFF
                });
                colors[strC] = mat;
            } else {
                mat = colors[strC];
            }
         //   console.log("COLOR",color,strC,mat)
            
            var textGeo;
            if(!letters[letter]) {
                textGeo = new TextGeometry(letter, {
                    font: this.font,
                    size: 0.5,
                    height: 0.1,
                    curveSegments: 12,
                });
                letters[letter] = textGeo;
            } else {
                textGeo = letters[letter]
            }
            
            var textMesh = new THREE.Mesh(textGeo, mat);
            if(options.add) {
                this.nivrayimGroup.add(textMesh)
            }
            if(options.position) {
                try {
                    textMesh.position.copy(options.position);
                } catch(e) {
                    console.log(e)
                }
            }
            return textMesh;
        } catch(e) {
            console.log("ISsue",e)
            return null;
        }
    }
    cameraObjectDirection = new THREE.Vector3();
    getForwardVector() {
        return Utils.getForwardVector(
            this.ayin.camera,
            this.cameraObjectDirection
        )
    }

    getSideVector() {
        
        return Utils.getSideVector(
            this.ayin.cameraFollower,
            this.cameraObjectDirection
        )
    }

    velz = 0;
    deltaTime = 1;
    async heesHawvoos() {
        var self = this;
        var firstTime = false;
        // This will be the loop we call every frame.
        async function go() {
             // Delta time (in seconds) is the amount of time that has passed since the last frame.
            // We limit it to a max of 0.1 seconds to avoid large jumps if the frame rate drops.
            // We divide by STEPS_PER_FRAME to get the time step for each physics update.
            // Note: We moved the calculation inside the loop to ensure it's up to date.
            
            self.deltaTime = Math.min(0.1, self.clock.getDelta())
             // The physics updates.
            // We do this STEPS_PER_FRAME times to ensure consistent behavior even if the frame rate varies.
            var envRendered = false//self.environment.update(self.deltaTime)
            if(self.shlichusHandler) {
                self.shlichusHandler.update(self.deltaTime)
            }

            if(self.mayim) {
                self.mayim.forEach(w => {
                    w.material.uniforms[ 'time' ].value += 1.0 / 60.0;
                })
            }
                

                
          //  for(var i = 0; i < self.STEPS_PER_FRAME; i++) {
                    if(self.nivrayim) {
                        self.nivrayim.forEach(n => 
                            n.isReady && 
                            (n.heesHawveh?
                            n.heesHawvoos(self.deltaTime) : 0)
                        );
                    }

                

                    self.ayin.update(self.deltaTime);


                    

                    
                    
                

                if(self.coby&&self.postprocessing) {
                    var rend = false//self.postprocessingRender();
                    if(!rend) realRender();
                } else {
                    realRender()
                }
           // }
            

            

            async function realRender() {
              
                // The rendering. This is done once per frame.
                if(!firstTime) {
                    firstTime = true;
                    self.ayshPeula("rendered first time")
                    self.ayshPeula("alert", "First time rendering " + self.renderer)
                }
                if(self.renderer) {
                    
                    if(!envRendered) {
                        
                        self.renderer.renderAsync(
                            self.scene,
                            self.activeCamera
                            ||
                            self.ayin.camera
                        );
                    }
                  /*  if(self.composer)
                        self.composer.render();
*/
                    
                }
                
            }
            
            if(!self.destroyed)
                // Ask the browser to call go again, next frame
                requestAnimationFrame(go);
        }
        async function minimapRender() {
            if(self.minimap) {
                await self.minimap.render()
            }
            if(!self.destroyed)
                // Ask the browser to call go again, next frame
                requestAnimationFrame(minimapRender);
        }
        requestAnimationFrame(go);
        requestAnimationFrame(minimapRender);
    }

    renderMinimap() {

    }
	
    


    /** 
     * In the tale of Ayin's quest to illuminate the world,
     * The canvas is our stage, where the story is unfurled.
     * @param {HTMLCanvasElement} canvas - The stage where the graphics will dance.
     * @example
     * takeInCanvas(document.querySelector('#myCanvas'));
     */
    takeInCanvas(canvas, devicePixelRatio = 1) {
       
            
        // With antialias as true, the rendering is smooth, never crass,
        // We attach it to the given canvas, our window to the graphic mass.
        var temp = this.rendererTemplate(
            canvas
        )
        
        this.renderer = new temp({ antialias: true, canvas: canvas });
        if(!this.renderer.compute) this.renderer.compute = () => {}
        if(!this.renderer.renderAsync) {
		this.renderer.clearAsync=this.renderer.clear;



	
            this.renderer.renderAsync = this.renderer.render;
        }
        this.environment = new Environment({
            scene: this.scene
            ,
            renderer: this.renderer,
            camera: this.ayin.camera
        });

        this.renderer.setPixelRatio(
            devicePixelRatio
        )
        //this.renderer.autoClear = false;
        var renderer = this.renderer
       // renderer.shadowMap.enabled = true;
       // renderer.shadowMap.type = THREE.PCFSoftShadowMap;


       
        // On this stage we size, dimensions to unfurl,
        // Setting the width and height of our graphic world.
        this.setSize(this.width, this.height);
        this.ayshPeula("canvased")
         /**
         * other effects
         */
      
        /*this.composer = new EffectComposer(this.renderer);
        var renderPass = new RenderPass(
            this.scene,
            this.camera
        );
        this.composer.addPass(renderPass);
        */
    }

    postprocessingSetup() {
        if(!this.postprocessing)
            this.postprocessing = new PostProcessingManager({
                camera: this.camera,
                scene: this.scene,
                renderer: this.renderer,
                width: this.width,
                height: this.height
            });
        this.postprocessing.postprocessingSetup();
        
    }

    postprocessingRender() {
        if(!this.postprocessing)
            return;

        var rend = this.postprocessing.postprocessingRender();
     
        return rend

    }

    adjustPostProcessing() {
        if(!this.postprocessing)
            return;

        this.postprocessing.setSize({
            width: this.width,
            height: this.height
        })
    }

    get camera() {
        return this.activeCamera || this.ayin.camera ;
    }

    

    /** 
     * As the eyes grow wider, or squint in the light,
     * Our view changes size, adjusting to the sight.
     * @param {Number|Object} vOrWidth - The width of the canvas or an object containing width and height.
     * @param {Number} [height] - The height of the canvas.
     * @example
     * setSize(800, 600);
     * // or 
     * setSize({width: 800, height: 600});
     */
    async setSize(vOrWidth={}, height) {
        let width;

        // If we're given a number, it's simple, it's plain,
        // That's our width, assigned without pain.
        if(typeof vOrWidth === "number") {
            width = vOrWidth;
        } 
        // If instead we're given an object, never fear,
        // Destructure its properties, making width and height clear.
        else if (typeof vOrWidth === "object") {
            ({width, height} = vOrWidth);
        }

        /**
         * Calculate aspect
         * ratio to keep canvas
         * resized at specific ratio
         * so camera angles
         * don't get messed up.
         */

        var desiredAspectRatio = ASPECT_X / ASPECT_Y;
        let oWidth = width; //original Width
        let oHeight = height;
        // Calculate new width and height
        let newWidth = width;
        let newHeight = height;
        if (width / height > desiredAspectRatio) {
            // total width is wider than desired aspect ratio
            newWidth = height * desiredAspectRatio;
            this.ayshPeula("htmlAction", {
                selector: "body",
                methods: {
                    classList: {
                        remove: "sideInGame"
                    }
                }
            });
        } else {
            
            this.ayshPeula("htmlAction", {
                selector: "body",
                methods: {
                    classList: {
                        add: "sideInGame"
                    }
                }
            });
            // total width is taller than desired aspect ratio
            newHeight = width / desiredAspectRatio;
        }

        this.width = newWidth;
        this.height = newHeight;
		
	
        width = newWidth;
        height = newHeight;
        this.ayshPeula("alert", "size setting in function actually",width,height)
        // When both dimensions are numbers, the world is alright,
        // We can set our renderer's size, aligning the sight.
        if(typeof width === "number" && typeof height === "number" ) {
            
            if(this.renderer) {
                this.ayshPeula(
                    "alert", 
                    "set size of renderer ",width,height
                )
                // Updates the size of the renderer context in pixels and let the canvas's style width and height be managed by CSS (the third parameter, false).
                this.renderer.setSize(width, height, false);
            } else {
                this.ayshPeula("alert", "didnt set renderer!")
            }
            
            await this.updateHtmlOverlaySize(
                width, height, 
                desiredAspectRatio
            );

            this.adjustPostProcessing();
            
        }

        this.refreshCameraAspect()
    }
    
    
    async updateHtmlOverlaySize(width, height) {
        if (!this.htmlUI) {
            return;
        }
        
		var differenceFromOriginalX = width / ASPECT_X;
		var difFromOriginalY = ASPECT_Y / height;
        // Set the overlay's style to match the canvas's dimensions and position
        await this.ayshPeula(
            "htmlAction", {
                shaym: `ikarGameMenu`,
                properties: {
                    style: {
                        transform: `scale(${
							differenceFromOriginalX
						})`
                    }
                }
            }
        );
		
		await this.ayshPeula(
            "htmlAction", {
                shaym: `av`,
                properties: {
                    style: {
                        width,
						height
                    }
                }
            }
        );
    }
    
    
    
    
    
    
    
    
    
    
    
 
    
    
    
    
    
    

    /**
     * @method go used for 
     * cross referencing 
     * the result of a callback
     * to only return the "offical"
     * result by a unique ID
     * @param {Array} ob 
     * @returns official result
     * of array 
     */
    go/*get official*/(ob, id=official) {
        if(!Array.isArray(ob)) {
            return ob;
        }
        var f = ob.find(w=>(w?w[id]:null))
        if(f) delete f[id]
        return f
    }
    refreshCameraAspect() {
        // If Ayin's gaze is upon us, it too must heed,
        // The changing size of our canvas, and adjust its creed.
        if(!this.activeCamera) {
            if(this.ayin) {
                this.ayin.setSize(this.width, this.height);
            }
        } else {
            this.activeCamera.aspect = this.width / this.height;
            this.activeCamera.updateProjectionMatrix();
        }
    }


    set pixelRatio(pr) {
        if(!pr) return;
        if(!this.renderer) return;
        this.renderer.setPixelRatio(pr);
        
    }

    ohr()/*light*/{
        this.enlightened = true;
    
        // High quality ambient light for subtle background illumination
        var ambientLight = new THREE.AmbientLight(0xffe8c3, 0.3);
        this.scene.add(ambientLight);
    
        // Key light with warm tone, soft shadow, and dynamic falloff for realism
        var keyLight = new THREE.DirectionalLight(0xffd1a3, 1.5);
        /*keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;  // Improved resolution for detailed shadows
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.camera.near = this.camera.near;
        keyLight.shadow.camera.far = this.camera.far;
        keyLight.position.set(-5, 25, -1);
        keyLight.shadow.bias = -0.0005;*/
    
        // Enhanced shadow frustum settings for more accurate shadow casting
        var frustumSize = 75;
        /*keyLight.shadow.camera.right = frustumSize;
        keyLight.shadow.camera.left = -frustumSize;
        keyLight.shadow.camera.top = frustumSize;
        keyLight.shadow.camera.bottom = -frustumSize;
        keyLight.shadow.radius = 4; // Softened shadow edges*/
        this.scene.add(keyLight);
    
        // Fill light to balance the shadows with a cooler tone for depth
        var fillLight = new THREE.HemisphereLight(0xffe8d6, 0x8d6e63, 0.5);
        fillLight.position.set(2, 1, 1);
        this.scene.add(fillLight);
    
        // Rim light to enhance edge lighting and create a three-dimensional look
        var rimLight = new THREE.SpotLight(0xffe8d6, 0.75);
        rimLight.position.set(-3, 10, -10);
        rimLight.angle = Math.PI / 6;
        rimLight.penumbra = 0.5;
        rimLight.decay = 2;
        rimLight.distance = 100;
        this.scene.add(rimLight);
    
        // Backlight to create depth and separate objects from the background
        var backLight = new THREE.SpotLight(0xffffff, 0.5);
        backLight.position.set(5, 10, 10);
        backLight.angle = Math.PI / 6;
        backLight.penumbra = 0.5;
        backLight.decay = 2;
        backLight.distance = 100;
        this.scene.add(backLight);
    
        // Optional: Add practical lights to enhance the scene's ambiance
        // Example: Soft glowing lights to simulate environmental light sources
    
        this.ohros.push(keyLight, fillLight, rimLight, ambientLight, backLight);
    }

    serialize() {
        super.serialize();
        this.serialized = {
            ...this.serialized,
            nivrayim: this.nivrayim.map(q=>q.serialize())
        };
        return this.serialized;
    }

     /**
     * The method 'boyrayNivra' creates a new instance of a creation, represented by the 'nivra' parameter.
     * The creation can be defined in two ways: by providing a path to a GLTF model, or by defining a 
     * primitive shape using Three.js geometries and materials.
     * If the creation is defined as a GLTF model, it's loaded and added to the scene, potentially to an Octree
     * if flagged as solid. If it's defined as a primitive, a new mesh is created based on the provided 
     * geometry and material parameters.
     *
     * @param {object} nivra - The creation object, either containing a 'path' property to load a GLTF model
     * or a 'golem' property to define a primitive shape.
     * @returns {Promise} A Promise resolving with either the loaded GLTF object or the created mesh.
     *
     * @example
     * var myNivra = { path: '/models/myModel.gltf', isSolid: true };
     * var createdNivra = await boyrayNivra(myNivra);
     * 
     * var myPrimitiveNivra = { 
     *    golem: { 
     *       guf: { BoxGeometry: [1, 1, 1] },
     *       toyr: { MeshLambertMaterial: { color: "white" } } 
     *    } 
     * };
     * var createdPrimitiveNivra = await boyrayNivra(myPrimitiveNivra);
     */
    async boyrayNivra/*createCreation*/(nivra, info) {
        try {
            
            if(
                nivra.path &&
                typeof(nivra.path) == "string"
            ) {
                var derech = nivra.path;
                
                // Check if the path starts with "awtsmoos://"
                if (nivra.path.startsWith('awtsmoos://')) {
                    // Extract the component name from the path
                    //var componentName = nivra.path.slice(11);

                    
                    // Get the component from the Olam
                    var component = this.getComponent(nivra.path);
                    
                    // If the component doesn't exist, throw an error
                    if (!component) {
                        throw new Error(`Component "${componentName}" not found`);
                    }

                    // Use the component's data URL as the path
                    derech = component;
                    nivra.path = derech;
                }



                /**
                 * If has path, load it as GLTF.
                 * If is primitive object. set it's model
                 * as a promitive
                 */
                

                /**
                 * check if GLTF has already
                 * been instantiated.
                 */
                var gltf = null;
                var gltfAsset = this.$ga(
                    "GLTF/" + derech
                );
                /**
                 * TODO officially clone gltf
                 * with skeleton utils
                 */
                
                
                if(0&&gltfAsset) {
                   // gltf = gltfAsset;
                } else { 
                    try {
                        var lastTime = Date.now();
                        gltf = await new Promise((r,j) => {
                            this.loader.load(derech, onloadParsed => {
                                r(onloadParsed)
                            },progress => {
                                var {
                                    loaded,
                                    total
                                } = progress;
                                var percent = loaded/total;
                                var nivrayimLng = info?.nivrayimMade?.length || 1;
                                this.ayshPeula("increase loading percentage", {
                                    amount: 100 * (
                                        percent / nivrayimLng
                                    ) * 3/4,
                                    action: "loading nivra: "+nivra.path
                                })
                                var time = Date.now() - lastTime
                                lastTime = Date.now()
                                console.log("Loading progress!",loaded,total, time,derech)
                            }, error => {
                                console.log(error);
                                r();
                            });
                        })
                    } catch(e) {
                        throw e;
                        console.log("Problem loading",e,gltfAsset)
                    }
                }
                

                if(!gltf) {
                    throw "Couldn't load model!"
                }
                
                if(!gltfAsset) {
                    this.setAsset(
                        "GLTF/"+derech,
                        gltf
                    );
                    
                }
                nivra.asset = gltf;
                var placeholders = {};
                var entities = {};

                var thingsToRemove = [];
                var materials = [];
                gltf.scene.traverse(child => {
                    /*if(child.userData && child.name.includes("Water"))
                        this.ayshPeula("alert", {
                            name: child.name,
                            "loaded child": {
                            
                                userD:child.userData
                            }
                        })*/
                    
                    if(child.userData && child.userData.water) {
                        child.isMesh = false;
                        this.ayshPeula("alert", "WATER IS HERE", child)
                        this.ayshPeula("start water", child)
                    }

                    if(child.userData && child.userData.action) {
                        var ac = this.actions[child.userData.action];
                        
                        console.log("FOUND ACTION", ac)
                        if(ac) {
                            if(!nivra.childrenWithActions) {
                                nivra.childrenWithActions = [];
                            }
                            nivra.childrenWithActions.push(ac);
                            child.awtsmoosAction = (player, nivra) => ac(
                                player, nivra, this
                            );
                        }
                    }
                    /*
                        look for objects that
                        have the custom property "placeholder"
                        with the name of the nivra. for repeating
                        objects can have same name.
                    */
                    if(typeof(child.userData.placeholder) == "string") {
                        var {
                            position, rotation, scale
                        } = this.getTransformation(child)
                        
                        /*
                            for example if i have
                            lots of coins I can 
                            add lots to the list for 
                            different positions
                        */
                        
                        if(!placeholders[child.userData.placeholder])
                            placeholders[child.userData.placeholder] = [];

                        var shlichus = child.userData.shlichus;
                        placeholders[child.userData.placeholder].push(
                            {
                                position, rotation, scale,
                                addedTo: false,
                                ...(/**
                                    some objects
                                    only have placeholders
                                    for a specific mission.
                                */
                                    shlichus ? {
                                        shlichus
                                    } : {}
                                )
                            }
                        );

                        /*console.log("Added placeholder",child.userData.placeholder,
						placeholders[child.userData.placeholder],
						child,nivra)*/
                        thingsToRemove.push(child)
                        //gltf.scene.remove(child);
                        

                    }

                    /**
                     * deal with entities
                     */
                    if(
                        typeof(child.userData.entity)
                        == "string"
                    ) {
                        
                        this.saveEntityInNivra(child.userData.entity, nivra, child)
                         if(nivra.isSolid) {
                            child.isSolid = true;
                         }
                         child.isMesh = true;
                       //  console.log("Saved",nivra.entities,child.userData)
                    }

                    if(child.userData.remove) {
                      //  thingsToRemove.push(child)
                    }

                    


                    /*adds items that aren't player to special list
                    for camera collisions etc.*/
                    if (child.isMesh && !child.isAwduhm) {
                        this.objectsInScene.push(child);

                    } else if(child.isMesh) {
                        if (child.material.map) {

                            ///child.material.map.anisotropy = 4;
            
                        }
                    }

                    if(child.isMesh) {
                        //shadows
                       // child.receiveShadow = true
                       // child.castShadow = true
                    }

                    /*
                        get materials of mesh for easy access later
                            */
                    if(child.material) {
                        var inv = child.userData.invisible
                        
                        //checkAndSetProperty(child, "invisible");
                        
                        
                        Utils.replaceMaterialWithLambert(child);
                        materials.push(child.material)
                        if(inv) {
                            child.material.visible = false;
                        }
                    }

                    
                });
                
                if(nivra.entities) {
                    
                    this.nivrayimWithEntities.push(nivra);
                }
                if(thingsToRemove.length) {
                    thingsToRemove.forEach(q => {
                        gltf.scene.remove(q);
                    });
                    nivra.placeholders = placeholders;
                    
                    this.nivrayimWithPlaceholders.push(nivra);
                }

                


                /*if solid, add to octree*/
                if(nivra.isSolid) {
                    
                    nivra.on(
                        "changeOctreePosition", () => {
                            gltf.scene.traverse(child => {
                                
                                var isAnywaysSolid = 
                                    checkAndSetProperty(child,
                                "isAnywaysSolid");

                                var has = checkAndSetProperty(child, "notSolid", 
                                "isAnywaysSolid");
                                if(!has) //if does not have "not solid" to true
                                {
                                    this.worldOctree.fromGraphNode(child);
                                    child.layers.enable(1)
                                }
                                
                            })
                        }
                    );
                    
                }

                function checkAndSetProperty(obj, prop, exceptProp) {
                    // If the object itself has the notSolid property set to true
                    if (
                        obj.userData && obj.userData[prop]
                        && !obj.userData[exceptProp]
                    ) {
                        
                        setPropToChildren(obj, prop);
                      return true;
                    }
                  
                    // Check its children
                    for (let i = 0; i < obj.children.length; i++) {
                        if(!obj.userData[exceptProp])
                      if (checkAndSetProperty(obj.children[i]), prop) {
                        return true;
                      }
                    }
                  
                    // If none of the children have the notSolid property set to true
                    return false;
                  }
                  
                  function setPropToChildren(obj, prop) {
                    obj.traverse((child) => {
                      if (!child.userData) {
                        child.userData = {};
                      }
                      child.userData[prop] = true;
                    });
                  }

                if(nivra.interactable) {
                    this.interactableNivrayim
                    .push(nivra);
                }


                nivra.materials = materials;
                return gltf;
            } else {
                var golem = nivra.golem || {};/*golem like form, 
                optional input object to allow users to 
                specify what kidn of three mesh to 
                add if not loading a model*/
                if(typeof(golem) != "object")
                    golem = {};
                    
                /*guf is mesh / body, toyr is material. 
                neshama is a different issue*/
                var guf = {"BoxGeometry":[1,1,1]};
                var toyr = {"MeshLambertMaterial":{
                    color:"white"
                }}; /*
                    defaults and also example of format.
                */
                
                /*
                    get first proerpties of object
                    like aboev example since only 
                    one property (entry) per 
                    either geometry or material is needed
                */
                var firstGuf = golem.guf || golem.body;
                var firstToyr = golem.toyr || 
                    golem.material || golem.appearance;

                if(typeof(firstGuf) == "object" && firstGuf) {
                    guf = firstGuf;
                }
                if(typeof(firstToyr) == "object" && firstToyr) {
                    toyr = firstToyr;
                }

                /*get properties*/
                var gufEntries = Object.entries(guf);
                var toyrEntries = Object.entries(toyr);
                
                var chomer /*geometry*/;
                var tzurah /*material*/;
                
                if(
                    THREE[gufEntries[0][0]]
                ) {
                    chomer = new THREE[gufEntries[0][0]](
                        ...gufEntries[0][1]
                    );
                }

                if(
                    THREE[toyrEntries[0][0]]
                ) {
                    tzurah = new THREE[toyrEntries[0][0]](
                        toyrEntries[0][1]
                    );
                }

                
                if(
                    !chomer ||
                    !tzurah
                ) {
                    throw "No model or valid geometry/material was given";
                }
                this.tzurah = tzurah;
                this.chomer = chomer;
                var mesh = new THREE.Mesh(
                    chomer, tzurah
                );

                
                
                return mesh;
            }
            
        } catch(e) {
            console.log(e)
            throw e;
        }

            
    }

    nivrayimBeforeLoad = [];
     /**
     * The method 'hoyseef' adds a given "nivra" (which is an object) to the scene, if the "nivra" object has a 
     * 'mesh' property that is an instance of 'THREE.Object3D'. It also adds the "nivra" to the 'nivrayim' array.
     *
     * @param {object} nivra - The object to be added to the scene. It should have a 'mesh' property that is an 
     * instance of 'THREE.Object3D'.
     * @returns {object|null} The added object, or null if the object could not be added.
     *
     * @example
     * var myNivra = { mesh: new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()) };
     * var addedNivra = await hoyseef(myNivra);
     */
    async hoyseef(nivra) {
        var three;
        if(nivra && nivra.mesh  instanceof THREE.Object3D) {
            three = nivra.mesh;
        } else return null;


        this.nivrayimGroup.add(three);
        
        this.nivrayim.push(nivra);
        this.nivrayimBeforeLoad.push(nivra);
        if(nivra.isSolid) {
            this.ayin.objectsInScene.push(three);
        }
       

        

        return nivra;
    }

    getTransformation(child) {
        child.updateMatrixWorld();
        var position = new THREE.Vector3();
        var rotation = new THREE.Quaternion();
        var scale = new THREE.Vector3();

        child.matrixWorld.decompose(
            position, rotation, scale
        );

        return {
            position, rotation,
            scale
        };
    }

    async doPlaceholderAndEntityLogic(nivra) {
        /**
         * check for shlichus data
         */

        var d = nivra?.dialogue?.shlichuseem;

      
        if(d) {
            this.nivrayimWithShlichuseem.push(nivra);
            nivra.hasShlichuseem = d;
            var isAvailable = this.ayshPeula("is shlichus available", d);
            nivra.iconPath = "indicators/exclamation.svg"
      
            nivra.shlichusAvailable = isAvailable;
            
            
        }

        //placeholder logic
        /**
         * placeholders work like this:
         * each general mesh can have children
         * meshes set up in the 3d modeling software
         * with children that have custom properties
         * "placeholder".
         * 
         * When that happens, then
         * whatever string the 
         * "placeholder" property is set to 
         * is the placeholder name.
         * 
         * When adding nivrayim in code,
         * if the placeholder name property
         * of the nivra matches an available
         * placeholder that's a child 
         * in a general mesh, then that 
         * placeholder
         * is filled up, meaning that
         * the newlty added
         * nivra is positioned at the 
         * position of the child (placeholder).
         * 
         * Then, it is kept track of that
         * the placeholder child mesh is no 
         * longer available, and then if one
         * in code continues to add more placeholders
         * with the same placeholder name, they essntially
         * keep looking for available placeholder child meshes
         * that match the same name, until no more are
         * available.
         * 
         * Also, sometimes placeholders are only associated
         * with specific missions.
         * 
         * In that case we check for the "shlichus" proeprty
         * in the child mesh, that would be set up in the 
         * modeling software, so we can keep track of what
         * items are added where as part of what mission,
         * and make sure to only add some items that
         * are meant for one mission to some positions,
         * even if they share the same placeholder name.
         */
        var nm = nivra.placeholderName;
        if(typeof(nm) == "string") {
            
            this.nivrayimWithPlaceholders.forEach(w=> {
                var pl = w.placeholders;
                
                if(pl[nm]) {
                    
                    var av/*available*/ = pl[nm]
                    .filter(q => (
                        q.shlichus ? 
                        nivra.shlichus == q.shlichus
                        : true
                    ))
                    .find(
                        q=> (
                            !q.addedTo
                        )
                    );
                    if(av) {
                        if(nivra.mesh) {
							
							nivra.ayshPeula("change transformation", {
								position: av.position,
								rotation: av.rotation
							});
                            

                            //nivra.mesh.rotation.copy(av.rotation);
                            av.addedTo = nivra;
                            nivra.addedToPlaceholder = av;

                            

                        } else {
                            console.log("Mesh not added!", nivra)
                        }
                        
                    }
                }
            })
        }


        await this.doEntityDataCheck(nivra)


        await this.doEntityNameCheck(nivra);

        
        

    }

    async doEntityNameCheck(nivra) {
        /**
         * entity logic for "entity name"
         * essntially meaning that if
         * an entity exists on another nivra,
         * it (later) finds that based
         * on the entity name set here
         * and sets the nivra as a reference to it
         */
        var entityName = nivra.entityName;
        /**
         * now, if one enters an
         * entityName to the nivra,
         * that means that it shoud
         * look for any available
         * entities with that name 
         * in the availalbe nivrayim, and
         * if so, then make the mesh of that nivra
         * into the child that already exists.
         * 
         * this means that the nivra
         * being processed is currently just a template.
         */
        if(!entityName) return //console.log("Nothing! entity",nivra);
        var entity = this.getEntity(entityName)
        if(!entity) return //console.log("TRIED entity",entity);
       // console.log("GOT?,entity",entity);
       // nivra.setMesh(entity);
        entity.addedTo = true;
        nivra.moveMeshToSceneRetainPosition(entity)
        nivra.ayshPeula("change transformation", {
            position: entity.position,
            rotation: entity.rotation
        });
        
        nivra.av = entity;
    }

    async doEntityDataCheck(nivra) {
        /**
         * entity logic
         * for parent with sub entities built in
         * 
         * */
        var ks = Object.keys(nivra.entityData);
        

        for(var k of ks) {
            var en = nivra.entityData[k];

            var type = en.type || "Domem";
            if(typeof(type) != "string") {
                type = "Domem"
            }
            var av = this.getEntity(k, nivra)//nivra.entities[k];
            
            if(!av) {
                return 
            }
            var ent = await this.loadNivrayim({
                [type]: [
                    en
                ]
            });
            if(ent) {
                ent.forEach(w=>{
                    w.ayshPeula("change transformation", {
                        position: av.position,
                        rotation: av.rotation
                    });
                    w.av = av;
                })
            }
            
        }
    }

    async goToAnotherWorld(worldText) {

    }
    /**
     * @method sealayk removes a nivra from 
     * the olam if it exists in it
     * @param {AWTSMOOS.Nivra} nivra 
     */

    sealayk(nivra) {
        if(!nivra) return;
        
        if(nivra.isMesh) {
            try {
                if(nivra.isSolid) {
                    
                    this.worldOctree.removeMesh(nivra)
                }
                nivra.removeFromParent();
            } catch(e) {

            }
        }
        console.log("Trying to remove",nivra)
        var m = nivra.mesh;
        try {
            if(m) {
                m.removeFromParent();
                
            }
            if(nivra.modelMesh) {
                nivra.modelMesh.removeFromParent();
            }
            
           
        } catch(e){
            console.log("No",e)
            
        }

        if(nivra.addedToPlaceholder) {
            nivra.addedToPlaceholder.addedTo = null;
        }
        
        if(nivra.isSolid) {
            try {
                if(nivra.mesh)
                    this.worldOctree.removeMesh(nivra.mesh);
                
                return;
            } catch(e){
                console.log(e,"Oct")
            }
        }

        ind = this.nivrayimWithPlaceholders.indexOf(nivra);
        if(ind > -1) {
            this.nivrayimWithPlaceholders.splice(ind, 1);
        }

        ind = this.interactableNivrayim.indexOf(nivra);
        if(ind > -1) {
            this.interactableNivrayim.splice(ind, 1);
        }
        try {
            if(nivra && nivra.ayshPeula) {
                
		        nivra.ayshPeula("sealayk")
            }
        } catch(e) {

        }

        var ind = this.nivrayim.indexOf(nivra)
        if(ind > -1) {
            
           // delete this.nivrayim[ind];
            this.nivrayim.splice(ind, 1);
            nivra.clearAll();
        } else {
            console.log("Couldnt find",nivra,ind)
        }
        
     

        
    }

    async heescheel/*starts the continuous creation*/() {
        this.isHeesHawvoos = true;
        
    }

    async loadNivrayim(nivrayim) {
        
        /**
         * for loading stage:
         * 
         * 2 stages:
         * load Nivrayim, goes up to 100% but has 4 parts.
         * 
         * first initiate each nivra,
         * 1/5th of the 100% total
         * 
         * (each section divided by the number of 
         * nivrayim.)
         * 
         * then 2) heescheel (boyrayNivra) of each,
         * 3) madeAll 
         * 4) ready
         * 5) doPlaceholderLogic to get to 100%
         */
        
        try {
            var nivrayimMade = [];
            var ent = Object.entries(nivrayim)
            for (var [type, nivraOptions] of ent) {
                var ar;
                var isAr = false;
                if(Array.isArray(nivraOptions)) {
                    ar = nivraOptions;
                    isAr = true;
                } else {
                    ar = Object.entries(nivraOptions)
                }
                for (var entry of ar) {
                    var name = null;
                    var options = null;
                    if(isAr) {
                        options = entry;
                        name = options.name;
                    } else {
                        name = entry[0];
                        options = entry[1];
                    }
                    let nivra;

                    var evaledObject = null;
                    
                    try {
                        evaledObject = Utils.evalStringifiedFunctions(
                            options
                        ); /*
                            when sending fucntions via worker 
                            etc. have to be stringified with special
                            string in front so here it checks
                            for that string and returns object
                            with evaled functions, see source for details.
                        */
                        var c = AWTSMOOS[type];
                        if(c && typeof(c) == "function") {
                            nivra = new c({name, ...evaledObject});
                        }
                    } catch(e) {
                        console.log(
                            "Error handling stringified function",
                            options,
                            e,nivra
                        );
                    }
                    
                    if(!nivra) return null;
                    
                    nivrayimMade.push(nivra);
                    /**
                     * for all nivrayim total this
                     * should add up to 1/5th of the total
                     * loading, so need to 
                     * add 1/5th of 100 divided by 
                     * the number of nivrayim for
                     * each nivra to give accurate
                     * percentage loading.
                     */
                    this.ayshPeula(
                        "increase loading percentage", 
                        {
                            amount:(100 * 1/10) / (
                                nivrayimMade.length
                            ),
                            nivra,
                            
                            action: "initting each nivra"
                        }
                    );


                    
                }
            }
            

            
            await this.ayshPeula("alert", "Loaded Nivra models, now initing")
            
            // Processing heescheel function sequentially for each nivra
            for (var nivra of nivrayimMade) {
                if (nivra.heescheel && typeof(nivra.heescheel) === "function") {
                    try {
                        
                        await nivra.heescheel(this, {
                            nivrayimMade
                        });
                        
                    } catch(e) {
                        console.log(
                            "problem laoding nivra",
                            nivra,
                            e
                        );
                    }
                    
                    /**
                     * Since this is also
                     * 1/5th of the total
                     * percentage add that divided
                     * by the current number of nivrayim
                     * for each nivra.
                     */
                    this.ayshPeula(
                        "increase loading percentage", 
                        {
                            amount:(100 * 3/4) / (
                                nivrayimMade.length
                            ),
                            nivra,
                            
                            action: "Loading the model for each nivra",
                            info: {
                                nivra
                            }
                        }
                    );
                }
            }
            
            
            await this.ayshPeula("alert", "Made nivrayim")
            // Processing madeAll and ready function sequentially for each nivra
            for (var nivra of nivrayimMade) {
                if (nivra.madeAll) {
                    await nivra.madeAll(this);
                    /**
                     * Even if the time for each 
                     * function might be different,
                     * still.
                     */
                    this.ayshPeula(
                        "increase loading percentage", 
                        {
                            amount:(100 * 1/8) / (
                                nivrayimMade.length
                            ),
                            nivra,
                            action: "Initializing each nivra"
                        }
                    );
                }
                
                
            }
            
            
            await this.ayshPeula("alert", "placing nivrayim")
			// Processing doPlaceholderLogic function sequentially for each nivra
            for (var nivra of nivrayimMade) {
                await this.doPlaceholderAndEntityLogic(nivra);
                
                this.ayshPeula(
                    "increase loading percentage", 
                    {
                        amount:(100 * 1/8) / (
                            nivrayimMade.length
                        ),
                        nivra,
                        action: "Setting up object placeholders"
                    }
                );
            }

            
            for (var nivra of nivrayimMade) {
                if (nivra.ready) {
                    
                    await nivra.ready();
                    /**
                     * ibid
                     */
                    this.ayshPeula(
                        "increase loading percentage", 
                        {
                            amount:(100 * 1/8) / (
                                nivrayimMade.length
                            ),
                            nivra,
                            action: "Calling ready state for each nivra"
                        }
                    );
                }
            }

            
            await this.ayshPeula("alert", "doing things after nivrayim made")
            
			for(var nivra of nivrayimMade) {
				if(nivra.afterBriyah) {
					await nivra.afterBriyah();
				}
			}

            this.ayshPeula("updateProgress",{
                     
                loadedNivrayim: Date.now()
            })

            

			
			
			
  

            
            await this.ayshPeula("alert", "adding light")

            if(!this.enlightened)
                this.ohr();
            return nivrayimMade;
        } catch (error) {
            console.error("An error occurred while loading: ", error);

        }
    }

    async htmlActions(ar) {
        return await this.ayshPeula("htmlActions",ar)
    }
    
    async htmlAction(
        shaym,
        properties,
        methods,
        selector
    ) {
        if(typeof(shaym) == "object") {
            properties = shaym.properties;
            methods = shaym.methods
            shaym = shaym.shaym
            selector = shaym.selector
        }
        return await this.ayshPeula(
            "htmlAction",
            {
                shaym,
                properties,
                methods,
                selector
            }
        );

    }

    async tzimtzum/*go, create world and load things*/(info = {}) {

        
        
        await this.ayshPeula("alert", "Starting tzimtzum")
        try {
            var on = info.on;
            if(typeof(on) == "object") {
                Object.keys(on)
                .forEach(q=> {
                    this.on(q, on[q]);
                })
                

            }

            if(info.shaym) {
                if(!this.shaym)
                    this.shaym = info.shaym;
            }


            
            await this.loadHebrewFonts();
            if(!info.nivrayim) {
                info.nivrayim = {}
            }
            
            // Load components if any
            if (info.components) {
                await this.loadComponents(info.components);
            }

            if(info.vars) {
                try {
                    this.vars = {...info.vars}
                } catch(e) {}
            }
            if(
                info.assets
            ) {
                this.setAssets(info.assets);
            }

            if(info.modules) {
                await this.getModules(info.modules)
            }
            

            if(info.html) {
                var style = null
                    
                
                if(!styled) { 
                    style = {
                        tag: "style",
                        innerHTML:/*css*/`
                            .ikarGameMenu {
                                
                                
                                position: absolute;
                                transform-origin:center;
                                
                                width:${ASPECT_X}px;
                                height:${ASPECT_Y}px;
                            }

                            .gameUi > div {
                                position:absolute;
                            }
                        `
                    };
                    styled = true;
                }
                var par = {
                    shaym: `ikarGameMenu`,
                    children: [
                        info.html,
                        style
                    ],
                    ready(me, c) {
                        
                    },
                    className: `ikarGameMenu`
                }
                
                
                var stringed = Utils.stringifyFunctions(par);
            
                var cr = await this.ayshPeula(
                    "htmlCreate",
                    stringed
                );

                
                
                this.htmlUI = par;
            }

            /**
             * Load the creations specified in the tzimtzum (start)
             */
            var loaded;
            try {
                
                await this.ayshPeula("alert", "Starting to load nivrayim")
                
                loaded = await this.loadNivrayim(info.nivrayim);
                
                await this.ayshPeula("alert", "finished loading nivrayim and scene")
            } catch(e) {
                
                await this.ayshPeula("alert", "Problem in loading nv")
                console.log("Error",e)
                this.ayshPeula("error", {
                    code: "NO_LOAD_NIVRAYIM",
                    details: e,
                    message: "Couldn't load the Nivrayim"
                })
                return;
            }
            var st = info.gameState[this.shaym];
            if(st && st.shaym == this.shaym) {
                await this.ayshPeula("alert", "setting game state")
                var set = this.setGameState(st);
                
            } else {
                await this.ayshPeula("alert", "loading level for first time")
                
            }
            this.ayshPeula("ready", this, loaded);
            this.ayshPeula(
                "reset loading percentage"
            );
            this.ayshPeula(
                "setup map"
            )
            await this.ayshPeula("alert", "officially ready, hid loading screen")
            return loaded;
        } catch(e) {
            
            await this.ayshPeula("alert", "Problem in tzimtzum")
            console.log("Error",e)
            this.ayshPeula("error", {
                code: "ISSUE_IN_TZIMTZUM",
                details: e,
                message: "Some issue in the Tzimtzum not "
                +"related to Nivrayim loading"
            })
        }
    }
}
