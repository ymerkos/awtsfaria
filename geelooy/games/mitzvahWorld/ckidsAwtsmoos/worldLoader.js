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
    aynaweem/*"eyes" / cameras*/ = [];
    loader = new GLTFLoader();
    clock = new THREE.Clock();
    ohros/*lights*/=[];
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    objectsInScene = [];
    keyStates = {};
    GRAVITY = 30;
    worldOctree = new Octree();
    mouseDown = false;
    nivrayim = [];
    isHeesHawvoos/*iscreating/animating*/ = false;
    constructor() {
        super();
        this.scene.background = new THREE.Color(0x88ccee);
        this.scene.fog = new THREE.Fog(0x88ccee, 0, 50);
        
        
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

        /*setup event listeners*/
        /*
        document.addEventListener('keydown', (event) => {
            this.keyStates[event.code] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keyStates[event.code] = false;
        });


        addEventListener('mousedown', (event) => {
            if (event.button === THREE.MOUSE.LEFT) {
                document.body.requestPointerLock();
                this.mouseDown = true;
            }
        });

        addEventListener('mouseup', (event) => {

            document.exitPointerLock();
            this.mouseDown = false;

        });
        */
    }

    setSize(vOrWidth={}, height) {
        var width;
        if(typeof(vOrWidth) == number) {
            width = vOrWidth;
        } else if (typeof(vOrWidth) == "object") {
            ({width, height} = vOrWidth);
        }

        if(typeof(width) == "number" &&
        typeof(height) == "number") {
            this.renderer.setSize(width, height);
        }
    }

    set pixelRatio(v) {
        this.renderer.setPixelRatio(v);
    }

    ohr()/*light*/{
        const fillLight1 = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 0.5);
        fillLight1.position.set(2, 1, 1);
        scene.add(fillLight1);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(-5, 25, -1);

        scene.add(directionalLight);
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
                console.log("Trying it out", nivra)
                if(nivra.path) {
                    /**
                     * If has path, load it as GLTF.
                     * If is primitive object. set it's model
                     * as a promitive
                     */
                    console.log("laoding",nivra)
                    this.loader.load(nivra.path, gltf => {
                        console.log("Loaded!",gltf)
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
                    throw "No path."
                }
                
            } catch(e) {
                console.log(e)
                j(e);
            }

            
        })
    }

    async hoyseef(nivra) {
        console.log("hi",nivra,nivra.mesh,this)
        var three;
        if(nivra && nivra.mesh  instanceof THREE.Object3D) {
            three = nivra.mesh;
        } else return null;

        this.scene.add(three);
        this.nivrayim.push(nivra);

        console.log("hi",nivra,this,this.nivrayim)
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