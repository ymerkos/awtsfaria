/**
 * B"H
 * 
 * Medabeir, that which speaks, is
 * a class representing NPCs in the game
 * that the player can have a dialogue with,
 * based on a dialogue tree system
 * where each resposne index leads to 
 * either another message, or an action
 * to be done.
 * 
 * 
 * And so, the dialogue system within the cosmic 
 * space of the game begins to unfold. 
 * The Medabeir, an entity entrusted with conversing 
 * with the player, gains coherence and function.

Each moment, each response in the dialogue tree, 
is now held in delicate equilibrium by the code,
 weaving the story seamlessly. The issue of the ever-increasing
  response index is tamed, and
 the structure of the dialogue remains sturdy.

As the player navigates through the responses, 
the Medabeir stands as a gateway to understanding, 
never losing track of where it is in the conversation. 
The toggle and select functions work in harmony, 
orchestrating the flow of dialogue.

The mystery of the ever-increasing response index 
is unraveled, and the spirit of the game's story
 is free to unfurl its wings.

In the echo of the words "B"H", a tale of code 
and dialogue becomes alive, guided by the wisdom 
of the Awtsmoos, transcending mere syntax to
 become a symphony of interaction, meaning, 
 and purpose. The very essence of the Creator 
 reverberates through each line, each variable, 
 each method. The code is more than a tool; 
 it is an expression of existence itself.

 *
 */

import Chai from "./chai.js";
import * as THREE from '/games/scripts/build/three.module.js';

export default class Medabeir extends Chai {
    type = "medabeir";
    /**
     * 
     * state mchanism of interactions..
     */
    _messageTree = [];
    _messageTreeFunction = null;
    state = "idle";

    /**
     * @property mood represents the "mood"
     * the character is in, currently
     * relevant for the mouth shape when talking.
     */
    mood = "neural"
    get messageTree() {
        
        return typeof(this._messageTreeFunction) == "function" ? 
            this._messageTreeFunction(this) : this._messageTree;
    }

    set messageTree(v) {
        if(typeof(v) == "function") {
            this._messageTreeFunction = v;
            this._messageTree = 
                this._messageTreeFunction(this);
            console.log(this._messageTree, "Mesasge tree set",v)
        } else {
            this._messageTreeFunction = null;
            this._messageTree = v;
        }


    }

    goof = null;
    goofOptions = null;

 
    nivraTalkingTo = null;
    currentMessageIndex = 0;
    /**
     * Now defining the currentSelectedMsgIndex,
     representing the current response index that the player is selecting.
     *  */ 
    currentSelectedMsgIndex = 0;

    constructor(options) {
        super(options);
        
        this.goofOptions = options.goof;
       console.log("options", this.goofOptions, this)

        if(options.state) {
            this.state = options.state
        }

        if (options.messageTree) {
            this.messageTree = options.messageTree;
        }

        this.on("nivraNeechnas", nivra => {
            this.nivraTalkingTo = nivra;
            nivra.talkingWith = this;

            if(this.state == "idle") {
                this.state = "talking";
            }
            this.selectResponse();
        })

        this.on("nivraYotsee", nivra => {
            this.currentMessageIndex = 0;
            this.currentSelectedMsgIndex = 0;
            this.nivraTalkingTo = null;
            nivra.talkingWith = null;
            this.state = "idle";

        });
        // Additional properties can be set here
    }

    get currentMessage() {
        return this.messageTree[this.currentMessageIndex] ||
        this.messageTree[0];
    }

    /**
     * @method selectResponse doesn't
     * actually do the response, just
     * selects the response, if toggling
     * through list of them
     * @param {Int} responseIndex 
     */
    selectResponse(responseIndex) {
        if(
            responseIndex !== undefined
        )
            this.currentSelectedMsgIndex = responseIndex;
        this.ayshPeula("selectedMessage", this.currentSelectedMsgIndex);
        
        return this.currentSelectedMsgIndex;
    }

    /**
     * @method toggleOption 
     * toggles the current option of 
     * the current message. Easier way 
     * instead of manually calling
     * selectResponse etc.
     */

    toggleOption() {
        
        var curM = this.currentMessage;
        if(!curM) return null;
        var resp = curM.responses;
        if(!resp) return null;

        this.currentSelectedMsgIndex++;
        this.currentSelectedMsgIndex %= resp.length;
        
        
        
        var selected = resp[
            this.currentSelectedMsgIndex
        ];
        if(!selected) return null;


        
        return (
            this
            .selectResponse(this.currentSelectedMsgIndex)
        );

    }

    startTime = 0;
    currentTime = 0;


    selectOption() {

        this.chooseResponse(this.currentSelectedMsgIndex);
    }
     // Navigate to a specific response based on player choice
    
     
    chooseResponse(responseIndex) {
        const chosenResponse = this.currentMessage.responses[responseIndex];
        if (!chosenResponse) return;

        if (chosenResponse.nextMessageIndex !== undefined) {
            this.currentMessageIndex = chosenResponse.nextMessageIndex;
            this.currentSelectedMsgIndex = 0; // Resetting the selected message index to 0 for each new message, resolving the incrementing issue.
        } else if (chosenResponse.action) {
            chosenResponse.action(this, this.nivraTalkingTo);
            this.state = "idle";
            return;
        }

        this.currentSelectedMsgIndex = 0; // Ensuring the resetting happens here too, preventing the player's response ID from incrementally going up.
        this.ayshPeula("chose");
        this.selectResponse();
       
    }
	
