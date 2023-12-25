/**
 * B"H
 * The Olam class represents a 3D World or "Scene" in a game.
 * @extends AWTSMOOS.Nivra
 * @param {Object} options The configuration data for the Olam.
 */
import * as THREE from '/games/scripts/build/three.module.js';
import * as AWTSMOOS from './awtsmoosCkidsGames.js';
import { GLTFLoader } from '/games/scripts/jsm/loaders/GLTFLoader.js';


import Ayin from "./ckidsCamera.js";
import { Octree } from '/games/scripts/jsm/math/Octree.js';
import Utils from './utils.js'

import ShlichusHandler from "./shleechoosHandler.js";

import { EffectComposer } from '../../scripts/jsm/postprocessing/EffectComposer.js';

import { ShaderPass } from '../../scripts/jsm/postprocessing/ShaderPass.js';

import {RenderPass} from '../../scripts/jsm/postprocessing/RenderPass.js';
//import AwtsmoosRaysShader from "./shaders/AwtsmoosRaysShader.js";


import PostProcessingManager from 
"/games/mitzvahWorld/ckidsAwtsmoos/postProcessing/postProcessing.js";

const ASPECT_X = 1920;
const ASPECT_Y = 1080;
/*
used to match return
events
*/

const official = "official"//can be other shared code
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
 * const olam = new Olam();
 * olam.startShlichusHandler(); // Awakens the ShlichusHandler
 * olam.shlichusHandler.createShlichus(data); // Creates a new shlichus
 */
export default class Olam extends AWTSMOOS.Nivra {
    html = null;

    //DOF effect
    coby = 0;
    // Constants
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

    rendererTemplate = canvas => 
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
    constructor() {
        super();
        
        try {
            this.ayin = new Ayin(this);
            this.ayin.camera.far = 150;
            this.scene.background = new THREE.Color(0x88ccee);
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
            
            this.on("start minimap", ({canvas, size}) => {
                this.minimapCanvas = canvas;
                var temp = this.rendererTemplate(
                    canvas
                )
                this.minimapRenderer = new temp({ antialias: true, canvas });
                
                this.minimapRenderer.setSize(size.width, size.height, false)
                
                
            })

            this.on("update minimap camera", ({position, rotation, targetPosition}) => {
                if(!this.minimapCamera) {
                    return;
                }

                if(position) {
                    this.minimapCamera.position.copy(position)
                    if(targetPosition)
                        this.minimapCamera.lookAt(targetPosition)
                }

                if(rotation) {
                    this.minimapCamera.position.copy(rotation)
                }

                
            })
            this.on("increase loading percentage", ({
                amount, action
            }) => {
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
            });

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
                await this.ayshPeula("alert", "Set size: "+this.width +
                    " by "+ this.height)
                if(!setSizeOnce) {
                    await this.ayshPeula("alert", "First time setting up " + 
                    this.nivrayim.length)
                    this.nivrayim.forEach(n => {
                        
                        n.ayshPeula("canvased", n, this);
                    });
                    
                    
                    this.postprocessingSetup()
                    await this.ayshPeula("alert", "Finished first size set")
                    setSizeOnce = true;
                }
            });
            
            
            
            this.on("htmlPeula", async ob => {
                if(!ob || typeof(ob) != "object") {
                    return;
                }
                
                for(
                    const k in ob
                ) {
                    await this.ayshPeula("htmlPeula "+k,ob[k]);
                }
            });

            this.on("switch worlds", async(worldDayuh) => {
                var gameState = this.getGameState();
                this.ayshPeula("switchWorlds", {
                    worldDayuh,
                    gameState
                })
            });

