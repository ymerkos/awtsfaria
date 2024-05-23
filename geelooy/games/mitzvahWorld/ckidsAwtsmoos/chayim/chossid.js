/**
 * B"H
 * Player = Chossid
 */

import * as THREE from '/games/scripts/build/three.module.js';


/**
 * Chossid is a subclass of Medabeir representing the player's character.
 * 
 * @class
 * @extends Medabeir
 */
import Medabeir from './medabeir.js';


var ACTION_TOGGLE = "KeyC";
var ACTION_SELECT = "Enter";

var CAMERA_PAN_UP = "KeyR";
var CAMERA_PAN_DOWN = "KeyF";

var CAMERA_FPS_TOGGLE = "KeyT";

var pressedFps = false;
var pressedToggle = false;
var pressedSelect = false;


var isInEditorMode = false;
export default class Chossid extends Medabeir {
    /**
     * The type of the character (Chossid)
     * @type {String}
     */
    type = "chossid";

   

    
    
    /**
     * varructs a new Chossid (character).
     * 
     * @param {Object} options The options for this Chossid.
     * @param {string} options.name The name of this Chossid.
     * @param {string} options.path The path to the glTF model for this Chossid.
     * @param {Object} options.position The initial position of this Chossid.
     * @param {Array<Object>} options.inventory The initial inventory of this Chossid.
     */
    _optionsSpeed = null;


    /**
     * @property approachedEntities
     * when the player gets close
     * to an NPC that he can 
     * talk to it is added
     * in this array
     * until he walks away from it
     * 
     */
    approachedEntities = [];
    constructor(options) {
        super(options);
        
        
        this.rotateOffset = 0;
        this.optionsSpeed = options.speed;
    }
    

    
    /**
     * Controls character movement based on key input
     * 
     * @param {number} deltaTime Time since the last frame
     */
    controls( deltaTime ) {
        
        this.resetMoving();
        //this.rotateOffset  = 0;

        if(this.olam.showingImportantMessage )
            return;

        if(this.olam.inputs.RUNNING) {
            this.moving.running = true;
        }
        // Forward and Backward controls
        
        if ( this.olam.inputs.FORWARD ) {
            this.moving.forward = true;
        }

        if ( this.olam.inputs.BACKWARD ) {
            this.moving.backward = true;
        }

        
        // Rotation controls
        if ( 
            this.olam.inputs.LEFT_ROTATE
        ) {
            
            this.moving.turningLeft = true;
        }

        if ( 
            this.olam.inputs.RIGHT_ROTATE
        ) {
            
            this.moving.turningRight = true;
        }

        // Striding controls
        if ( this.olam.inputs.LEFT_STRIDE ) {
            this.moving.stridingLeft = true;
        }

        if ( this.olam.inputs.RIGHT_STRIDE ) {
            this.moving.stridingRight = true;
        }

        
        if(this.olam.inputs.JUMP) {
            this.moving.jump = true;
        }
        



        
        this.cameraControls();
        this.movingSounds()
    }

    movingSounds() {
        
    }


    cameraControls() {
        if(
            this.olam
            .keyStates[CAMERA_PAN_UP]
        ) {
            this.olam.ayin
            .panUp();
        } else if(
            this.olam.keyStates[CAMERA_PAN_DOWN]
        ) {
            this.olam.ayin
            .panDown();

        }

        

    }
    
    dialogueControls(e/*key pressed*/) {
        var k = e.key;
      //  console.log("Pressed!", k, this.interactingWith)
        if(!this.interactingWith) {
            return;
        }


        // Check if the key pressed is a number between 1 and 9
        if (k >= 1 && k <= 9) {
            //console.log(`Number ${k} was pressed.`);
            // Return the number as an integer
            var num = parseInt(k, 10);
            this.interactingWith?.toggleToOption?.(num - 1);
        }
    }

