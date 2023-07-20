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

export default class Olam extends AWTSMOOS.Nivra {
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
    objectsInScene = []; // Objects in the scene

    // Animation-related properties
    isHeesHawvoos = false; // Flag to indicate if the scene is currently animating
    nivrayim = []; // Objects to be animated

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

    constructor() {
        super();

        this.ayin = new Ayin();
        this.scene.background = new THREE.Color(0x88ccee);
        this.scene.fog = new THREE.Fog(0x88ccee, 0, 50);
        
        /*setup event listeners*/
        this.on("keydown", peula => {
            this.keyStates[peula.code] = true;
            console.log(peula.code)
        });

        this.on("keyup", peula => {
            this.keyStates[peula.code] = false;
        });

        this.on('wheel', (event) => {
            this.ayin.deltaY = event.deltaY;
            this.ayin.zoom(event.deltaY)
        })

        this.on("mousedown", peula => {
            if (peula.button === THREE.MOUSE.LEFT) {
                this.ayshPeula("mouseLock", true);
                this.ayin.onMouseDown(peula);
                this.mouseDown = true;
            }
        });
        
        this.on("mousemove", peula => {
            if(this.mouseDown) {
                this.ayin.onMouseMove(peula);
            }
        });

        this.on("mouseup", peula => {
            if (peula.button === THREE.MOUSE.LEFT) {
                this.ayshPeula("mouseRelease", true);
                this.ayin.onMouseUp(peula);
                this.mouseDown = false;
            }
        });

        this.on

        this.on("resize", peula => {
            this.setSize(peula.width, peula.height, false);
        })
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

    console.log("Setting",this.width, this.height)
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
                
                if(nivra.path) {
                    /**
                     * If has path, load it as GLTF.
                     * If is primitive object. set it's model
                     * as a promitive
                     */
                    
                    this.loader.load(nivra.path, gltf => {
                        
                        gltf.scene.traverse(child => {
                            /*adds items that aren't player to special list
                            for camera collisions etc.*/
                            if (child.isMesh && !child.isAwduhm) {
                                this.objectsInScene.push(child);
                            } else if(child.isMesh) {
                                if (child.material.map) {
    
                                    ///child.material.map.anisotropy = 4;
                    
                                }
                            }
                        });
    
                        /*if solid, add to octree*/
                        if(nivra.isSolid) {
                            this.worldOctree.fromGraphNode(gltf.scene);
                        }
                
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
                    var first = Object.entries(golem)[0] || {};
                    /*
                        get first proerpties of object
                        like aboev example since only 
                        one property (entry) per 
                        either geometry or material is needed
                    */
                    var firstGuf = first.guf || first.body;
                    var firstToyr = first.toyr || 
                    first.material || first.appearance;
                    if(typeof(firstGuf) == "object" && firstGuf) {
                        guf = first.guf;
                    }
                    if(typeof(firstToyr) == "object" && firstToyr) {
                        toyr = firstToyr;
                    }

                    /*get properties*/
                    var gufEntries = Object.entries(guf);
                    var toyrEntries = Object.entries(toyr);
                    console.log(gufEntries,toyrEntries)
                    var chomer /*geometry*/;
                    var tzurah /*material*/;
                    console.log(THREE[gufEntries[0][0]],gufEntries[0][0])
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

                    console.log(mesh)
                    r(mesh);
                    return;
                }
                
            } catch(e) {
                console.log(e)
                j(e);
            }

            
        })
    }

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

        if(nivra.isSolid) {
            this.ayin.objectsInScene.push(three);
        }
        
        if(nivra.ready) {
            await nivra.ready();
        }
        return nivra;
    }

    async heescheel/*starts the continuous creation*/() {
        this.isHeesHawvoos = true;
        
    }

    async tzimtzum/*go, create world and load things*/(info = {}) {
        if(!info.nivrayim) {
            info.nivrayim = {}
        }

        /**
         * Load the creations specified in the tzimtzum (start)
         */
        try {
            await Promise.all(
                Object.entries(info.nivrayim).flatMap(([type, nivraOptions]) =>
                    Object.entries(nivraOptions).map(([name, options]) => {
                        let nivra;
                        switch(type) {
                            case 'Domem':
                                nivra = new AWTSMOOS.Domem({name, ...options});
                                break;
                            case 'Tzoayach':
                                nivra = new AWTSMOOS.Tzoayach({name, ...options});
                                break;
                            case 'Chai':
                                nivra = new AWTSMOOS.Chai({name, ...options});
                                break;
                            case 'Medabeir':
                                nivra = new AWTSMOOS.Medabeir({name, ...options});
                                break;
                            case 'Chossid':
                                nivra = new AWTSMOOS.Chossid({name, ...options});
                                break;
                        }
                        
                        return nivra.heescheel(this);
                    })
                )
            );
            this.ohr();
            return this;
        } catch (error) {
            console.error("An error occurred while loading: ", error);
            throw error;
        }

        /**
         * Now initialize the scene. 
         * Add renderer object to DOM.
         * Need to figure out how this would work in web worker.
         */
    }
}
