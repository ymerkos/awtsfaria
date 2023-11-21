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

    // Scene-related properties
    scene = new THREE.Scene();
    ohros = []; // Lights for the scene
    enlightened = false;
 
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
        RUNNING: false
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

        "ShiftLeft": "RUNNING",
        "ShiftRight": "RUNNING"

    }
    constructor() {
        super();
        
        this.ayin = new Ayin();
        this.scene.background = new THREE.Color(0x88ccee);
       // this.scene.fog = new THREE.Fog(0x88ccee, 0, 50);
        this.startShlichusHandler();

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

        this.on('wheel', (event) => {
            this.ayin.deltaY = event.deltaY;
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
            if(!setSizeOnce) {
                this.nivrayim.forEach(n => {
                    n.ayshPeula("canvased", n, this);
                });
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
                shaym: `ikar${ID}`
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
        this.shlichusHandler = new ShlichusHandler(); // The ShlichusHandler is born
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
                
            }

            // The rendering. This is done once per frame.
            if(self.renderer) {
                self.renderer.render(
                    self.scene,
                    self.activeCamera
                    ||
                    self.ayin.camera
                );
            }
            
            if(!self.destroyed)
                // Ask the browser to call go again, next frame
                requestAnimationFrame(go);
        }
        requestAnimationFrame(go);
    }
	
    /** 
     * In the tale of Ayin's quest to illuminate the world,
     * The canvas is our stage, where the story is unfurled.
     * @param {HTMLCanvasElement} canvas - The stage where the graphics will dance.
     * @example
     * takeInCanvas(document.querySelector('#myCanvas'));
     */
    takeInCanvas(canvas) {
        var rend  = canvas.getContext("webgl2") ? THREE.WebGLRenderer :
            THREE.WebGL1Renderer;
            
        // With antialias as true, the rendering is smooth, never crass,
        // We attach it to the given canvas, our window to the graphic mass.
        this.renderer = new rend({ antialias: true, canvas: canvas });

        
        // On this stage we size, dimensions to unfurl,
        // Setting the width and height of our graphic world.
        this.setSize(this.width, this.height);
        
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
            )
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
                shaym: `ikar${ID}`,
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
        const fillLight1 = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 0.5);
        fillLight1.position.set(2, 1, 1);
        this.scene.add(fillLight1);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(-5, 25, -1);

        this.scene.add(directionalLight);
        this.ohros.push(directionalLight,fillLight1);
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
                    gltf = await this.loader.loadAsync(derech);
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

                    


                    /*adds items that aren't player to special list
                    for camera collisions etc.*/
                    if (child.isMesh && !child.isAwduhm) {
                        this.objectsInScene.push(child);
                    } else if(child.isMesh) {
                        if (child.material.map) {

                            ///child.material.map.anisotropy = 4;
            
                        }
                    }

                    /*
                        get materials of mesh for easy access later
                            */
                    if(child.material) {
                        var inv = checkAndSetProperty(child, "invisible");
                        
                        materials.push(child.material)
                        Utils.replaceMaterialWithLambert(child);
                        if(inv) {
                            child.material.visible = false;
                        }
                    }

                    
                });

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

    async doPlaceholderLogic(nivra) {

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
                        } else {
                            console.log("Mesh not added!", nivra)
                        }
                        
                    }
                }
            })
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
        var ind = this.nivrayim.indexOf(nivra)
        if(ind > -1) {
            
            this.nivrayim.splice(ind, 1);
        } else {
            console.log("Couldnt find",nivra,ind)
        }


        ind = this.nivrayimWithPlaceholders.indexOf(nivra);
        if(ind > -1) {
            this.nivrayimWithPlaceholders.splice(ind, 1);
        }

        ind = this.interactableNivrayim.indexOf(nivra);
        if(ind > -1) {
            this.interactableNivrayim.splice(ind, 1);
        }
		nivra.ayshPeula("sealayk")
        var m = nivra.mesh;
        try {
            m.removeFromParent();
            
            
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
                        )
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
			
			// Processing doPlaceholderLogic function sequentially for each nivra
            for (const nivra of nivrayimMade) {
                await this.doPlaceholderLogic(nivra);
                
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
			
			for(const nivra of nivrayimMade) {
				if(nivra.afterBriyah) {
					await nivra.afterBriyah();
				}
			}

			
			
			
  

            

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
        

        if(info.html) {
            var style = null
                
            
            if(!styled) { 
                style = {
                    tag: "style",
                    innerHTML:/*css*/`
                        .ikar${ID} {
                            
                            
                            position: absolute;
                            transform-origin:center;
                            
                            width:${ASPECT_X}px;
							height:${ASPECT_Y}px;
                        }

                        .ikar${ID} > div > div {
                            position:absolute;
                        }
                    `
                };
                styled = true;
            }
            var par = {
                shaym: `ikar${ID}`,
                children: [
                    info.html,
                    style
                ],
                ready(me, c) {
                    
                },
                className: `ikar${ID}`
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
        
        var loaded = await this.loadNivrayim(info.nivrayim);
        
        var st = info.gameState[this.shaym];
        if(st && st.shaym == this.shaym) {
            
            var set = this.setGameState(st);
            
        } else {
            console.log("No state!",info.gameState,this.shaym)
        }
        this.ayshPeula("ready", this, loaded);
        this.ayshPeula(
            "reset loading percentage"
        );
        
        return loaded;
    }
}
