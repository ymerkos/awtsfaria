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
import html from './chayim/ui.js';
import ShlichusHandler from "./shleechoosHandler.js";

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

    components = {};

    shlichusHandler = null;

    inputs = {
        FORWARD: false,
        BACKWARD: false,
        LEFT_ROTATE: false,
        RIGHT_ROTATE: false,
        LEFT_STRIDE: false,
        RIGHT_STRIDE: false
    };

    keyBindings = {
        "KeyW": "FORWARD",
        "ArrowUp": "FORWARD",

        "ArrowRight":"RIGHT_ROTATE",
        "ArrowLeft": "LEFT_ROTATE",

        "KeyA": "LEFT_ROTATE",
        "KeyD": "RIGHT_ROTATE",

        "KeyS": "BACKWARD",
        "KeyE": "RIGHT_STRIDE",
        "KeyQ": "LEFT_STRIDE",

        "KeyR": "PAN_UP",
        "KeyF": "PAN_DOWN",

    }
    constructor() {
        super();

        this.ayin = new Ayin();
        this.scene.background = new THREE.Color(0x88ccee);
        this.scene.fog = new THREE.Fog(0x88ccee, 0, 50);
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

       

        this.on("resize", peula => {
            this.setSize(peula.width, peula.height, false);
        })
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
     * @param {String} shaym - The name of the component.
     * @param {String} url - The URL of the component's model.
     */
    async loadComponent(shaym, url) {
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

    /**
     * Retrieve a component by its name.
     * @param {String} shaym - The name of the component.
     * @returns {Object|undefined} - The component's data URL, or undefined if the component is not found.
     */
    getComponent(shaym) {
        return this.components[shaym];
    }

    async loadComponents(components) {
        for (const [shaym, url] of Object.entries(components)) {
          await this.loadComponent(shaym, url);
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
            this.ayin.camera,
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
                        n.heesHawveh?
                        n.heesHawvoos(self.deltaTime) : 0
                    );
                }

                self.ayin.update(self.deltaTime);
                
            }

            // The rendering. This is done once per frame.
            if(self.renderer) {
                self.renderer.render(
                    self.scene,
                    self.ayin.camera
                );
            }
           // console.log("g")
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
    // With antialias as true, the rendering is smooth, never crass,
    // We attach it to the given canvas, our window to the graphic mass.
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });

    
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
setSize(vOrWidth={}, height) {
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

    this.width = width;
    this.height = height;

    // When both dimensions are numbers, the world is alright,
    // We can set our renderer's size, aligning the sight.
    if(typeof width === "number" && typeof height === "number" ) {
        if(this.renderer) {
            // Updates the size of the renderer context in pixels and let the canvas's style width and height be managed by CSS (the third parameter, false).
            this.renderer.setSize(width, height, false);
        }
    }

    // If Ayin's gaze is upon us, it too must heed,
    // The changing size of our canvas, and adjust its creed.
    if(this.ayin) {
        this.ayin.setSize(width, height);
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
    boyrayNivra/*createCreation*/(nivra) {
        return new Promise((r,j) => {
            try {
                
                if(
                    nivra.path &&
                    typeof(nivra.path) == "string"
                ) {
                    var derech = nivra.path;
                   
                    // Check if the path starts with "awtsmoos://"
                    if (nivra.path.startsWith('awtsmoos://')) {
                        // Extract the component name from the path
                        const componentName = nivra.path.slice(11);

                        
                        // Get the component from the Olam
                        const component = this.getComponent(componentName);
                        
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
                    


                    this.loader.load(derech, gltf => {
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
                                child.updateMatrixWorld();
                                var position = new THREE.Vector3();
                                var rotation = new THREE.Quaternion();
                                var scale = new THREE.Vector3();

                                child.matrixWorld.decompose(
                                    position, rotation, scale
                                );
                                
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
                                materials.push(child.material)
                                Utils.replaceMaterialWithLambert(child);
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
                                    this.worldOctree.fromGraphNode(gltf.scene);
                                }
                            );
                            
                        }

                        if(nivra.interactable) {
                            this.interactableNivrayim
                            .push(nivra);
                        }


                        nivra.materials = materials;
                        r(gltf);
                    })
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

                    
                    r(mesh);
                    return;
                }
                
            } catch(e) {
                console.log(e)
                j(e);
            }

            
        })
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

    async doPlaceholderLogic(nivra) {
        var nm = nivra.placeholderName;
        if(typeof(nm) == "string") {
            
            this.nivrayimWithPlaceholders.forEach(w=> {
                var pl = w.placeholders;
                
                if(pl[nm]) {
                    var av/*ailable*/ = pl[nm].find(q=>!q.addedTo);
                    if(av) {
                        nivra.mesh.position.copy(av.position);
                        //nivra.mesh.rotation.copy(av.rotation);
                        av.addedTo = nivra;
                        
                    }
                }
            })
        }
    }
    /**
     * @method sealayk removes a nivra from 
     * the olam if it exists in it
     * @param {AWTSMOOS.Nivra} nivra 
     */

    async sealayk(nivra) {
        
        var ind = this.nivrayim.indexOf(nivra)
        if(ind > -1) {
            this.nivrayim.splice(ind, 1);
        }

        ind = this.nivrayimWithPlaceholders.indexOf(nivra);
        if(ind > -1) {
            this.nivrayimWithPlaceholders.splice(ind, 1);
        }

        ind = this.interactableNivrayim.indexOf(nivra);
        if(ind > -1) {
            this.interactableNivrayim.splice(ind, 1);
        }

        var m = nivra.mesh;
        try {
            m.removeFromParent();
            return true;
        } catch(e){
            return false;
        }
        

    }

    async heescheel/*starts the continuous creation*/() {
        this.isHeesHawvoos = true;
        
    }

    async loadNivrayim(nivrayim) {
        try {
            var nivrayimMade = [];
            
            await Promise.all(
                Object.entries(nivrayim).flatMap(([type, nivraOptions]) => {
                    
                    var ar;
                    var isAr = false;
                    if(Array.isArray(nivraOptions)) {
                        ar = nivraOptions;
                        isAr = true;
                    } else {
                        ar = Object.entries(nivraOptions)
                    }
                    return ar.map((entry) => {
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

                        var evaledObject = Utils.evalStringifiedFunctions(
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
                        
                        if(!nivra) return null;
                        
                        nivrayimMade.push(nivra);
                        return null;
                    })
                })
            );

            

            await Promise.all(nivrayimMade.map(async nivra => {
                if(nivra.heescheel && typeof(nivra.heescheel) == "function")
                    await nivra.heescheel(this);
                    
            }));

            await Promise.all(nivrayimMade.map(async nivra => {
                await this.doPlaceholderLogic(nivra);
            }));

            await Promise.all(nivrayimMade.map(async nivra => {
                
                if(nivra.madeAll) {
                    await nivra.madeAll(this);
                }

                if(nivra.ready) {
                    await nivra.ready();
                }

            }));

            

            if(!this.enlightened)
                this.ohr();
            return this;
        } catch (error) {
            console.error("An error occurred while loading: ", error);
            throw error;
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
        

        if(!info.nivrayim) {
            info.nivrayim = {}
        }
        
        // Load components if any
        if (info.components) {
            await this.loadComponents(info.components);
        }
        

        if(info.html) {
           
            var style = null
                
            
            if(!styled) {
                style = {
                    tag: "style",
                    innerHTML:/*#css*/`
                        .ikar${ID} {
                            -moz-user-select: none;
                            -webkit-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                            position: absolute;
                            top: 0; left:0;
                            width: 100%;
                            height:100%;
                        }

                        .ikar${ID} > div > div {
                            position:absolute;
                        }
                    `
                };
                styled = true;
            }
            var par = {
                children: [
                    info.html,
                    style
                ],
                ready(me, c) {
                    
                },
                className: `ikar${ID}`
            }
            
            var stringed = Utils.stringifyFunctions(par);
            this.ayshPeula(
                "htmlCreate",
                stringed
            );
        }

        /**
         * Load the creations specified in the tzimtzum (start)
         */
        var loaded = await this.loadNivrayim(info.nivrayim);
        this.ayshPeula("ready", this, loaded);
        return loaded;
    }
}
