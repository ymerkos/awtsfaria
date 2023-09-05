/**
 * B"H
 * @file domem.js
 * @class Domem
 * @requires nivra.js
 */
import Nivra from "./nivra.js";
import {Kav} from "./roochney.js";
import * as THREE from '/games/scripts/build/three.module.js';
/**
 * Domem is a subclass of Nivra representing inanimate matter.
 * 
 * @class
 * @extends Nivra
 */
export default class Domem extends Nivra {
    /**
     * Constructs a new Domem.
     * 
     * @param {Object} options The options for this Domem.
     * @param {string} options.name The name of this Domem.
     * @param {string} options.path The path to the glTF model for this Domem.
     * @param {Object} options.position The initial position of this Domem.
     * @param {Boolean} options.isSolid If an object can be collided with
     * @property {Olam} olam The "world" object to interact with
     * @property {Array} animations the animations loaded from the 3D model, if any
     * @property {Boolean} heeshawveh / recreate, boolean to constantly update 
     *  it every frame or leave it.
     */
    type = "domem";
    animations = [];
    path = "";
    position = new Kav();
    rotation = new Kav();
    olam = null;
    heesHawveh = false;
    animationMixer;
    currentAnimationPlaying = null;
    golem = null;
    constructor(options) {
        super(options);
        this.path = options.path;
        this.golem = options.golem;
        this.position.set(options.position);
        this.rotation.set(options.rotation);
        this.isSolid = !!options.isSolid;
        this.interactable = options.interactable;
        this.proximity = options.proximity;

        
        this.instanced = options.instanced;
        if(typeof(this.instanced) != "number" || !this.instanced) {
            this.instanced = false;
        }
        this.on("hi", () => {
            console.log("wow")
        });

        this.on("madeAll", async (olam) => {
            console.log("hi")
            //this.mesh.rotation.copy(this.rotation.vector3());
            
        });

        /**
         * B"H
         * Allows one to set events when making
         * new object.
         * 
         * For @example
         * 
         * var d = new AWTSMOOS.Domem({
         *      on: {
         *          heesHawvoos(me) {
         *              //do something on update
         *          }
         *      }
         * })
         */

        
        

        this.ayshPeula("constructed", this);
        // Additional properties can be set here
    }

    serialize() {
        super.serialize();
        this.serialized = {
            ...this.serialized,
            position: this.position.serialize(),
            path: this.path
        }
        return this.serialized;
    }

    /**
     * Starts the Domem. This function can be overridden by subclasses to provide
     * Domem-specific behavior.
     * 
     * @param {Olam} olam The world in which this Domem is being started.
     */
    async heescheel(olam) {
        this.olam = olam;
        await super.heescheel(olam);
        
        try {
            var threeObj = await new Promise(async (r,j) => {
                var res;  
                try {
                    res = await olam.boyrayNivra(this);
                } catch(e) {
                    j(e);
                }
                /*initial "creation" in the world and return it.*/
                if(res) r(res); 
                else r(null);
            });
            
            if(threeObj) {
                
                if(threeObj.scene) {
                    this.mesh = threeObj.scene;
                } else if(threeObj) {
                    this.mesh = threeObj;
                }

                if(threeObj.animations) {
                    this.animations = threeObj.animations;
                }

                if(this.mesh) {
                    this.animationMixer = 
                    new THREE.AnimationMixer(
                        this.mesh
                    );
                    this.getChaweeyoos();

                    if(this.instanced) {
                        var geo = this.mesh.geometry || 
                        this.mesh.children[0].geometry;

                        if(geo && geo.isBufferGeometry) {
                            var mat = this.mesh.material ||
                                this.mesh.children[0].material;
                     
                            if(mat) {
                                var instancedMesh = new THREE.InstancedMesh(
                                    geo, mat,
                                    this.instanced
                                );
                                this.mesh = instancedMesh;
                            } else {
                                this.instanced = false;
                            }
                            
                        } else {
                            this.instanced = false;
                        }
                        
                    }
                }

                this.mesh.position.copy(
                    this.position.vector3()
                );
                
                
                
                await olam.hoyseef(this);
                
                this.ayshPeula("changeOctreePosition", this.position);
                return true;
            }
        } catch(e) {
            throw e;
        }
        // Implement Domem-specific behavior here
    }

    disperseInstance(w, h) {
        if(this.instanced) {
            // Set position, rotation, and scale for each instance
            for (let i = 0; i < this.instanced; i++) {
                const position = new THREE.Vector3(
                    Math.random() * w, 0, Math.random() * h
                );
                const rotation = new THREE.Euler(0, Math.random() * Math.PI * 2, 0);
                const quaternion = new THREE.Quaternion().setFromEuler(rotation);
                const scale = new THREE.Vector3(1, Math.random() + 0.5, 1);
                const matrix = new THREE.Matrix4().compose(position, quaternion, scale);
                
                this.mesh.setMatrixAt(i, matrix);
            }
        }
    }
    async madeAll(olam) {
        
            

        //console.log(this,"hi")
    }

    async ready() {
        await super.ready();
        
       // console.log("Hi", this, this.mesh, this.name)
    }

    heesHawvoos(deltaTime) {
        super.heesHawvoos(deltaTime);
        this.ayshPeula("heesHawvoos", this);
       // console.log(44,this.name)
        if(this.currentAnimationPlaying != null) {
            if(this.animationMixer) {
                this.animationMixer.update(
                    deltaTime
                );
            }
        }
    }
    clipActions = {};
    playChayoos(shaym) {
        this.playChaweeyoos(shaym);
    }
    /**
     * @function playChaweeyoos
     * play chaweeeyoos - lifeforce,
     * animation, of current model,
     * if it exists.
     * @param {String} shaym the "name"
     * of the animation to player.
     * 
     * Must be present in the model,
     * for example as a track in the GLB
     * with the given name.
     */
    playChaweeyoos/*playAnimation*/(shaym, duration = 0.36) {
        
        if(this.animations) {
            var k = Object.keys(this.clipActions)
            
            if(this.clipActions[shaym]) {
                if(this.clipActions[shaym].isRunning()) {
                    /*check if others are there*/
                    if(k.length) {
                        k.forEach(q=> {
                            if(q != shaym) {
                                //this.clipActions[q].fadeOut(duration)
                                this.clipActions[q].stop();
                            }
                        })
                        
                    }
                    return;
                } else {
                    this.clipActions[shaym]
                    .reset()
                    .setEffectiveTimeScale(1)
                    .setEffectiveWeight(1)
                    .fadeIn(duration)
                    .play();
                    return;
                }
            }
            
            var clip = THREE.AnimationClip
                .findByName(
                    this.animations,
                    shaym
                );
            if(clip) {
                var action = 
                this.animationMixer
                .clipAction(clip);
                if(!this.clipActions[shaym]) {
                    this.clipActions[shaym] = action;
                }
                if(action) {
                    action
                    .reset()
                    .setEffectiveTimeScale(1)
                    .setEffectiveWeight(1)
                    .fadeIn(duration)
                    .play();
                    this.currentAnimationPlaying = true;
                }
            }
        }
    }


    getChaweeyoos() {
        if(this.animations) {
            this.chaweeyoos = this.animations.map(q=>q.name);
            return this.chaweeyoos;
        }
    }
}

                

            