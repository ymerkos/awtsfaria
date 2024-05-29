/**
 * B"H
 * The Olam class represents a 3D World or "Scene" in a game.
 * @extends AWTSMOOS.Nivra
 * @param {Object} options The configuration data for the Olam.
 */


/**
 * get methods
 */

import boyrayNivra from "./methods/boyrayNivra.js";
import eventListeners from "./eventListeners/index.js";
import helpers from "./methods/helpers.js";

import GrassMaterial from "./materials/Grass.js"
import * as THREE from '/games/scripts/build/three.module.js';
import * as AWTSMOOS from '../awtsmoosCkidsGames.js';
import { GLTFLoader } from '/games/scripts/jsm/loaders/GLTFLoader.js';

import {TextGeometry} from "/games/scripts/jsm/utils/TextGeometry.js";
import {FontLoader} from "/games/scripts/jsm/loaders/FontLoader.js";
import WebGPURenderer from "/games/scripts/jsm/gpu/WebGPURenderer.js"
import Ayin from "./ckidsCamera.js";
import { Octree } from '/games/scripts/jsm/math/Octree.js';
import Utils from '../utils.js'


import ShlichusHandler from "../shleechoosHandler.js";


//import AwtsmoosRaysShader from "./shaders/AwtsmoosRaysShader.js";


