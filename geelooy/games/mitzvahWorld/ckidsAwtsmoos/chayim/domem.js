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
     * varructs a new Domem.
     * 
     * @param {Object} options The options for this Domem.
     * @param {string} options.name The name of this Domem.
     * @param {string} options.path The path to the glTF model for this Domem.
     * @param {Object} options.position The initial position of this Domem.
     * @param {Boolean} options.isSolid If an object can be collided with
     * @property {Olam} olam The "world" object to interact with
     * @property {Array} animations the animations loaded from the 3D model, if any
     * @property {Boolean} heeshawveh / recreate, boolean to varantly update 
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
    entityData = {};
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
        this.entityName = options.entityName;
        this.playAll = !!options.playAll;
        if(typeof(this.entityName) == "string") {
            this.isTemplate = true;
        }

        
        this.isTemplate = options.isTemplate;


        if(options.entities) {
            this.entityData = options.entities;
        }
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

        this.on("opacity", amount => {
            var m = Array.isArray(this.materials);
            //console.log("doing",this,amount)
            if(!m) return
            this.materials.forEach(q => {
                if(!q.transparent) {
                    q.transparent = true;
                }
                q.opacity = amount;
                
            })
        });

        this.locationsChanged = [];
		
        this.on("reset position", () => {
            var mostRecent = this.locationsChanged[
                0
            ];
            if(!mostRecent) return;
            this.ayshPeula("change transformation", mostRecent)
        })
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
            });

            this.locationsChanged.push({
                position,
                rotation
            })
		});

        this.on("sealayk", () => {
            if(this.olam) {
                this.olam.ayshPeula("sealayk", this)
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

        
        

        this.ayshPeula("varructed", this);

        // Additional properties can be set here
    }

    sealayk() {
        this.ayshPeula("sealayk")
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

    _visible = true;
    /**
     * @property visible
     * @argument {Boolean} v
     */
    set visible(v) {
        
        this._visible = v;
        if(!this.mesh) return;
        this.mesh.visible = v;
    }

    get visible() {
        return this._visible;
    }

    async getIcon() {
        if(this.iconItem) {
            var iconData = await this.olam.getIconFromType(this.constructor.name)
            
        } else if(this.iconPath) {
            var img = "../icons/"+this.iconPath;
            var f = await fetch(img);
            var t = await f.text()//svg images
            return t;
        }
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
        /**
         * either its a new nivra
         * in which case we need
         * a new mesh or load one
         * 
         * or its an "entity" or "template" which
         * means it will take the place
         * of an existing child that we can set
         * later.
         * 
         */

        if(this.isTemplate) {
            /**
             * do noting now
             * but can set the mesh later
             */
            return true;
        } else {
            try {
                var threeObj; 
            
                var res;
                try {
                    res = await olam.boyrayNivra(this);
                } catch(e) {
                    throw e
                }


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
                    this.mesh.visible = this.visible;
                    return true;
                }

                return false;
            } catch(e) {
                throw e;
            }
        }
        // Implement Domem-specific behavior here
    }

    /**
     * @method moveMeshToSceneRetainPosition
     * Moves a mesh to the scene, retaining its world position, rotation, and scale.
     * Removes the mesh from all of its parents except the main scene.
     */
    moveMeshToSceneRetainPosition(mesh = null) {
        var mesh = mesh || this.mesh;
        var scene = this.olam?this.olam.scene:null;
        if(!scene || !mesh) return
        // Ensure the mesh's matrixWorld is updated
        mesh.updateMatrixWorld(true);
    
        // Store the current world position, rotation, and scale
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        mesh.matrixWorld.decompose(position, quaternion, scale);
    
        // Remove the mesh from its parent
        if (mesh.parent) {
        mesh.parent.remove(mesh);
        }
    
        // Add the mesh directly to the scene
        scene.add(mesh);
    
        // Apply the stored world position, rotation, and scale to the mesh
        mesh.position.copy(position);
        mesh.quaternion.copy(quaternion);
        mesh.scale.copy(scale);
    
        // Reset the mesh's matrix so that its position, rotation, and scale are applied relative to the scene
        mesh.updateMatrix();
    }
    setMesh(mesh/*THREEjs object*/) {
        this.mesh = mesh;
        this.proximityCollider = null;
    }
    disperseInstance(w, h) {
        if(this.instanced) {
            // Set position, rotation, and scale for each instance
            for (let i = 0; i < this.instanced; i++) {
                var position = new THREE.Vector3(
                    Math.random() * w, 0, Math.random() * h
                );
                var rotation = new THREE.Euler(0, Math.random() * Math.PI * 2, 0);
                var quaternion = new THREE.Quaternion().setFromEuler(rotation);
                var scale = new THREE.Vector3(1, Math.random() + 0.5, 1);
                var matrix = new THREE.Matrix4().compose(position, quaternion, scale);
                
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
        var loader = new THREE.TextureLoader();
     //   console.log("mixing all",maskTexture,overlayTexture,baseTexture)
         // Helper function to load texture and optionally set repeat values
         function loadTexture(url, shouldRepeat = false, repeatX = 1, repeatY = 1) {
    
            return new Promise((resolve) => {
                var a = self.asset;
                if(!a) resolve();
                var loader = self.asset.parser.textureLoader;
                
                loader.load(
                    // resource URL
                    url,
                    
                    // onLoad callback
                    function (imageBitmap) {
                      //  console.log("Loaded!", url, imageBitmap);
                        
                        var texture = new THREE.Texture(imageBitmap);
                       
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
        var mask = await loadTexture(maskTexture);
        var base = await loadTexture(baseTexture, true, repeatX, repeatY);
        var overlay = await loadTexture(overlayTexture, true, repeatX, repeatY);
    
        
        var fogColor = new THREE.Color(0x88ccee);




        
        var customLambertMaterial = new THREE.MeshLambertMaterial();
        customLambertMaterial.onBeforeCompile = function (shader) {
            // Add custom uniforms
            shader.uniforms.maskTexture = { value: mask };
            shader.uniforms.baseTexture = { value: base };
            shader.uniforms.overlayTexture = { value: overlay };
            shader.uniforms.repeatVector = { value: new THREE.Vector2(repeatX, repeatY) };
        
            // Vertex shader: ensure vUv is declared and assigned
            shader.vertexShader = 'varying vec2 vUv;\n' + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace(
                '#include <uv_vertex>',
                'vUv = uv;\n#include <uv_vertex>'
            );
            
            // Fragment shader: declare custom uniforms and varyings
            shader.fragmentShader = 'varying vec2 vUv;\n' + shader.fragmentShader;
            shader.fragmentShader = 'uniform vec2 repeatVector;\n' + shader.fragmentShader;
            shader.fragmentShader = 'uniform sampler2D maskTexture;\n' + shader.fragmentShader;
            shader.fragmentShader = 'uniform sampler2D baseTexture;\n' + shader.fragmentShader;
            shader.fragmentShader = 'uniform sampler2D overlayTexture;\n' + shader.fragmentShader;
        
            // Custom fragment shader code
            var customFragmentCode = `
                vec2 uv = vUv * repeatVector;
                vec2 uvBase = vUv;

                vec4 maskColor = texture2D(maskTexture, uvBase);
                vec4 baseColor = texture2D(baseTexture, uv);
                vec4 overlayColor = texture2D(overlayTexture, uv);
                float maskFactor = maskColor.r; // Blend custom textures
                vec4 blendedColor = mix(baseColor, overlayColor, maskFactor);
                
                diffuseColor *= blendedColor;
            `;
        
            // Inject the custom code after UV and texture setup
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                '#include <map_fragment>\n'+customFragmentCode 
            );
        };

        
        var material = customLambertMaterial;
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
        volume = 1,
		onended=()=>{}
    } = {}) {
        
        var music = this.olam.getComponent(path);
        
       // console.log("Hi!",music,path)
        if(!music) return false;
        this.olam.ayshPeula("setHtml",({
            shaym: layerName,
			info: {
				options: {
					loop, 
					music,
                    volume,
					shaym:this.shaym/*domem UID*/,
                    layerName
				},
				ready: function(me, $f, ui) {
					
                    var newShaym = me.options.shaym + " "
                        + me.options.layerName;
                    var nv = $f(newShaym);
                    
                  /*  console.log(
                        "A",
                        nv, 
                        me.options, 
                        newShaym,
                        "Making! maybe?!",
                        nv
                    )*/
					if(!nv) {
						var h = ui.html({
							shaym: newShaym,
							parent: me,
							tag: "audio",
							src: me.options.music,
                            volume:me.options.volume,
							autoplay: true,
							loop:me.options.loop
						});
                    //    console.log("Made!",h,nv,"HI aain")
					} else {
                        ui.setHtml(nv, {
                            tag: "audio",
							src: me.options.music,
                            volume:me.options.volume,
							autoplay: true,
							loop:me.options.loop
                        })
                   //     console.log("SET",nv)
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
		playing if any (on that layer)
	*/
	
	stopSound(
        layerName = "audio base layer",
	) {
        var newShaym = this.shaym + " "
        + layerName;
       // console.log("Trying it",newShaym)
        this.olam.ayshPeula("htmlAction", {
            shaym: newShaym,
            methods: {
                pause: true
            },
            properties: {
                currentTime: 0
            }
        })
        
	}
	
	stopCutscene() {
		this.stopSound();
		this.olam.activeCamera = null;
	}
	
	
	
	playCutscene({
		audioName, 
		animationName,
		cameraName = "Camera",
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
		
        var clip = THREE.AnimationClip.findByName(this.animations, shaym);
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
		
		
		var clipKeys = Object.keys(this.clipActions);
	
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
        var finished = (e) => {
            
            if (e.action === newAction) {
                if(!loop) {
                    newAction.stop();
                    return;
                }
                clipKeys.forEach(key => {
                    var otherAction = this.clipActions[key];
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

                

            