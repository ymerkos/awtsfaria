/**
 * B"H
 */
 import * as THREE from 'three';
 
 import * as AWTSMOOS from './awtsmoosCkidsGames.js';


 import {
	GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';


import {
	Octree
} from 'three/addons/math/Octree.js';


import Utils from './utils.js'

class Olam {
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
    constructor() {
        this.scene.background = new THREE.Color(0x88ccee);
        this.scene.fog = new THREE.Fog(0x88ccee, 0, 50);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

        /*setup event listeners*/
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

    boyraryNivra/*createCreation*/(nivra) {
        return new Promise((r,j) => {
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
            })

            /*if solid, add to octree*/
            if(nivra.isSolid) {
                this.worldOctree.fromGraphNode(gltf.scene);
            }
        })
        
    }

    async hoyseef(threeObjectOrNivra) {
        var three;
        if(threeObjectOrNivra  instanceof THREE.Object3D) {
            three = threeObjectOrNivra;
            
        } else if(threeObjectOrNivra.three instanceof THREE.Object3D) {
            three = threeObjectOrNivra.three     
        } else return null;

        this.scene.add(three);
        
        return three;
    }

    async tzimtzum/*go, create world and load thigns*/(info = {}) {
        if(!info.nivrayim) {
            info.nivrayim = {}
        }
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
        } catch (error) {
            console.error("An error occurred while loading: ", error);
        }
    }
}