/**
 * B"H
 */
 import * as THREE from '/games/scripts/build/three.module.js';;
 
 import * as AWTSMOOS from './awtsmoosCkidsGames.js';


import {
	GLTFLoader
} from '/games/scripts/jsm/loaders/GLTFLoader.js';

import Ayin from "./ckidsCamera.js";

import {
	Octree
} from '/games/scripts/jsm/math/Octree.js';

import Utils from './utils.js'

export default class Olam extends AWTSMOOS.Nivra {
    STEPS_PER_FRAME = 5;
    aynaweem/*"eyes" / cameras*/ = [];
    loader = new GLTFLoader();
    clock = new THREE.Clock();
    ohros/*lights*/=[];
    scene = new THREE.Scene();
    renderer;
    objectsInScene = [];
    keyStates = {};
    GRAVITY = 30;
    worldOctree = new Octree();
    mouseDown = false;
    nivrayim = [];
    isHeesHawvoos/*iscreating/animating*/ = false;

    ayin;
    ayinRotation = 0;
    ayinPosition = new THREE.Vector3();
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
            this.ayin.zoom(event.deltaY)
        })

        this.on("mousedown", peula => {
            if (peula.button === THREE.MOUSE.LEFT) {
                this.ayshPeula("mouseLock", true);
                this.mouseDown = true;
            }
        });
        
        this.on("mousemove", peula => {
            if(this.mouseDown) {
                this.ayin
                .rotateAroundTarget(peula.movementX, peula.movementY);
            }
        });

        this.on("mouseup", peula => {
            if (peula.button === THREE.MOUSE.LEFT) {
                this.ayshPeula("mouseRelease", true);
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
                self.ayin.update(self.deltaTime);
                

                
                
                if(self.nivrayim) {
                    self.nivrayim.forEach(n => 
                        n.heesHawveh?
                        n.heesHawvoos(self.deltaTime) : 0
                    );
                }
                
            }

            // The rendering. This is done once per frame.
            if(self.renderer) {
                self.renderer.render(
                    self.scene,
                    self.ayin.camera
                );
            }
            // Ask the browser to call go again, next frame
            requestAnimationFrame(go);
        }
        requestAnimationFrame(go);
    }

    takeInCanvas(canvas) {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas
        });
        this.setSize(this.width, this.height, false);
        
    }

    setSize(vOrWidth={}, height) {
        var width;
        if(typeof(vOrWidth) == "number") {
            width = vOrWidth;
        } else if (typeof(vOrWidth) == "object") {
            ({width, height} = vOrWidth);
        }
        this.width = width;
        this.height = height;
        if(
            typeof(width) == "number" &&
            typeof(height) == "number"
        ) {
            if(this.renderer)
                this.renderer.setSize(width, height, false);
        }
        
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
    
                                    child.material.map.anisotropy = 4;
                    
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
                    var golem = nivra.golem || {};
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

    async hoyseef(nivra) {
        var three;
        if(nivra && nivra.mesh  instanceof THREE.Object3D) {
            three = nivra.mesh;
        } else return null;

        this.scene.add(three);
        this.nivrayim.push(nivra);

        
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
                        console.log("neevrud",nivra)
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