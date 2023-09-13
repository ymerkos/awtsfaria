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

 
    startTime = 0;
    currentTime = 0;


    mouthShapes = {
        "X": {
            // Neutral position, no offset applied
            upperLip: [
                [0, 0], [0, 0], [0, 0], [0, 0]
            ],
            lowerLip: [
                [0, 0], [0, 0], [0, 0], [0, 0]
            ],
        },
        "A": {
            // Closed mouth with a slight pressure between the lips for sounds “P”, “B”, “M”
            upperLip: [
                [0, 0.1], [0, 0.1], [0, 0.1], [0, 0.1]
            ],
            lowerLip: [
                [0, -0.1], [0, -0.1], [0, -0.1], [0, -0.1]
            ],
        },
        "B": {
            // Slightly open mouth with clenched teeth for most consonants like “K”, “S”, “T” and vowel "EE" in "bee"
            upperLip: [
                [0, 0.2], [-0.5, 0.3], [0.5, 0.3], [0, 0.2]
            ],
            lowerLip: [
                [0, -0.2], [0.5, -0.3], [-0.5, -0.3], [0, -0.2]
            ],
        },
        "C": {
            // Open mouth for vowels “EH” in "men", “AE” in "bat" and as an in-between in animations to "D"
            upperLip: [
                [0, 0.5], [-0.7, 0.6], [0.7, 0.6], [0, 0.5]
            ],
            lowerLip: [
                [0, -0.5], [0.7, -0.6], [-0.7, -0.6], [0, -0.5]
            ],
        },
        "D": {
            // Wide open mouth for vowel “AA” in "father"
            upperLip: [
                [0, 0.7], [-0.8, 0.9], [0.8, 0.9], [0, 0.7]
            ],
            lowerLip: [
                [0, -0.7], [0.8, -0.9], [-0.8, -0.9], [0, -0.7]
            ],
        },
        "E": {
            // Slightly rounded mouth for vowels “AO” in "off" and “ER” in "bird", and as an in-between in animations to "F"
            upperLip: [
                [-0.1, 0.4], [-0.5, 0.5], [0.5, 0.5], [0.1, 0.4]
            ],
            lowerLip: [
                [0.1, -0.4], [0.5, -0.5], [-0.5, -0.5], [-0.1, -0.4]
            ],
        },
        "F": {
            // Puckered lips for sounds “UW” in "you", “OW” in "show", and “W” in "way"
            upperLip: [
                [-0.5, 0.1], [-0.9, 0.2], [0.9, 0.2], [0.5, 0.1]
            ],
            lowerLip: [
                [0.5, -0.1], [0.9, -0.2], [-0.9, -0.2], [-0.5, -0.1]
            ],
        },
        "G": {
            // Upper teeth touching the lower lip for “F” in "for" and “V” in "very"
            upperLip: [
                [0, 0.6], [-0.1, 0.7], [0.1, 0.7], [0, 0.6]
            ],
            lowerLip: [
                [0, -1], [0.1, -1], [-0.1, -1], [0, -1]
            ],
        },
        "H": {
            // Extremely exaggerated open mouth shape for emphatic expressions or other needs in your animation
            upperLip: [
                [0, 1], [-1, 1], [1, 1], [0, 1]
            ],
            lowerLip: [
                [0, -1], [1, -1], [-1, -1], [0, -1]
            ],
        },
    };    

    


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
      
        var scale = 4;
        const {criticalPoints, mouthShape} = this.createMouthShape(scale)


        // Step 1: Pre-create all the mouth shapes
        const baseShape = this.createMouthShape(scale).mouthShape; // Create your base shape
        
        const geometry = new THREE.ShapeGeometry( baseShape);
        console.log("Making", baseShape)
        const morphShapes = {
            "A": this.createMouthShape(scale, this.mouthShapes["A"]),
            "B": this.createMouthShape(scale, this.mouthShapes["B"]),
            
            "C": this.createMouthShape(scale, this.mouthShapes["C"]),
            
            "D": this.createMouthShape(scale, this.mouthShapes["D"]),
            
            "E": this.createMouthShape(scale, this.mouthShapes["E"]),
            
            "F": this.createMouthShape(scale, this.mouthShapes["F"]),

            
            "G": this.createMouthShape(scale, this.mouthShapes["G"]),
            
            "H": this.createMouthShape(scale, this.mouthShapes["H"]),
            "X": {
                criticalPoints,
                mouthShape
            }
        };
        this.morphShapes = morphShapes;



        // Step 2: Setup morph targets
        for (const [key, morphShape] of Object.entries(this.morphShapes)) {
            
            var morphedGeo = new THREE.ShapeGeometry(morphShape.mouthShape);
            var positionMorphed = morphedGeo.getAttribute("position");

            morphShape.geometry = morphedGeo;
            morphShape.position = positionMorphed;
            morphShape.lipVerticies = this.findLipVertices(
                morphedGeo, morphShape.criticalPoints
            );
        }

        
        console.log("morphed shapes", this.morphShapes)



        

        
        

        const mouth = new THREE.Mesh( this.morphShapes.X.geometry, new THREE.MeshLambertMaterial({
            color: "red"
        }) );
        referencePlane.add(mouth)
     


        
        this.lipVerticies = this.findLipVertices(geometry, criticalPoints);
        this.positionAttribute = mouth.geometry.getAttribute('position');


        /**
         * create edge geometry for outline
         */

        // Create outline using boundary edges
        const boundaryEdges = this.getBoundaryEdges(mouth.geometry);
        const outlineGeometry = new THREE.BufferGeometry();
        outlineGeometry.setIndex(boundaryEdges);
        outlineGeometry.setAttribute('position', this.positionAttribute.clone());

        
        this.mouthOutline = new THREE.LineSegments(
            outlineGeometry, new THREE.LineBasicMaterial({color: 0x000000})
        ); // Black color for the outline
        referencePlane.add(this.mouthOutline);

		
		 var regScale = referencePlane.scale.clone();
        // Set the scale of the mouth to the inverse of the world scale of the reference plane

       mouth.scale.set(1 / regScale.x, 1 / regScale.y, 1 / regScale.z);

        referencePlane.parent.attach(mouth);
        

      
        
        // Scale and attach the outline just like the mouth mesh
        this.mouthOutline.scale.set(1 / regScale.x, 1 / regScale.y, 1 / regScale.z);
        referencePlane.parent.attach(this.mouthOutline);


        this.mouth = mouth;
		referencePlane.visible = false
        this.referencePlane = referencePlane;




        // Store the original y-coordinate of the vertices to use as a base value
        this.positions = Float32Array.from(this.positionAttribute.array);

        this.originalUpperLipY = 
            this.lipVerticies.upperLipVertices
            .map((vertexIndex) => this.positionAttribute.getY(vertexIndex));
        this.originalLowerLipY = 
            this.lipVerticies.lowerLipVertices
            .map((vertexIndex) => this.positionAttribute.getY(vertexIndex));


        this.originalUpperLipPoints = this.lipVerticies.upperLipVertices
        .map((vertexIndex) => [
            this.positionAttribute.getX(vertexIndex),
            this.positionAttribute.getY(vertexIndex)
        ]);

        this.originalLowerLipPoints = this.lipVerticies.lowerLipVertices
        .map((vertexIndex) => [
            this.positionAttribute.getX(vertexIndex),
            this.positionAttribute.getY(vertexIndex)
        ]);
        console.log("main postion", this.positionAttribute)
        return mouth;
    }
    
    getBoundaryEdges(geometry) {
        const indexAttr = geometry.getIndex();
        const indices = indexAttr.array;
    
        // Step 1: Create a map to store the count of each edge
        const edgeCountMap = new Map();
    
        // Step 2: Loop through each face in the geometry
        for (let i = 0; i < indices.length; i += 3) {
            const a = indices[i];
            const b = indices[i + 1];
            const c = indices[i + 2];
    
            // Step 3: For each face, increment the count for each edge
            incrementEdgeCount(a, b);
            incrementEdgeCount(b, c);
            incrementEdgeCount(c, a);
        }
    
        // Step 4: Extract the boundary edges (edges used by only one triangle)
        const boundaryEdges = [];
        for (const [key, count] of edgeCountMap.entries()) {
            if (count === 1) {
                const [a, b] = key.split('_').map(Number);
                boundaryEdges.push(a, b);
            }
        }
    
        return boundaryEdges;
    
        function incrementEdgeCount(a, b) {
            // Create a unique key for each edge (regardless of the order of the vertices)
            const key = a < b ? `${a}_${b}` : `${b}_${a}`;
            edgeCountMap.set(key, (edgeCountMap.get(key) || 0) + 1);
        }
    }
    

     createMouthShape(scaleFactor = 1, offsets = null) {
        const mouthShape = new THREE.Shape();
    
        // Record critical points that will define the lip regions
        const criticalPoints = {
            /*
                represents base X mouth position,
                neutral.
            */
            upperLip: [
                { x: -1 * scaleFactor, y: 0 },
                { x: -0.6 * scaleFactor, y: 0.1 * scaleFactor },
                { x: 0.6 * scaleFactor, y: 0.1 * scaleFactor },
                { x: 1 * scaleFactor, y: 0 }
            ],
            lowerLip: [
                { x: 1 * scaleFactor, y: 0 },
                { x: 0.6 * scaleFactor, y: -0.1 * scaleFactor },
                { x: -0.6 * scaleFactor, y: -0.1 * scaleFactor },
                { x: -1 * scaleFactor, y: 0 }
            ]
        };
        
         // If offsets are provided, apply them to the original points
        if (offsets) {
            for (let i = 0; i < 4; i++) {
                criticalPoints.upperLip[i].x += offsets.upperLip[i][0];
                criticalPoints.upperLip[i].y += offsets.upperLip[i][1];
                criticalPoints.lowerLip[i].x += offsets.lowerLip[i][0];
                criticalPoints.lowerLip[i].y += offsets.lowerLip[i][1];
            }
        }

        
        // Starting point (left corner of the upper lip)
        mouthShape.moveTo( 
            criticalPoints.upperLip[0].x, 
            criticalPoints.upperLip[0].y 
        ); 
    
        // Defining the upper lip with a mostly straight line but with slight curves
        mouthShape.bezierCurveTo(
            criticalPoints.upperLip[1].x, 
            criticalPoints.upperLip[1].y, 

            criticalPoints.upperLip[2].x, 
            criticalPoints.upperLip[2].y,

            criticalPoints.upperLip[3].x,
            criticalPoints.upperLip[3].y,
        ); 
    
        // Moving down to start defining the lower lip from right to left
        mouthShape.bezierCurveTo(
            criticalPoints.lowerLip[1].x, 
            criticalPoints.lowerLip[1].y, 

            criticalPoints.lowerLip[2].x, 
            criticalPoints.lowerLip[2].y,

            criticalPoints.lowerLip[3].x,
            criticalPoints.lowerLip[3].y,
        ); 
        
        // Closing the shape to form a complete lip shape
        mouthShape.closePath();
    
        return {mouthShape, criticalPoints};
    }
    
    
    findLipVertices(geometry, criticalPoints) {
        const positionAttribute = geometry.getAttribute('position');
        const upperLipVertices = [];
        const lowerLipVertices = [];
    
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const y = positionAttribute.getY(i);
    
            // Dynamically identify vertices based on critical points
            if (isWithinLipRegion(x, y, criticalPoints.upperLip)) {
                upperLipVertices.push(i);
            } 
            else if (isWithinLipRegion(x, y, criticalPoints.lowerLip)) {
                lowerLipVertices.push(i);
            }
        }
        
        function isWithinLipRegion(x, y, lipRegion) {
            let intersects = 0;
        
            for (let i = 0, j = lipRegion.length - 1; i < lipRegion.length; j = i++) {
                const xi = lipRegion[i].x, yi = lipRegion[i].y;
                const xj = lipRegion[j].x, yj = lipRegion[j].y;
        
                const intersect = ((yi > y) !== (yj > y)) &&
                    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                
                if (intersect) intersects++;
            }
        
            return intersects % 2 !== 0;
        }

        
        return { upperLipVertices, lowerLipVertices };
    }
    

    /*
    
        this.currentTime = Date.now() - this.startTime;
        
        
        const time = this.currentTime
        if(this.currentTime < 36000) {
            this.currentTime = 0;
        }
    */
        updateMouth(mouth) {
            if (!mouth) mouth = this.mouth;
            
          
            if (!this.targetShape || this.t >= 1) {
                // Reset t
                this.t = 0;
                
                // Store the current positions of all vertices before selecting a new target shape
                this.currentPositions = Array.from(this.positions);
            
                // Store the old target shape
                this.oldTargetShape = this.targetShape;
                
                // Select a new random target shape
                let shapes = Object.keys(this.morphShapes);
                
                // Remove the current target shape from the list of possible shapes
                shapes = shapes.filter(shape => shape !== this.targetShape);
            
                // Select a new target shape from the remaining possible shapes
                this.targetShape = shapes[Math.floor(Math.random() * shapes.length)];
                console.log("New mouth:", this.targetShape);
            }
       
            
            
            
            
            // Increment t by a small amount to progress the morphing
            this.t += 0.01;
        
            // Apply the offsets to each vertex
            const positions = this.positions;
            
            ['upperLip', 'lowerLip'].forEach((lip, lipIndex) => {
                const originalPoints = lipIndex === 0 ? this.originalUpperLipPoints : this.originalLowerLipPoints;
                const vertices = lipIndex === 0 ? this.lipVerticies.upperLipVertices : this.lipVerticies.lowerLipVertices;
                const targetVertices = lipIndex === 0 ? this.morphShapes[this.targetShape].lipVerticies.upperLipVertices : this.morphShapes[this.targetShape].lipVerticies.lowerLipVertices;
            
                vertices.forEach((vertexIndex, i) => {
                    // Find the closest vertex in the target shape
                    let minDist = Infinity;
                    let closestVertexIndex = -1;
                    for (let j = 0; j < targetVertices.length; j++) {
                        const dx = this.morphShapes[this.targetShape].position.getX(targetVertices[j]) - this.positionAttribute.getX(vertexIndex);
                        const dy = this.morphShapes[this.targetShape].position.getY(targetVertices[j]) - this.positionAttribute.getY(vertexIndex);
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        if (dist < minDist) {
                            minDist = dist;
                            closestVertexIndex = j;
                        }
                    }
            
                    // Get the current position of the vertex
                    const currentX = this.currentPositions[vertexIndex * 3];
                    const currentY = this.currentPositions[vertexIndex * 3 + 1];
                    
                    // Get the target position of the closest vertex in the new target shape
                    const targetX = this.morphShapes[this.targetShape].position.getX(targetVertices[closestVertexIndex]);
                    const targetY = this.morphShapes[this.targetShape].position.getY(targetVertices[closestVertexIndex]);
                    
                    // Interpolate between the current and target positions based on this.t
                    const finalOffsetX = currentX + this.t * (targetX - currentX);
                    const finalOffsetY = currentY + this.t * (targetY - currentY);

                    positions[vertexIndex * 3] = finalOffsetX;
                    positions[vertexIndex * 3 + 1] = finalOffsetY;
                });
            });
        
            // Set the updated positions as a new BufferAttribute for your geometry
            mouth.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.positionAttribute.needsUpdate = true;

            
            // Update the mouth outline geometry with the new positions
            this.mouthOutline.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
            this.mouthOutline.geometry.attributes.position.needsUpdate = true;
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