            this.on("destroy", async() => {
                for(var nivra of this.nivrayim) {
                    await this.sealayk(
                        nivra
                    );
                    
                }
                this.components = {};
                this.ayshPeula("htmlDelete", {
                    shaym: `ikarGameMenu`
                });
                this.renderer.renderLists.dispose();
            

                            // Function to dispose materials
                const disposeMaterial = (material) => {
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
                const disposeHierarchy = (node, callback) => {
                    for (const child of node.children) {
                    disposeHierarchy(child, callback);
                    callback(child);
                    }
                };
                
                // Function to dispose node (geometry, material)
                const disposeNode = (node) => {
                    if (node instanceof THREE.Mesh) {
                    if (node.geometry) {
                        node.geometry.dispose(); // Dispose of geometry
                    }
                
                    if (node.material instanceof THREE.Material) {
                        // Dispose of material
                        disposeMaterial(node.material);
                    } else if (Array.isArray(node.material)) {
                        // In case of multi-material
                        for (const material of node.material) {
                        disposeMaterial(material);
                        }
                    }
                    }
                };
                
                // Call this function when you want to clear the scene
                const clearScene = (scene, renderer) => {
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
        } catch(e) {

            console.log("Error",e)
            this.ayshPeula("error", {
                code: "CONSTRUCTOR_WORLD_PROBLEM",
                details: e,
                message: "An issue happened in the constructor of the "
                +"Olam class, before even starting to load anything."
            })
        }
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
        for(const n of state.nivrayim) {
            var nivra = this.nivrayim.find(q => 
                q.name && q.name == n.name
            );
            
            if(!nivra) continue;
            
            nivra.ayshPeula("change transformation", n.transform);
            
        }

        return true

    }

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
            const response = await fetch(url);

            // Check if the fetch was successful
            if (!response.ok) {
                throw new Error(`Failed to fetch the model from "${url}"`);
            }

            // Get the model data as a Blob
            const blob = await response.blob();

            // Create a URL for the Blob
            const blobUrl = URL.createObjectURL(blob);

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

        return this.components[
            shaym.startsWith("awtsmoos://") ? 
            shaym.slice(11) : shaym
        ];
    }

    $gc(shaym) {
        return this.getComponent(shaym)
    }

    async loadComponents(components) {
        for (const [shaym, url] of Object.entries(components)) {
            await this.loadComponent(shaym, url);
        }
    }

    modules = {};
    async getModules(modules={}) {
        if(typeof(modules) != "object" || !modules) {
            return;
        }

        const getModulesInValue = async modules => {
            var ks = Object.keys(modules);
            var modulesAdded = {};
            for(const key of ks) {
                
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
     * @method $a short for 
     * getAsset.
     * @param {String} shaym 
     */
    $a(shaym) {
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
    heesHawvoos() {
        var self = this;
        var firstTime = false;
        // This will be the loop we call every frame.
        function go() {
             // Delta time (in seconds) is the amount of time that has passed since the last frame.
            // We limit it to a max of 0.1 seconds to avoid large jumps if the frame rate drops.
            // We divide by STEPS_PER_FRAME to get the time step for each physics update.
            // Note: We moved the calculation inside the loop to ensure it's up to date.
            
            self.deltaTime = Math.min(0.1, self.clock.getDelta()) / 
            self.STEPS_PER_FRAME;
             // The physics updates.
            // We do this STEPS_PER_FRAME times to ensure consistent behavior even if the frame rate varies.
            
            for (let i = 0; i < self.STEPS_PER_FRAME; i++) {
                

                
                
                if(self.nivrayim) {
                    self.nivrayim.forEach(n => 
                        n.isReady && 
                        (n.heesHawveh?
                        n.heesHawvoos(self.deltaTime) : 0)
                    );
                }

                self.ayin.update(self.deltaTime);


                if(self.shlichusHandler) {
                    self.shlichusHandler.update(self.deltaTime)
                }
                
            }

            if(self.coby&&self.postprocessing) {
                var rend = self.postprocessingRender();
                if(!rend) realRender();
            } else {
                realRender()
            }

            function realRender() {
                self.scene.overrideMaterial = null
                self.renderer.setRenderTarget(null)
                // The rendering. This is done once per frame.
                if(!firstTime) {
                    firstTime = true;
                    self.ayshPeula("alert", "First time rendering " + self.renderer)
                }
                if(self.renderer) {
                    self.renderer.render(
                        self.scene,
                        self.activeCamera
                        ||
                        self.ayin.camera
                    );
                    if(self.composer)
                        self.composer.render();

                    if(self.minimapCanvas) {
                        self.renderMinimap()
                    }
                }
            }
            
            if(!self.destroyed)
                // Ask the browser to call go again, next frame
                requestAnimationFrame(go);
        }
        requestAnimationFrame(go);
    }
	
    minimapCamera = null
    renderMinimap() {
        
        var ppc = this.minimapCamera;
        if(!this.minimapCamera) {
            var size = new THREE.Vector2();
            this.minimapRenderer.getSize(size)
            var {
                x, y
            } = size;

            this.minimapCamera = 
           
            new THREE.PerspectiveCamera(
                70, x / y, 0.1, 1000
            );
            
            ppc = this.minimapCamera
            this.scene.add(ppc)
            this.minimapCamera.updateProjectionMatrix();

            this.minimapComposer = new EffectComposer(
                this.minimapRenderer
            );
            var renderPass = new RenderPass(
                this.scene,
                ppc
            );

            this.minimapShader = {
                name: "minimapShader",
                uniforms: {
                    tDiffuse: {
                        value: null
                    },
                    opacity: {
                        value: 0.8
                    },
                    objectPositions: {
                        type:"v2v",
                        value: Array.from({length:50})
                        .map(w=>new THREE.Vector2(0,0))
                    },
                    numberOfDvarim: {
                        value: 0
                    },
                    playerPos: {
                        value: new THREE.Vector2(0,0)
                    },
                    playerRot: {
                        value: 0.0
                    }
                },
                vertexShader: /*glsl*/`
                    varying vec2 uUv;
                    void main() {
                        uUv = uv;
                        gl_Position =
                        projectionMatrix
                        * modelViewMatrix
                        * vec4(
                            position,
                            1.0
                        );
                        
                    }
                `,
                fragmentShader: /*glsl*/`
                    uniform float opacity;
                    uniform sampler2D tDiffuse;
                    varying vec2 uUv;

                    #define MAX_DVARIM 50

                    uniform vec2 objectPositions[MAX_DVARIM];

                    uniform int numberOfDvarim;


                    uniform vec2 playerPos;
                    uniform float playerRot;



                    // Utility function to rotate a point around the origin
                    vec2 rotatePoint(vec2 point, float angle) {
                        float s = sin(angle);
                        float c = cos(angle);
                        return vec2(
                            c * point.x - s * point.y,
                            s * point.x + c * point.y
                        );
                    }

                    // Function to check if a point is inside a triangle
                    bool pointInTriangle(vec2 pt, vec2 v1, vec2 v2, vec2 v3) {
                        float d1, d2, d3;
                        bool has_neg, has_pos;

                        d1 = sign(pt.x * v1.y - pt.y * v1.x + (v1.x * v2.y - v1.y * v2.x));
                        d2 = sign(pt.x * v2.y - pt.y * v2.x + (v2.x * v3.y - v2.y * v3.x));
                        d3 = sign(pt.x * v3.y - pt.y * v3.x + (v3.x * v1.y - v3.y * v1.x));

                        has_neg = (d1 < 0.0) || (d2 < 0.0) || (d3 < 0.0);
                        has_pos = (d1 > 0.0) || (d2 > 0.0) || (d3 > 0.0);

                        return !(has_neg && has_pos);
                    }


                    // Main function to draw the player triangle
                    bool drawPlayerTriangle(vec2 uv, vec2 playerPos, float playerRot, float size) {
                        // Basic triangle vertices centered around (0,0)
                        vec2 p1 = vec2(0.0, 0.75 * size);  // Top point of the triangle
                        vec2 p2 = vec2(-0.5 * size, -0.75 * size); // Bottom left
                        vec2 p3 = vec2(0.5 * size, -0.75 * size); // Bottom right
                    
                        // Rotate the points based on player rotation
                        p1 = rotatePoint(p1, playerRot);
                        p2 = rotatePoint(p2, playerRot);
                        p3 = rotatePoint(p3, playerRot);
                    
                        // Translate the points to player position
                        p1 += playerPos;
                        p2 += playerPos;
                        p3 += playerPos;
                    
                        // Check if the current fragment is inside the triangle
                        return pointInTriangle(uv, p1, p2, p3);
                    }

                    vec2 normalizeVec2(vec2 v) {
                        vec2 r =  vec2(v + 1.0) / 2.0;
                      //  r.y = r.y-0.5;
                        return r;
                    }

                    void main() {
                        vec4 texel = texture2D(
                            tDiffuse, uUv
                        );
                            
                        /*
                        // Draw player triangle
                        if (drawPlayerTriangle(uUv, playerPos, playerRot, 0.05)) { // Adjust size as needed
                            texel = vec4(1.0, 0.0, 0.0, 1.0); // Red color for the player
                        }*/
                        vec2 v = vec2(playerPos);
                        vec2 u = normalizeVec2(v);
                        //player always in center for now.
                        if (distance(uUv, u) < 0.05) { // Adjust size as needed
                            texel = vec4(0.8, 0.3, 1.0, 1.0); // Yellow color for objects
                        } else {
                           // texel = vec4(1.0,1.0,0.4,1.0);
                        }

                        if(distance(uUv, normalizeVec2(vec2(1,1))) < 0.02) {
                            texel = vec4(0.3, 0.1, 0.7, 1.0);
                        }
                        
                        // Drawing other objects as circles
                        for (int i = 0; i < numberOfDvarim; i++) {
                            v = vec2(objectPositions[i]);
                            u = normalizeVec2(v);
                            float dist = distance(uUv, u);
                            if ((dist) < 0.03) { // Adjust size as needed
                                texel = vec4(1.0, 1.0, 0.0, 1.0); // Yellow color for objects
                            }
                        }
                        
                        gl_FragColor = opacity * texel;
                    }


                    
                `
            };

            var sh = new ShaderPass(
                this.minimapShader
            );

            this.minimapShaderPass = sh;

            this.minimapComposer.addPass(renderPass);
            this.minimapComposer.addPass(
                sh
            );
        }
        
        this.minimapComposer.render()/*
        this.minimapRenderer.render(
            this.scene,
            ppc
        )*/
    }

    _drawn = []

    getVisibleDimensions(camera, rendererWidth, rendererHeight) {
        // Calculate the aspect ratio
        const aspect = rendererWidth / rendererHeight;
    
        // Calculate the height of the near plane
        const nearHeight = 2 * Math.tan(THREE.Math.degToRad(camera.fov) / 2) * camera.near;
        const nearWidth = nearHeight * aspect;
    
        // Corners of the near plane in camera space
        const corners = [
            new THREE.Vector3(-nearWidth / 2, nearHeight / 2, -camera.near), // top-left
            new THREE.Vector3(nearWidth / 2, nearHeight / 2, -camera.near),  // top-right
            new THREE.Vector3(nearWidth / 2, -nearHeight / 2, -camera.near), // bottom-right
            new THREE.Vector3(-nearWidth / 2, -nearHeight / 2, -camera.near) // bottom-left
        ];
    
        // Transform corners to world space
        const worldCorners = corners.map(corner => corner.applyMatrix4(camera.matrixWorld));
    
        // Determine bounds
        const bounds = new THREE.Box3().setFromPoints(worldCorners);
        return {
            minX: bounds.min.x,
            maxX: bounds.max.x,
            minY: bounds.min.y,
            maxY: bounds.max.y,
            minZ: bounds.min.z,
            maxZ: bounds.max.z
        };
    }


    /**
     * Normalizes the player's world coordinates to minimap coordinates.
     * @param {THREE.Vector3} worldPos - The object's position in world coordinates.
     * @param {THREE.PerspectiveCamera} minimapCamera - The camera used for the minimap.
     * @param {THREE.WebGLRenderer} minimapRenderer - The renderer for the minimap.
     * @returns {THREE.Vector2 | null} The normalized position for the minimap or null if the object is out of view.
     */
    getNormalizedMinimapCoords(worldPos, minimapCamera, minimapRenderer) {
        var { x, y, z } = worldPos;
        if(!minimapCamera) {
            minimapCamera = this.minimapCamera;
        }
    
        if(!minimapRenderer) {
            minimapRenderer = this.minimapRenderer;
        }
        if (typeof (x) != "number" || typeof (y) != "number" || typeof (z) != "number")
            return null;

        if (!minimapCamera || !minimapRenderer) {
            console.log("not initted yet");
            return null;
        }

        // Update the camera's matrix world
        minimapCamera.updateMatrixWorld();
        const relativePosition = new THREE.Vector3().subVectors(worldPos, minimapCamera.position);

        // Calculate the depth along the camera's viewing direction
        const cameraDirection = new THREE.Vector3();
        minimapCamera.getWorldDirection(cameraDirection);
        const depth = relativePosition.dot(cameraDirection);
        // Adjust for the camera's FOV and aspect ratio
        const fovFactor = Math.tan(THREE.MathUtils.degToRad(minimapCamera.fov) / 2);
        const aspectFactor = minimapCamera.aspect;
        const adjustedX = (relativePosition.x / depth) / (fovFactor * aspectFactor);
        const adjustedZ = -(relativePosition.z / depth) / (fovFactor * aspectFactor);


        // Normalize the coordinates for the minimap
        // Assuming the minimap has dimensions normalized between -1 and 1
      //  const normalizedX = THREE.MathUtils.clamp(adjustedX, -1, 1);
       // const normalizedZ = THREE.MathUtils.clamp(adjustedZ, -1, 1);

        return new THREE.Vector2(adjustedX, adjustedZ);
    }

    calculateEdgeIntersection(ndcPos) {
        // Assuming ndcPos is in the range [-1, 1]
        // Calculate the intersection point on the edge of the NDC box
        const direction = { x: ndcPos.x, y: ndcPos.z }; // Direction vector from center to the object
        let edgeX, edgeY;
    
        // Calculate the slope and aspect ratio
        const slope = direction.y / direction.x;
        const aspectRatio = 1; // Adjust this based on your minimap's aspect ratio
    
        if (Math.abs(slope) <= aspectRatio) {
            // Intersects with left or right edge
            edgeX = Math.sign(direction.x);
            edgeY = slope * edgeX;
        } else {
            // Intersects with top or bottom edge
            edgeY = Math.sign(direction.y);
            edgeX = edgeY / slope;
        }
    
        return { x: edgeX, y: edgeY };
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
        

        this.renderer.setPixelRatio(
            devicePixelRatio
        )
        this.renderer.autoClear = false;
        var renderer = this.renderer
       // renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;


       
        // On this stage we size, dimensions to unfurl,
        // Setting the width and height of our graphic world.
        this.setSize(this.width, this.height);
         /**
         * other effects
         */
      
        this.composer = new EffectComposer(this.renderer);
        var renderPass = new RenderPass(
            this.scene,
            this.camera
        );
        this.composer.addPass(renderPass);
        
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

        const desiredAspectRatio = ASPECT_X / ASPECT_Y;
        let oWidth = width; //original Width
        let oHeight = height;
        // Calculate new width and height
        let newWidth = width;
        let newHeight = height;
        if (width / height > desiredAspectRatio) {
            // total width is wider than desired aspect ratio
            newWidth = height * desiredAspectRatio;
        } else {
            // total width is taller than desired aspect ratio
            newHeight = width / desiredAspectRatio;
        }

        this.width = newWidth;
        this.height = newHeight;
		
	
        width = newWidth;
        height = newHeight;
        
        // When both dimensions are numbers, the world is alright,
        // We can set our renderer's size, aligning the sight.
        if(typeof width === "number" && typeof height === "number" ) {
            
            if(this.renderer) {
                // Updates the size of the renderer context in pixels and let the canvas's style width and height be managed by CSS (the third parameter, false).
                this.renderer.setSize(width, height, false);
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
    
        // Ambient light for overall warmth
        const ambientLight = new THREE.AmbientLight(0xffe8c3, 0.2);
        this.scene.add(ambientLight);
    
                // Key light with warm tone and soft shadow
        // Key light with warm tone and soft shadow
        const keyLight = new THREE.DirectionalLight(0xffd1a3, 1.2);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 757;  // Higher resolution for shadow
        keyLight.shadow.mapSize.height = 757;
        keyLight.shadow.camera.near = this.camera.near;
        keyLight.shadow.camera.far = this.camera.far;

        // Set initial position of the key light
        keyLight.position.set(-5, 25, -1);

        // Shadow camera frustum settings
        const frustumSize = 75;
        keyLight.shadow.camera.right = frustumSize;
        keyLight.shadow.camera.left = -frustumSize;
        keyLight.shadow.camera.top = frustumSize;
        keyLight.shadow.camera.bottom = -frustumSize;

        // Optional: Adjust shadow bias to avoid shadow artifacts
        
        // Key light shadow setup
        keyLight.shadow.bias = -0.0005; // Start with this bias and adjust as necessary

        // Optional: Adjust the radius and blurSamples if using VSM shadows
        keyLight.shadow.radius = 3;
        keyLight.shadow.blurSamples = 5; // Note: blurSamples is not a standard Three.js property


        this.scene.add(keyLight);
        this.scene.add(keyLight.target); // Don't forget to add the target to the scene

        /**
         * method to udpate light position
         */
        // Define a threshold distance
        const thresholdDistance = 15; // Adjust this value as needed

        // Keep track of the last position of the key light
        let lastLightPosition = keyLight.position.clone();
        // Define a variable to control how often the light's position updates
        let updateInterval = 1500; // in milliseconds
        let lastUpdateTime = Date.now();

        this.on("meshanehOyr", (characterPosition) => {
            return;
            // Get the current time
            let currentTime = Date.now();

            // Check if the update interval has passed
            if (currentTime - lastUpdateTime > updateInterval) {
                // Check the distance from the last light position to the character's current position
                if (characterPosition.distanceTo(lastLightPosition) > thresholdDistance) {
                    // Move the light's target, not the light itself
                    keyLight.target.position.copy(characterPosition);
                    keyLight.target.updateMatrixWorld();

                    // Update the light's position based on character movement to maintain relative position
                    keyLight.position
                    .copy(characterPosition)
                    .add(new THREE.Vector3(-5, 25, -1));

                    // Update the time of the last update
                    lastUpdateTime = currentTime;
                }
            }
        });

        const helper = new THREE.CameraHelper(keyLight.shadow.camera);
        //this.scene.add(helper);
        // Fill light to soften shadows, with lower intensity and warmer color
        const fillLight = new THREE.HemisphereLight(0xffe8d6, 0x8d6e63, 0.7);
        fillLight.position.set(2, 1, 1);
        this.scene.add(fillLight);
    
        // Rim light for edge highlighting and depth
        const rimLight = new THREE.SpotLight(0xffe8d6, 0.5);
        rimLight.position.set(-3, 10, -10);
        rimLight.angle = Math.PI / 4;
        rimLight.penumbra = 0.5;
        rimLight.decay = 2;
        rimLight.distance = 50;
        //rimLight.castShadow = true;
        this.scene.add(rimLight);
    
        // Optional: Add a subtle volumetric light effect for extra cinematic atmosphere
        // Note: Volumetric light requires additional setup, such as using shaders
    
        this.ohros.push(keyLight, fillLight, rimLight, ambientLight);
    
        
       
        
        
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
    async boyrayNivra/*createCreation*/(nivra) {
        try {
            
            if(
                nivra.path &&
                typeof(nivra.path) == "string"
            ) {
                var derech = nivra.path;
                
                // Check if the path starts with "awtsmoos://"
                if (nivra.path.startsWith('awtsmoos://')) {
                    // Extract the component name from the path
                    //const componentName = nivra.path.slice(11);

                    
                    // Get the component from the Olam
                    const component = this.getComponent(nivra.path);
                    
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
                var gltfAsset = this.$a(
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
                        gltf = await this.loader.loadAsync(derech);
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
                    
                    
                    
                    /*
                        look for objects that
                        have the custom property "placeholder"
                        with the name of the nivra. for repeating
                        objects can have same name.
                    */
                    if(typeof(child.userData.placeholder) == "string") {
                        const {
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

                        placeholders[child.userData.placeholder].push(
                            {
                                position, rotation, scale,
                                addedTo: false
                            }
                        );

                        /*console.log("Added placeholder",child.userData.placeholder,
						placeholders[child.userData.placeholder],
						child,nivra)*/
                        thingsToRemove.push(child)
                        //gltf.scene.remove(child);
                        

                    }

                    if(
                        typeof(child.userData.entity)
                        == "string"
                    ) {
                        entities[child.userData.entity]
                         = child
                         if(nivra.isSolid) {
                            child.isSolid = true;
                         }
                         child.isMesh = true;
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
                        child.receiveShadow = true
                        child.castShadow = true
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
                
                if(Object.keys(entities).length) {
                    nivra.entities = entities;
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


        this.scene.add(three);
        
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
        //placeholder logic
        var nm = nivra.placeholderName;
        if(typeof(nm) == "string") {
            
            this.nivrayimWithPlaceholders.forEach(w=> {
                var pl = w.placeholders;
                
                if(pl[nm]) {
                    var av/*ailable*/ = pl[nm].find(q=>!q.addedTo);
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


        //entity logic
        var ks = Object.keys(nivra.entityData);
        if(!ks.length) {
            return 
        }

        for(const k of ks) {
            var en = nivra.entityData[k];

            var type = en.type || "Domem";
            if(typeof(type) != "string") {
                type = "Domem"
            }
            var av = nivra.entities[k];
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

    async sealayk(nivra) {
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

        if(nivra.addedToPlaceholder) {
            nivra.addedToPlaceholder.addedTo = null;
        }
        var ind = this.nivrayim.indexOf(nivra)
        if(ind > -1) {
            
            this.nivrayim.splice(ind, 1);
        } else {
            console.log("Couldnt find",nivra,ind)
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
        var m = nivra.mesh;
        try {
            if(m)
                m.removeFromParent();
            if(nivra.modelMesh) {
                nivra.modelMesh.removeFromParent();
            }
            
            return true;
        } catch(e){
            console.log("No",e)
            return false;
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
            
            for (const [type, nivraOptions] of Object.entries(nivrayim)) {
                var ar;
                var isAr = false;
                if(Array.isArray(nivraOptions)) {
                    ar = nivraOptions;
                    isAr = true;
                } else {
                    ar = Object.entries(nivraOptions)
                }
                for (const entry of ar) {
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
                            
                            action: "Loading the model for each nivra"
                        }
                    );


                    
                }
            }
            

            
            await this.ayshPeula("alert", "Loaded Nivra models, now initing")
            
            // Processing heescheel function sequentially for each nivra
            for (const nivra of nivrayimMade) {
                if (nivra.heescheel && typeof(nivra.heescheel) === "function") {
                    try {
                        
                        await nivra.heescheel(this);
                        
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
                            amount:(100 * 1/4) / (
                                nivrayimMade.length
                            ),
                            nivra,
                            
                            action: "Loading the model for each nivra"
                        }
                    );
                }
            }
            
            
            await this.ayshPeula("alert", "Made nivrayim")
            // Processing madeAll and ready function sequentially for each nivra
            for (const nivra of nivrayimMade) {
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
                            amount:(100 * 1/4) / (
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
            for (const nivra of nivrayimMade) {
                await this.doPlaceholderAndEntityLogic(nivra);
                
                this.ayshPeula(
                    "increase loading percentage", 
                    {
                        amount:(100 * 1/4) / (
                            nivrayimMade.length
                        ),
                        nivra,
                        action: "Setting up object placeholders"
                    }
                );
            }

            
            for (const nivra of nivrayimMade) {
                if (nivra.ready) {
                    
                    await nivra.ready();
                    /**
                     * ibid
                     */
                    this.ayshPeula(
                        "increase loading percentage", 
                        {
                            amount:(100 * 1/4) / (
                                nivrayimMade.length
                            ),
                            nivra,
                            action: "Calling ready state for each nivra"
                        }
                    );
                }
            }

            
            await this.ayshPeula("alert", "doing things after nivrayim made")
            
			for(const nivra of nivrayimMade) {
				if(nivra.afterBriyah) {
					await nivra.afterBriyah();
				}
			}

			
			
			
  

            
            await this.ayshPeula("alert", "adding light")

            if(!this.enlightened)
                this.ohr();
            return nivrayimMade;
        } catch (error) {
            console.error("An error occurred while loading: ", error);

        }
    }
    
    async htmlAction(
        shaym,
        properties,
        methods
    ) {
        if(typeof(shaym) == "object") {
            properties = shaym.properties;
            methods = shaym.methods
            shaym = shaym.shaym
        }
        this.ayshPeula(
            "htmlAction",
            {
                shaym,
                properties,
                methods
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


            

            if(!info.nivrayim) {
                info.nivrayim = {}
            }
            
            // Load components if any
            if (info.components) {
                await this.loadComponents(info.components);
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

                            .ikarGameMenu > div > div {
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
