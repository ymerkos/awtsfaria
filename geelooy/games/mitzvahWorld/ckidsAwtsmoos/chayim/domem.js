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
    playAll = false;
	shaym = "BH_" + Math.floor(Math.random() * 827231) + 12312 + 
		"_"+Date.now();
	removed = false;
    constructor(options) {
        super(options);
        this.path = options.path;
        this.golem = options.golem;
        this.position.set(options.position);
        this.rotation.set(options.rotation);
        this.isSolid = !!options.isSolid;
        this.interactable = options.interactable;
        this.proximity = options.proximity;
		this.heesHawveh = options.heesHawveh;
        this.height = options.height;
        this.instanced = options.instanced;
        this.playAll = !!options.playAll;
        if(typeof(this.instanced) != "number" || !this.instanced) {
            this.instanced = false;
        }
        this.on("hi", () => {
            console.log("wow")
        });

        this.on("madeAll", async (olam) => {
          //  console.log("hi")
            //this.mesh.rotation.copy(this.rotation.vector3());
            
        });
		
		this.on("change transformation", /**
			object with position and rotation
		**/({
            position,
            rotation
        }) => {
        //    console.log("Changing",this)
            if(this.mesh) {
                if(position)
                    this.mesh.position.copy(position);
                if(this.setPosition) {
                    this.setPosition(position)
                }
            }
			
			this.ayshPeula("collider transform update", {
                position, rotation
            })
		});

        this.on("sealayk", (olam) => {
            if(this.mesh) {

            }
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
            var threeObj; 
        
            var res;
            console.log("Triyng to make",this)  
            try {
                res = await olam.boyrayNivra(this);
            } catch(e) {
                throw e
            }

            console.log("MAde it",res)

            if(res) {
                threeObj = res;
            } else {
                
                throw "issue"
            }
             
            
            
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

            return false;
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

    /**
     * @method mixTextures
     * Useful for something like a terrain
     * where in blender u have
     * a mix shader 
     * with the factor
     * being another texture with
     * white as one 
     * and black as the other.
     * 
     * arguments are all
     * just a PATH or URL
     * to texture, needs
     * to be processed by THREE.js
     * 
     * @returns a new texture
     * custom made
     * with a custom shader
     * that mixes the two
     * and that can be 
     * plugged in somewhere
     * else as threeMesh.material.map=returnValue
     */
    async mixTextures({
        maskTexture/*
            the "factor"
            texture
            with white being one 
            and black the other
        */,
        baseTexture/*
            represented by 
            the black color

        */,
        overlayTexture/*
            represented by
            the white color
            of the maskTexture

        */,
        repeatX=1/*
            assuming
            both input
            textures are small
            and seamless
            this is the amount to repeat 
            it by
        */,
        repeatY=1/*ibit*/,
        childNameToSetItTo=null
    } = {}) {
        var self = this;
        const loader = new THREE.TextureLoader();
     //   console.log("mixing all",maskTexture,overlayTexture,baseTexture)
         // Helper function to load texture and optionally set repeat values
         function loadTexture(url, shouldRepeat = false, repeatX = 1, repeatY = 1) {
    
            return new Promise((resolve) => {
                const loader = self.asset.parser.textureLoader;
                
                loader.load(
                    // resource URL
                    url,
                    
                    // onLoad callback
                    function (imageBitmap) {
                      //  console.log("Loaded!", url, imageBitmap);
                        
                        const texture = new THREE.Texture(imageBitmap);
                       
                        if (shouldRepeat) {
                            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set(repeatX, repeatY);
                        }
                        
                        texture.needsUpdate = true; // Ensure the texture updates
                        
                        resolve(texture);
                    },
                    
                    // onProgress callback currently not supported
                    undefined,
                    
                    // onError callback
                    function (err) {
                        console.log('An error happened while loading texture:', err);
                    }
                );
            });
        }

        // Load textures asynchronously
        const mask = await loadTexture(maskTexture);
        const base = await loadTexture(baseTexture, true, repeatX, repeatY);
        const overlay = await loadTexture(overlayTexture, true, repeatX, repeatY);
     //   console.log("Loaded",mask,base,overlay)
        // Vertex Shader
        const vertexShader = `
        varying vec2 vUv;
        varying vec4 worldPosition;
        
        void main() {
            vUv = uv;
            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            worldPosition = modelMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
        }
        `;

        // Fragment Shader
        const fragmentShader = `
        uniform sampler2D maskTexture;
        uniform sampler2D baseTexture;
        uniform sampler2D overlayTexture;


        uniform vec3 fogColor;
        uniform float fogNear;
        uniform float fogFar;

        
        uniform vec2 repeatVector; // Added a new uniform to pass the repeat vector
        varying vec2 vUv;

        varying vec4 worldPosition;

        void main() {
            vec2 uv = vUv;
            vec2 uvBase = vUv;
            // Inverting the y-coordinate if necessary
            // uv.y = 1.0 - uv.y;

            uv *= repeatVector; // Modifying the uv coordinates based on the repeat vector


            vec4 maskColor = texture2D(maskTexture, uvBase);
            vec4 baseColor = texture2D(baseTexture, uv);
            vec4 overlayColor = texture2D(overlayTexture, uv);

            // Using the mask texture's red channel to blend between the base and overlay textures
            float maskFactor = maskColor.r;

            // Using the mask texture's alpha to blend between the base and overlay textures
            vec4 maskedColors = mix(baseColor, overlayColor, maskFactor);

              // Fog calculations
             
             // float depth = gl_FragCoord.z / gl_FragCoord.w;
              //float fogFactor = clamp((fogFar - depth) / (fogFar - fogNear), 0.0, 1.0);
              gl_FragColor = maskedColors;//mix(vec4(fogColor, maskedColors.w), maskedColors, fogFactor);
      
        }
        `;
        
        const fogColor = new THREE.Color(0x88ccee);
            // Create custom shader material to mix textures based on the mask
        const material = new THREE.ShaderMaterial({
            uniforms: {
                maskTexture: { value: mask },
                baseTexture: { value: base },
                overlayTexture: { value: overlay },
                repeatVector: { value: new THREE.Vector2(repeatX, repeatY) },
                //fogColor: { value: new THREE.Vector3(fogColor.r, fogColor.g, fogColor.b) },
               // fogNear: { value: 0 },
                //fogFar: { value: 50 }
            },
            vertexShader ,
            fragmentShader,
        });

        if(childNameToSetItTo) {
            var found = false;
            this.mesh.traverse((child => {
                
                if(found) return;
                if(child.name.includes(childNameToSetItTo)) {
                    found = true;
                    child.material = material;

                    child.material.needsUpdate=true
                    //child.material.map=overlay;
                   // child.material.map.wrapS = child.material.map.wrapT = THREE.RepeatWrapping;
                   // child.material.map.repeat.set(.001,.001)
               //     child.material.map = overlay;
                    child.material.needsUpdate=true
					if(child.material.map)
						child.material.map.needsUpdate=true
                    
                }
            }))
        }
        
    }
    
    async madeAll(olam) {
        
            

        //console.log(this,"hi")
    }

    async ready() {
        await super.ready();
        
       // console.log("Hi", this, this.mesh, this.name)
    }
	
	async afterBriyah() {
		super.afterBriyah();
        if(this.playAll) {
            this.heesHawveh = true;
            if(this.chaweeyoos)
                this.chaweeyoos.forEach(c => {
                    this.playChaweeyoos(c)
                })
        }
	}

    heesHawvoos(deltaTime) {
		if(this.removed) return;
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

    resetChaweeyoos(shaym) {
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
            if(action)
                action.reset();
        }
            
    }


    /**
     * 
     * @param {string} path 
     * the link to the awtsmoos
     * component of the audio 
     * loaded at first,
     * namely awtsmoos://audioName
     * (if loaded in "components" of olam)
     * 
     * @requires HTML element generated
     * by the dynamic ui with "shaym" of
     * "music player" like
     * 
     * shaym: "music player",
        children: [
            {
                shaym: "audio base layer"
            },
            {
                shaym: "audio effects layer 1"
            }
        ]
     */
    playSound(path, {
        layerName = "audio base layer",
        loop = false,
		onended=()=>{}
    } = {}) {
        var music = this.olam.getComponent(path);
        if(!music) return false;
        this.olam.ayshPeula("setHtml",({
            shaym: layerName,
			info: {
				options: {
					loop, 
					music,
					shaym:this.shaym
				},
				ready: function(me, $f, ui) {
					var nv = $f(me.options.shaym/*domem UID*/);
					if(!nv) {
						ui.html({
							shaym: me.options.shaym,
							parent: me,
							tag: "audio",
							src: me.options.music,
							autoplay: true,
							loop:me.options.loop
						})
					} else {
                        ui.setHtml(nv, {
                            tag: "audio",
							src: me.options.music,
							autoplay: true,
							loop:me.options.loop
                        })
                    }
				}
			}
        }));
		
		return {
			layerName,
			nivra:this
		}
        
    }
	
	/*
		each nivra only has
		one sound playing
		at a time per layer so 
		stopping sound will just 
		stop all sounds that that nivra is
		playing if any
	*/
	
	stopSound(
        layerName = "audio base layer",
	) {
		this.olam.ayshPeula("setHtml",({
            shaym: layerName,
			info: {
				domemShaym: this.shaym/*domem UID*/,
				ready: function(me, $f, ui) {
					var nv = $f(me.domemShaym);
					console.log("Trying",nv,me.domemShaym)
					if(nv)
						nv.parentNode.removeChild(nv);
				}
			}
        }));
	}
	
	stopCutscene() {
		this.stopSound();
		this.olam.activeCamera = null;
	}
	
	
	
	playCutscene({
		audioName, 
		animationName,
		cameraName = "Camera"
	} = {}) {
		
		this.playSound(audioName,{
			loop:false
			
			
		});
		
		this.playChaweeyoos(animationName, {
			loop:false,
			done() {
                try {
				    this.olam.activeCamera=null;
                } catch(e) {
                    
                }
			}
		});
		var cam = this.mesh.children.find(q=>q.name==cameraName);
		if(cam) {
			cam = cam.children[0];
			this.olam.activeCamera=cam;
			
		}
	}

    playChayoos(shaym, op) {
        this.playChaweeyoos(shaym, op);
    }

    nextAction = null;
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
    playChaweeyoos(shaym, options={duration: 0.36, loop:true, simplified:false}) {
        if (!this.animations) return;
        var duration = options.duration || .5;
        var loop = options.loop;
		
        const clip = THREE.AnimationClip.findByName(this.animations, shaym);
        if (!clip) return;
		
        let newAction = this.clipActions[shaym];
        if (!newAction) {
            newAction = this.animationMixer.clipAction(clip);
            this.clipActions[shaym] = newAction;
            if(!loop) {
                this.clipActions[shaym]
                .setLoop(THREE.LoopOnce);
                newAction.clampWhenFinished = true;
            }
          //  console.log("Trying new ", loop, duration, newAction, clip, options)
        }
    
	
		if (this.currentAction === newAction) {
			return;
		}
		
		
		const clipKeys = Object.keys(this.clipActions);
	
		// Fade out all other actions
		clipKeys.forEach(q => {
			if (q !== shaym && this.clipActions[q].isRunning()) {
				newAction.enabled = true;
				newAction.setEffectiveTimeScale(1)
					.setEffectiveWeight(1);
				this.clipActions[q].enabled = true;
				this.clipActions[q].setEffectiveTimeScale(1)
					.setEffectiveWeight(1)

				//console.log("fading", newAction,this.clipActions[q])
				this.clipActions[q].crossFadeTo(newAction, duration, false);
			}
		});
	
    
        newAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play();
        this.currentAction = newAction;
        this.currentAnimationPlaying = true;
		
		//console.log("Played", shaym)
        const finished = (e) => {
            
            if (e.action === newAction) {
                if(!loop) {
                    newAction.stop();
                    return;
                }
                clipKeys.forEach(key => {
                    const otherAction = this.clipActions[key];
                    if (
                        otherAction && 
                        otherAction !== newAction && 
                        otherAction !== this.currentAction && 
                        otherAction.isRunning()
                    ) {
                        otherAction.stop();
                      //  console.log("stopped",otherAction)
                    }
                });
                if (this.currentAction !== newAction) {
                    this.animationMixer.removeEventListener('loop', finished);
                } 
            }
			
			
			
			//console.log("Played at least once",dn,options)
            
        };
    
		function finishedPlaying() {
			var dn = options.done;
			if(typeof(dn) == "function") {
				dn();
			}
			//console.log("Finished playing animation",shaym,dn,options);
		}
        this.animationMixer.addEventListener('loop', finished);
		if(!loop)
			this.animationMixer.addEventListener("finished", finishedPlaying);
      //  console.log(`Trying to play: ${shaym}`);
    }

	simplePlayOnceAnimation(shaym) {
		
	}

    getChaweeyoos() {
        if(this.animations) {
            this.chaweeyoos = this.animations.map(q=>q.name);
            return this.chaweeyoos;
        }
    }
}

                

            