    /**
     * @method manageEditingMode
     * @description to be called in an 
     * update loop, when one is in 
     * editing mode just shoots new raycast
     */
    manageEditingMode() {
        if (isInEditorMode) {
            // Get the player's position and forward direction
            let playerPosition = this.mesh.position.clone();
            let playerForwardVector = this.getForwardVector();
            
            playerPosition.y += this.height;

            // Set a magnitude for the direction vector to determine how far the line should extend
            let magnitude = 5;
            playerForwardVector.multiplyScalar(magnitude);
            
            // Calculate the end point of the line by adding the direction vector to the player position
            let lineEndPoint = new THREE.Vector3()
            .addVectors(playerPosition, playerForwardVector);
            
            // Set the start and end points for the line
            this.editLine.geometry.setFromPoints([playerPosition, lineEndPoint]);
            this.editLine.geometry.verticesNeedUpdate = true;
            return;
            // Update the raycaster with the camera's current position and direction
            this.olam.ayin.raycaster.set(cameraPosition, cameraDirection);
    
            // Get the list of objects the ray intersects
            var intersects = this.olam.ayin.raycaster.intersectObjects(this.olam.scene.children, true);
    
            if (intersects.length > 0) {
                // The first element in the intersects array is the closest object the ray intersects
                var intersection = intersects[0];
    
                // Update the editLine to visualize the ray
                this.editLine.geometry.setFromPoints([cameraPosition, intersection.point]);
                this.editLine.geometry.verticesNeedUpdate = true;  // Add this line
    
                if (!this.editLine.visible) {
                    this.editLine.visible = true;
                }
    
                if (Date.now() % 1000 == 0) {
                    console.log("Lining!", [cameraPosition, intersection.point]);
                    console.log(this.olam.ayin.camera.position);
                }
                // Use intersection point to show where the item will be placed
            }
        }
    }
    
    /**
     * Starts the Chossid. Sets the initial position and sets this Chossid as the target of the camera
     * 
     * @param {Olam} olam The world in which this Chossid is being started.
     */
    async heescheel(olam) {
        await super.heescheel(olam);
        this.setPosition(new THREE.Vector3());
        
        
        
        this.on("you approached", npc => {
            var exists = this.approachedEntities
                .indexOf(
                    npc
                );

            if(exists < 0) {
                this
                .approachedEntities
                .push(npc);
            }
        });

        var removeNpc = npc => {
            if(!npc) return;
            var ind = this.approachedEntities.indexOf(npc);
            if(ind > -1) {
                this.approachedEntities.splice(ind, 1);
            }
        }

        this.on("the dialogue was closed from", npc => {
            removeNpc(npc)
        })
        
        this.on("you moved away from", npc => {
            removeNpc(npc)
        });

        
        var isOtherview = false;
        olam.on("keypressed", k => {
            this.ayshPeula("keypressed", k);
            this.dialogueControls(k);
            switch(k.code) {
                case "KeyB":
                    this.throwBall(
                        this.olam.randomLetter(),
                        {
                            color: 
                            this.olam.randomColor()
                        }
                    )
                break;
                case "NumLock":
                    this.movingAutomatically = 
                    !this.movingAutomatically
                break;
                case "KeyY":
                if (!isOtherview) {
                    if (m.asset.cameras[0]) {
                        m.olam.activeCamera = m.asset.cameras[0]
                    }
                    isOtherview = true;
                } else {
                    isOtherview = false;
                    m.olam.activeCamera = null;
                }
                break;
                case "KeyG":
                    isInEditorMode = !isInEditorMode;
                case ACTION_TOGGLE:
                    
                    if(!this.interactingWith) {
                        
                        /**
                         * TODO toggle
                         * between 
                         * multiple NPCs
                         */
                        var npc = this.approachedEntities[0];
                        
                        if(!npc) return;
                        npc.ayshPeula("accepted interaction");
                        return;
                    }
                    
                    this.interactingWith.toggleOption();
                break;

                case ACTION_SELECT:
                    if(!this.interactingWith) {
                        return;
                    }
                    this.interactingWith.selectOption();

                break;

                case CAMERA_FPS_TOGGLE: 
                    this.olam.ayin.isFPS = 
                    !this.olam.ayin.isFPS;
                break;
                case "Space":
                    this.olam.ayshPeula("setInput", {
                        code: "Space"
                    });
                    
                    setTimeout(() => {
                        this.olam.ayshPeula("setInputOut", {
                            code: "Space"
                        });
                        
                        
                    },50);
                default:;
            }
        });

       

        this.setupSubMaterials()
    }
    