import Environment from "../postProcessing/environment.js";
import PostProcessingManager from 
"../postProcessing/postProcessing.js";

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

    /**

    set imported methods to self

    **/
    boyrayNivra = boyrayNivra.bind(this)

    GrassMaterial = GrassMaterial

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

    // Physics-related properties
    worldOctree = new Octree(); // An octree for efficient collision detection

    // Input-related properties
    keyStates = {}; // State of key inputs
    mouseDown = false; // State of mouse input
    achbar = new THREE.Vector2() // mouse position
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
            
            /**
             * helper methods
             */

            helpers.bind(this)();
            eventListeners.bind(this)();

            

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



    async loadGLTF(url) {
        try {
            const gltf = await (new GLTFLoader().loadAsync(url));
            return gltf;
        } catch(e) {
            console.log(e);
            return null;
        }
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
    
    async fetchWithProgress(url, options = {}, otherOptions) {
        var {onProgress} = otherOptions;
        var headers = options?.headers || {};
        if(!options) options =  {}
        options.headers = {
            ...headers,
          
            //'Cache-Control': 'no-cache'
            
        }
        

        const response = await fetch(url, {
            ...options,

        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const contentLength = response.headers.get('Content-Length');
        const total = contentLength ? parseInt(contentLength, 10) : null;
        let loaded = 0;
    
        const reader = response.body.getReader();
        let chunks = [];
        let result = await reader.read();
    
        while (!result.done) {
            loaded += result.value.length;
            chunks.push(result.value);
    
            if (onProgress && total !== null) {
                await onProgress(loaded / total);
            }
            result = await reader.read();
        }
    
        
        return {
            
            
            ...response,
            ok:true,
            blob() {
                const arrayBuffer = new Uint8Array(chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [])).buffer;
                const blob = new Blob([arrayBuffer], { type: response.headers.get('Content-Type') });
                return blob
            },
            text() {
                chunks.join("")
            }
        };
    }
    fetchWithProgressOld(url, options={}) {

        class CustomResponse {
            constructor(xhr) {
                this.xhr = xhr;
                this.headers = new Headers();
                // Parse headers from XHR response
                var self = this;
                xhr.getAllResponseHeaders().trim().split(/[\r\n]+/).forEach((line) => {
                    var parts = line.split(': ');
                    var header = parts.shift();
                    var value = parts.join(': ');
                    console.log("Appending",value,header)
                    try {
                        self.headers.append(header, value);
                    } catch(e){
                        console.log(e)
                    }
                });
                this.ok = xhr.status >= 200 && xhr.status < 300;
                this.status = xhr.status;
                this.statusText = xhr.statusText;
            }
        
            async text() {
                // Send request for text
                this.xhr.responseType = "text";
                
                // Wait for response and return text
                await new Promise((resolve, reject) => {
                    this.xhr.open("GET", url, true);
               
                    this.xhr.onload = function() {
                        resolve(this.xhr.response);
                    };
                    this.xhr.onerror = function() {
                        reject(new Error("Error fetching response"));
                    };
                    this.xhr.send();
                });
                return this.xhr.responseText;
            }
    
            async blob() {
                // Send request for blob
                this.xhr.responseType = "blob";
                this.xhr.open("GET", url, true);
                this.xhr.send();
                // Wait for response and return blob
                await new Promise((resolve, reject) => {
                    this.xhr.open("GET", url, true);
               
                    this.xhr.onload = function() {
                        resolve(this.xhr.response);
                    };
                    this.xhr.onerror = function() {
                        reject(new Error("Error fetching response"));
                    };
                    this.xhr.send();
                });
                return new Blob([this.xhr.response], {
                    type: "application/octet-stream"
                });
            }
        
            // You can add other methods as needed
        }
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            var progress = options.progress;
            xhr.open("options", url, true);
    
            // Set up progress event listener
            xhr.addEventListener("progress", function(event) {
                if (event.lengthComputable) {
                    var percentComplete = event.loaded / event.total;
                    if (typeof progress === "function") {
                        progress(percentComplete, event);
                    }
    
                  //  console.log("Progress: " + (percentComplete * 100).toFixed(2) + "%");
                } else {
                    console.log("Progress: Unknown (Total size not available)");
                }
            });
    
            xhr.onreadystatechange = function() {
            
                resolve(new CustomResponse(xhr));
             
            };
            xhr.send()
    
            
        });
        
    }

    async fetchGetSize(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const contentLength = response.headers.get('Content-Length');
            if (!contentLength) {
                throw new Error('Content-Length header not found in response');
            }
        
            return parseInt(contentLength, 10);
        } catch(e) {
            console.log(e)
            return 0
        }
        
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
            var self = this;
            // Fetch the model data
            var response = await this.fetchWithProgress(url, null, {
                async onProgress(p) {
                    var size = self.componentSizes[shaym];
                    var ttl = self.totalComponentSize;

                    if(!size) return;

                    var myPercent = size / ttl;

                    await self.ayshPeula("increase loading percentage", {
                        amount: 100 * p * myPercent,
                        action: "Loading component: "+ shaym + ". ",
                       // subAction: (myPercent * 100).toFixed(2) + "%"
                    })

                   
                }
            });

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
        /**
         * first, get total components size
         * fetchGetSize
         */
        var ent = Object.entries(components);
        var sizes = {}
        var componentSize = 0;
        for(var [shaym, url] of ent) {
            var size = await this.fetchGetSize(url)
            sizes[shaym] = size
            componentSize += size;
        }
        this.totalComponentSize = componentSize;
        this.componentSizes = sizes;
        //console.log("COMP SIZES",sizes)
        for (var [shaym, url] of ent) {
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
                    var mod = await this.getModule(v, {others:ks,name:key});
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

    async getModule(href, {others, name}) {
        if(
            typeof(href) != "string"
        ) return;
        var perc = 1 / others.length;
        var ob  = null;
        this.ayshPeula("increase loading percentage", {
            amount: perc * 100,
            action: "Loading Modules...",
            subAction: "Module: " + name
        });
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
        nivra ? nivra?.entities?.[entityName] : 
        ((n => n?n?.entities?.[entityName] : null)(this.nivrayim.find(q => q?.entities ? 
            q?.entities[entityName] : false    
        )));
        if(!entity) return null;

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
        async function go(time) {
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
                if(!rend) realRender(time);
            } else {
                realRender(time)
            }

            

            
            var frames = 0;
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

                    
                }
                if(self.hoveredNivra) {
                    
                    /*
                    self.ayshPeula("mousemove", {
                        clientX: self.achbar.x,
                        clientY: self.achbar.y
                    })*/
                }
                
            }
            
            if(!self.destroyed)
                // Ask the browser to call go again, next frame
                requestAnimationFrame(go);
        }
        
        requestAnimationFrame(go);
    }

    async renderMinimap() {
        async function minimapRender() {
            if(self.minimap) {
                await self.minimap.render()
            }
            
        }
        
       // requestAnimationFrame(minimapRender);
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
        console.log(temp,canvas,"Minimap?")
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
      //  this.setSize(this.width, this.height);
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
        //console.log("Aspect ratio",width,height,width/height,desiredAspectRatio,ASPECT_X)
        if (width / height > desiredAspectRatio) {
           
            // total width is wider than desired aspect ratio
            newWidth = height * desiredAspectRatio;
            if(this.rendered) {
                await this.ayshPeula("htmlAction", {
                    shaym: "main av",
                    methods: {
                        classList: {
                            remove: "sideInGame",
                            add: "horizontalInGame"
                        }
                    }
                });
            }
        } else {
            if(this.rendered) {
                await this.ayshPeula("htmlAction", {
                    shaym: "main av",
                    methods: {
                        classList: {
                            add: "sideInGame",
                            remove: "horizontalInGame"
                        }
                    }
                });
            }
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
                console.log("About to set size",width,height)
                // Updates the size of the renderer context in pixels and let the canvas's style width and height be managed by CSS (the third parameter, false).
                this.renderer.setSize(width, height, false);
            } else {
                this.ayshPeula("alert", "didnt set renderer!")
            }
            
            await this.updateHtmlOverlaySize(
                width, height, 
                desiredAspectRatio
            );

            await this.getBoundingRect()
            //console.log("RESIZE info",info)

            this.adjustPostProcessing();
            
        }

        this.refreshCameraAspect()
    }
    
    async getBoundingRect() {
        var info = await this.ayshPeula("htmlAction", {
            shaym: "ikarGameMenu",
            methods: {
                getBoundingClientRect: true
            }
        });

        if(info[0]) {
            var rect = info[0]
                ?.methodsCalled
                ?.getBoundingClientRect;
            if(rect) {
                this.boundingRect = rect;
            }

        }
    }
    async updateHtmlOverlaySize(width, height) {
        
        
		var differenceFromOriginalX = width / ASPECT_X;
		var difFromOriginalY = ASPECT_Y / height;

        await this.ayshPeula(
            "htmlAction", 
            {
                shaym: `main av`,
                properties: {
                    style: {
                        width:width+"px",
                        height:height+"px"
                    }
                }
            }
        );
        // Set the overlay's style to match the canvas's dimensions and position
        if(this.rendered) 
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

        this.rendered
            await this.ayshPeula(
                "htmlAction", {
                    shaym: `av`,
                    properties: {
                        style: {
                            width:width+'px',
                            height:height+'px'
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
        var lights = new THREE.Group();
        this.lights = lights;
        this.enlightened = true;
    
        // High quality ambient light for subtle background illumination
        var ambientLight = new THREE.AmbientLight(0xffe8c3, 0.3);
        this.scene.add(ambientLight);
    
        // Key light with warm tone, soft shadow, and dynamic falloff for realism
        var keyLight = new THREE.DirectionalLight(0xffd1a3, 1.5);
        keyLight.layers.enable(2)
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
        this.lights.add(keyLight);
    
        // Fill light to balance the shadows with a cooler tone for depth
        var fillLight = new THREE.HemisphereLight(0xffe8d6, 0x8d6e63, 0.5);
        fillLight.position.set(2, 1, 1);
        this.lights.add(fillLight);
        fillLight.layers.enable(2)
        // Rim light to enhance edge lighting and create a three-dimensional look
        var rimLight = new THREE.SpotLight(0xffe8d6, 0.75);
        rimLight.position.set(-3, 10, -10);
        rimLight.angle = Math.PI / 6;
        rimLight.penumbra = 0.5;
        rimLight.decay = 2;
        rimLight.distance = 100;
        this.lights.add(rimLight);
        rimLight.layers.enable(2)
        // Backlight to create depth and separate objects from the background
        var backLight = new THREE.SpotLight(0xffffff, 0.5);
        backLight.position.set(5, 10, 10);
        backLight.angle = Math.PI / 6;
        backLight.penumbra = 0.5;
        backLight.decay = 2;
        backLight.distance = 100;
        this.lights.add(backLight);
        backLight.layers.enable(2)
        this.lights.layers.enable(2)
        // Optional: Add practical lights to enhance the scene's ambiance
        // Example: Soft glowing lights to simulate environmental light sources
        this.scene.add(this.lights)
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
        if(nivra.dialogue) {
           
            if(!this.nivrayimWithDialogue) {
                this.nivrayimWithDialogue = []
            }
            this.nivrayimWithDialogue.push(nivra)
        } //else{console.log("NO dialogue")}
      
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
                console.log("Cehcking placeholder..",nm,pl[nm])
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

                    console.log("avail",av)
                    if(av) {
                   
						if(nivra.mesh) {
                            nivra.ayshPeula("change transformation", {
                                position: av.position,
                                rotation: av.rotation
                            });
                            

                            //nivra.mesh.rotation.copy(av.rotation);
                            av.addedTo = nivra;
                            nivra.addedToPlaceholder = av;
                            

                            var m = nivra.modelMesh || nivra.mesh;
                            if(m) {
                                this.meshesToInteractWith.push(
                                    m
                                )
                            }
                            if(nivra.static) {

                            }
                        } else {
                            console.log("No mesh?!",nivra)
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

            av.hasDialogue = true;
            

            this.meshesToInteractWith.push(av)
            if(ent) {
                ent.forEach(w=>{
                    w.ayshPeula("change transformation", {
                        position: av.position,
                        rotation: av.rotation
                    });
                    w.av = av;
                    av.nivraAwtsmoos = w;
                    
                })
            }

            av.entityNivrayim = ent;
            
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
        /**
         * keep track of if it was removed
         */
        nivra.wasSealayked = true;
        if(nivra.isMesh) {
            try {
                if(nivra.isSolid) {
                    
                    this.worldOctree.removeMesh(nivra)
                }
                nivra.removeFromParent();
            } catch(e) {

            }
        }
     
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
                            nivra = new c({name, ...evaledObject}, this);
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
                            amount:(100) / (
                                nivrayimMade.length
                            ),
                            nivra,
                            
                            action: "initting each nivra"
                        }
                    );


                    
                }
            }

            /**
             * first get size of
             * each nivra model to know
             * how much to incraese percentage in loading...
             */

            var sizes = []/*Array.from({
                length: nivrayimMade.length
            })*/
            var totalSize = 0;
            for(var nivra of nivrayimMade) {
                nivra.olam = this;
                var s = await nivra.getSize();
                sizes.push({
                    nivra,
                    size:s
                })
                totalSize += s;
                nivra.size = s;
            }
            this.totalSize = totalSize;

            
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
                            amount:(100) / (
                                nivrayimMade.length
                            ),
                            nivra,
                            
                            action: "Setting up Nivra " + nivra.name + " in world...",
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
                            amount:(100) / (
                                nivrayimMade.length
                            ),
                            nivra,
                            action: "Sending initial messages to nivra "+nivra.name
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
                        amount:(100) / (
                            nivrayimMade.length
                        ),
                        nivra,
                        action: "Setting up object placeholders for "+nivra.name
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
                            amount:(100) / (
                                nivrayimMade.length
                            ),
                            nivra,
                            action: "Calling ready state for nivra "+nivra.name
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

            selector = shaym.selector
            shaym = shaym.shaym
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
                                
                                overflow: hidden;
                                position: absolute;
                                transform-origin:top left;
                                
                                width:${ASPECT_X}px;
                                height:${ASPECT_Y}px;
                                top: 0;
                                left: 0;
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
                    parent: "main av",
                    children: [
                        info.html,
                        style
                    ],
                    ready(me, c) {
                        
                    },

                    className: `ikarGameMenu`
                }
                
                
                
            
                var cr = await this.ayshPeula(
                    "htmlCreate",
                    par
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
