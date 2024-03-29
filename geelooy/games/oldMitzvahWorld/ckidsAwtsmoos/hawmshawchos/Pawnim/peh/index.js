/*

B"H

"Peh" means mouth in Hebrew
*/

/**
 * @class Peh
 * @argument nivra an AWTSMOOS.Nivra instance,
 * contains .mesh property which is THREE.Mesh
 */

import * as THREE from '/games/scripts/build/three.module.js';

import MouthShape from "./MouthShape.js";
export default class Peh {
    constructor(nivra) {
        this.nivra = nivra;
        
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
        var scale = 3;
        var {criticalPoints, mouthShape} = this.createMouthShape(scale)


        // Step 1: Pre-create all the mouth shapes
        var baseShape = this.createMouthShape(scale).mouthShape; // Create your base shape
        
        var geometry = new THREE.ShapeGeometry( baseShape);
        
        var morphShapes = {
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
        for (var [key, morphShape] of Object.entries(this.morphShapes)) {
            
            var morphedGeo = new THREE.ShapeGeometry(morphShape.mouthShape);
            var positionMorphed = morphedGeo.getAttribute("position");

            morphShape.geometry = morphedGeo;
            morphShape.position = positionMorphed;
            morphShape.lipVerticies = this.findLipVertices(
                morphedGeo, morphShape.criticalPoints
            );
        }

        
        var mouth = new THREE.Mesh(
            this.morphShapes.X.geometry, new THREE.MeshLambertMaterial({
                color: "red"
            })
        );

        referencePlane.add(mouth);


        
        this.lipVerticies = this.findLipVertices(geometry, criticalPoints);
        this.positionAttribute = mouth.geometry.getAttribute('position');


        /*
            Now add mouth mesh
            to the reference plane.

            First must make it a child so it 
            inherits its properties etc. then
            we scale it down and remove it 
            but attach it (in the same position it was)
            to the parent of the referencePlane to fix
            issues of scaling too high.

        */


            
	    var regScale = referencePlane.scale.clone();
        
        mouth.scale.set(1 / regScale.x, 1 / regScale.y, 1 / regScale.z);

        referencePlane.parent.attach(mouth);

        
        this.mouth = mouth;
		referencePlane.visible = false
        this.referencePlane = referencePlane;

        
        // Store the original y-coordinate of the vertices to use as a base value
        this.positions = Float32Array.from(this.positionAttribute.array);

        
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
        
        
    }


    findLipVertices(geometry, criticalPoints) {
        
        var positionAttribute = geometry.getAttribute('position');
        var upperLipVertices = [];
        var lowerLipVertices = [];
    
        for (let i = 0; i < positionAttribute.count; i++) {
            var x = positionAttribute.getX(i);
            var y = positionAttribute.getY(i);
    
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
                var xi = lipRegion[i].x, yi = lipRegion[i].y;
                var xj = lipRegion[j].x, yj = lipRegion[j].y;
        
                var intersect = ((yi > y) !== (yj > y)) &&
                    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        
                if (intersect) intersects++;
            }
        
            return intersects % 2 !== 0;
        }
        

        
        return { upperLipVertices, lowerLipVertices };
    }


    createMouthShape(scaleFactor = 1, shapeName) {
        this.mouthShape = new MouthShape(scaleFactor, shapeName);
        return this.mouthShape;
    }

}