    setupSubMaterials() {
        var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        var geometry = new THREE.BufferGeometry()
            .setFromPoints([ 
                new THREE.Vector3(0, 0, 0), 
                new THREE.Vector3(0, 10, 0) 
            ]);
        var line = new THREE.Line(geometry, material);
        this.olam.scene.add(line);
        this.editLine = line;
    }

    async ready(m) {
        await super.ready();
    
        this.olam.chossid = this;
        this.olam.player = this;
        this.olam.ayin.target = this;
        if(this.optionsSpeed) {
            this.speed = this.optionsSpeed;
        }
        
        
    }
	
	
	async afterBriyah() {
		await super.afterBriyah(this);

        this.olam.ayshPeula("save player position")
        
	}
    async started() {
        this.iconPath = "chossid.svg";
        this.iconType = "centered"
        
        await this
        .olam
        .minimap
        .setMinimapItems([this], "chossid");
    }

    /**
     * Update function called each frame. Controls the character and handles collisions.
     * 
     * @param {number} deltaTime Time since the last frame
     */
    heesHawvoos(deltaTime) {
        if(!this.startedAll) {
            this.olam.ayshPeula("ready from chossid")
            this.startedAll = true;
        }
		if(!this.olam.isPlayingCutscene) {
            
			this.controls(deltaTime);
			
			this.manageEditingMode();
		}

        this.adjustDOF()
        this.postProcessing();
        super.heesHawvoos(deltaTime);
        
        
        if(typeof(this.olam.resetY) == "number")
        if(this.mesh.position.y < this.olam.resetY) {
            if(!this.teleporting) {
        
                this.teleporting = true;
                setTimeout(() => {
                    this.olam.ayshPeula('reset player position')
                    this.teleporting = false
                }, 100)
            }
        }
       
    }

    minimapPos = false;
    
    lastPos = new THREE.Vector3();
    postProcessing() {
        var pos = new THREE.Vector3();
        var offset;
        if(!this.lastPos.equals(this.mesh.position)) {
           pos.copy(this.mesh.position)

            var offset = new THREE.Vector3(
                pos.x, 15,
                pos.z
            )
        
            this.olam.ayshPeula("update minimap camera", ({
                position:offset,
                targetPosition:pos
            }))

            this.lastPos.copy(pos)

            this.ayshPeula("update earlier")
        }
    //    this.olam.ayshPeula("meshanehOyr", this.mesh.position)


        /**
         * minimap update
         */

        var mm =this.olam.minimap
        if(!mm) {
            return;
        }
        if(!mm.shaderPass) {
            return
        }

        var coords = //this.olam.getNormalizedMinimapCoords(
            pos
       // );
        if(!coords) return;
        this.minimapPos = coords;
        if(!this._did) {
            this._did=true;
        }
        var {x, y} = coords;  /*
            even though its checking on 
            z since its top down,
            but its returnign a vector2 which is x and y
        */
        if(typeof(x) == "number" && typeof(y) == "number")
            mm.shaderPass.uniforms.playerPos.value = coords

        var dir = this.modelMesh.rotation.y;
        mm.shaderPass.uniforms.playerRot.value = dir;
        var {x,y} = mm.shaderPass.uniforms.playerPos.value;
   
    }

    adjustDOF() {
        if(!this.olam.postprocessing) {
            return;
        }
        /*
        // Calculate distance from camera to player
        var playerDistance = this.olam.ayin.camera
            .position.distanceTo(this.mesh.position);
        
        this.olam.postprocessing
        .bokeh_uniforms[ 'focalDepth' ]
        .value = playerDistance;
*/
        
    }

    
}