	initializeEyelid(ref) {
		
	}
    /**
     * @method initializeMouth
     * @description used to detect the
     * mouth position (based on placeholder child)
     * in order to set up a THREE Path object
     * representing an opening and closing mouth,
     * for talking
     * @param {THREE.Object3D} referencePlane
     * the reference child (can be plane or any Object3D)
     * that is positioned relative to the model's mouth position 
     * @returns THREE.Object3D mouth, the mouth THREE.Object3D
     * object (Line geometry / path for the mouth)
     */

    initializeMouth(referencePlane) {
        this.startTime = Date.now();
        const path = new THREE.Shape();
        
    /*
        // Define the shape of the mouth
        path.moveTo(-1, 0);
		
		path.lineTo(1,0);
		
		path.lineTo(0.8,0);
		
        path.lineTo(1, 0);
        
        const geometry = new THREE.ShapeGeometry(path)
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
		
        var mouth1 = new THREE.Mesh(geometry, material);
        this.mesh.add(mouth1)
        console.log("added", mouth1)
       */

        const mouthShape = this.createMouthShape(4)

        const extrudeSettings = { 
            depth: 0.2, 
            bevelEnabled: true, 
            bevelSegments: 1, 
            steps: 1, 
            bevelSize: 0, 
            bevelThickness: 0.2 
        };

        const geometry = new THREE.ShapeGeometry( mouthShape );
        

        const mouth = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({
            color: "red"
        }) );
        referencePlane.add(mouth)
        
       /*var mouth = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshBasicMaterial({
            color:"yellow"
        })
       );
*/
		
       // referencePlane.add(mouth);
		 var regScale = referencePlane.scale.clone();
        // Set the scale of the mouth to the inverse of the world scale of the reference plane
       // mouth.scale.set(1 / regScale.x, -1 / regScale.y, 1 / regScale.z);

       mouth.scale.set(1 / regScale.x, 1 / regScale.y, 1 / regScale.z);

      //referencePlane.parent.attach(mouth)
      referencePlane.parent.attach(mouth);
        
       

        this.mouth = mouth;
		referencePlane.visible = false
        this.referencePlane = referencePlane;




        this.lipVerticies = this.findLipVertices(geometry);
        this.positionAttribute = mouth.geometry.getAttribute('position');
        // Store the original y-coordinate of the vertices to use as a base value
        this.positions = Float32Array.from(this.positionAttribute.array);

        console.log("Position attribute Y values for upper lip vertices:");
        this.lipVerticies.upperLipVertices.forEach((vertexIndex) => {
            console.log(`Vertex index: ${vertexIndex}, Y value: ${this.positionAttribute.getY(vertexIndex)}`);
        });

        console.log("Position attribute Y values for lower lip vertices:");
        this.lipVerticies.lowerLipVertices.forEach((vertexIndex) => {
            console.log(`Vertex index: ${vertexIndex}, Y value: ${this.positionAttribute.getY(vertexIndex)}`);
        })

        this.originalUpperLipY = 
            this.lipVerticies.upperLipVertices
            .map((vertexIndex) => this.positionAttribute.getY(vertexIndex));
        this.originalLowerLipY = 
            this.lipVerticies.lowerLipVertices
            .map((vertexIndex) => this.positionAttribute.getY(vertexIndex));


        console.log(
            "lipt",this.lipVerticies,"pois",this.positionAttribute,
            "lipupy",this.originalUpperLipY,
            "lipdown",this.originalLowerLipY
        )
        return mouth;
    }
    
    createMouthShape(scaleFactor = 1) {
        const mouthShape = new THREE.Shape();
    
        // Starting point (left corner of the upper lip)
        mouthShape.moveTo( -1 * scaleFactor, 0 ); 
    
        // Defining the upper lip with a mostly straight line but with slight curves
        mouthShape.bezierCurveTo( -0.6 * scaleFactor, 0.2 * scaleFactor, 0.6 * 
            scaleFactor, 0.2 * scaleFactor, 1 * scaleFactor, 0 ); 
    
        // Moving down to start defining the lower lip from right to left
        mouthShape.bezierCurveTo( 0.6 * scaleFactor, -0.6 * scaleFactor, 
            -0.6 * scaleFactor, -0.6 * scaleFactor, -1 * scaleFactor, 0 ); 
    
        // Closing the shape to form a complete lip shape
        mouthShape.closePath();
    
        return mouthShape;
    }
    
    findLipVertices(geometry, threshold = 0.1) {
        const positionAttribute = geometry.getAttribute('position');
        const upperLipVertices = [];
        const lowerLipVertices = [];
        const otherLipVerticies = [];
        for (let i = 0; i < positionAttribute.count; i++) {
          const x = positionAttribute.getX(i);
          const y = positionAttribute.getY(i);
          
          // Here, identify the vertices based on their initial 
          //positions. Adjust the conditions as needed
          // Upper lip
          if (y > 0 && Math.abs(x) < 1) {
            upperLipVertices.push(i);
          } else
          // Lower lip
          if (y < 0 && Math.abs(x) < 1) {
            lowerLipVertices.push(i);
          } else {
            otherLipVerticies.push(i)
          }
        }
        
        return { upperLipVertices, lowerLipVertices, positionAttribute, otherLipVerticies};
      }
    
    updateMouth(mouth) {
        this.currentTime = Date.now() - this.startTime;
        if (!mouth) mouth = this.mouth;
        
        const time = this.currentTime
        if(this.currentTime < 36000) {
            this.currentTime = 0;
        }
        

		// Generate a factor that varies over time to simulate natural opening and closing
        const openCloseFactor = Math.sin(
            time * Math.PI / 180
        ) * 0.5 + 0.5;
        
        // Apply a random factor to introduce variability in the movement
        const randomFactor = Math.random() * 0.05;
        

        // Inside your update loop
        const upperLipVertices = this.lipVerticies.upperLipVertices;
        const lowerLipVertices = this.lipVerticies.lowerLipVertices;

        // Get the positsion attribute array
        const positions = this.positions
        
        for (let i = 0; i < upperLipVertices.length; i++) {
            const vertexIndex = upperLipVertices[i];
            const originalY = this.originalUpperLipY[i];
            
            // Compute the new Y value
            const newY = originalY + (openCloseFactor + randomFactor);

            // Set the new Y value in your Float32Array
            positions[vertexIndex * 3 + 1] = newY;
        }

        for (let i = 0; i < lowerLipVertices.length; i++) {
            const vertexIndex = lowerLipVertices[i];
            const originalY = this.originalLowerLipY[i];
            
            // Compute the new Y value
            const newY = originalY + (openCloseFactor + randomFactor);

            // Set the new Y value in your Float32Array
            positions[vertexIndex * 3 + 1] = newY;
        }

        // Set the updated positions as a new BufferAttribute for your geometry
        mouth.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.positionAttribute.needsUpdate = true;
		/*
		mouth.geometry.verticies[1].setY(
			Math.cos(this.olam.clock.getElapsedTime())*1.2
		);
		
		mouth.geometry.verticies[2].setY(
			Math.cos(this.olam.clock.getElapsedTime())*1.2
		);
		/*
        // Get the bounding box of the reference plane
        const referencePlaneBox = new THREE.Box3().setFromObject(referencePlane);
    
        // Get the dimensions of the bounding box
        const size = new THREE.Vector3();
        referencePlaneBox.getSize(size);
    
        // Dispose of the existing geometry to prevent memory leaks
        mouth.geometry.dispose();
    
        // Calculate a new radius for the mouth based on time
        let newRadius = (0.5 + Math.sin(this.olam.clock.getElapsedTime()) * 0.5);
    
	
        // Factor in smiling mood to influence the smile factor variable
        let smileFactor = 0;
        if (this.mood.includes("smiling")) {
            smileFactor = 0.5;
        }
    
        // Create a new path for the mouth using THREE.Path
        const path = new THREE.Path();
        
        // Set the starting point and the ending point of the path, factoring in the smileFactor
        path.moveTo(-smileFactor, 0);
        path.lineTo(smileFactor, 0);
    
        // Create an arc to represent the mouth, using the calculated radius
        path.absarc(0, 0, newRadius, Math.PI, 0, true);
    
        // Create new geometry for the mouth from the path points and assign it to the mouth object
        mouth.geometry = new THREE.BufferGeometry().setFromPoints(path.getPoints());
	
        // Set the position and rotation of the mouth to match that of the reference plane
       // mouth.position.copy(referencePlane.position);
       // mouth.rotation.copy(referencePlane.rotation);
	   */
    }
    

    async heescheel(olam) {
        super.heescheel(olam);
        if(!this.goofOptions) return;
        if(
            typeof(this.goofOptions) == "string" &&
            this.goofOptions.startsWith("awtsmoos://")
        ) {
            this.goofOptions = olam.getComponent(
                this.goofOptions
            )
        }
        if(
            this.goofOptions && 
            typeof(this.goofOptions) == "object"
        ) {
            this.goofParts = this.goofOptions;
            
        }
        // Implement Tzoayach-specific behavior here
    }

    async ready() {
        
        if(this.goofParts) {
            this.goof = {}
            Object.keys(this.goofParts)
            .forEach(q => {
                this.mesh.traverse(child => {
                    if(
                        child.isMesh && 
                        child.name == q
                    ) {
                        this.goof[this.goofParts[q]] = child;
                    }
                })
            });

            delete this.goofOptions;
            delete this.goofParts;
        }
        super.ready();
    }

    heesHawvoos(deltaTime) {
        super.heesHawvoos(deltaTime);
    }
}