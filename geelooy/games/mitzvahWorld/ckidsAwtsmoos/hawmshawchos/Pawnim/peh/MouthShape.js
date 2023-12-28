/*
B"H
*/
import mouthShapes from "./mouthShapes.js";
export default class MouthShape {
    mouthShapes = mouthShapes

    constructor(scaleFactor = 1, shapeName) {
      this.scaleFactor = scaleFactor;
      this.offsets = mouthShapes[shapeName] || null;
      
      this.mouthShape = this.createShape(scaleFactor, offsets);
    }
  
    createShape(scaleFactor = 1, offsets = null) {
      var mouthShape = new THREE.Shape();
        
        // Record critical points that will define the lip regions
        var criticalPoints = {
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
    
        // Apply offsets if provided
        if (offsets) {
            for (let i = 0; i < 4; i++) {
                criticalPoints.upperLip[i].x += offsets.upperLip[i][0] * scaleFactor;
                criticalPoints.upperLip[i].y += offsets.upperLip[i][1] * scaleFactor;
    
                criticalPoints.lowerLip[i].x += offsets.lowerLip[i][0] * scaleFactor;
                criticalPoints.lowerLip[i].y += offsets.lowerLip[i][1] * scaleFactor;
            }
        }
    
        // Starting point (left corner of the upper lip)
        mouthShape.moveTo(criticalPoints.upperLip[0].x, criticalPoints.upperLip[0].y);
    
        // Define the upper lip with a combination of Bezier and quadratic curves
        mouthShape.quadraticCurveTo(
            criticalPoints.upperLip[1].x, criticalPoints.upperLip[1].y,
            (criticalPoints.upperLip[1].x + criticalPoints.upperLip[2].x) / 2, (criticalPoints.upperLip[1].y + criticalPoints.upperLip[2].y) / 2
        );
    
        mouthShape.bezierCurveTo(
            (criticalPoints.upperLip[2].x + criticalPoints.upperLip[1].x) / 2, (criticalPoints.upperLip[2].y + criticalPoints.upperLip[1].y) / 2,
            criticalPoints.upperLip[2].x, criticalPoints.upperLip[2].y,
            criticalPoints.upperLip[3].x, criticalPoints.upperLip[3].y
        );
    
        // Break the line to create a smoother transition
        for (let t = 0.2; t <= 0.8; t += 0.2) {
            var x = (1 - t) * criticalPoints.upperLip[3].x + t * criticalPoints.lowerLip[0].x;
            var y = (1 - t) * criticalPoints.upperLip[3].y + t * criticalPoints.lowerLip[0].y;
            mouthShape.lineTo(x, y);
        }
    
        // Define the lower lip with a combination of Bezier and quadratic curves
        mouthShape.bezierCurveTo(
            criticalPoints.lowerLip[1].x, criticalPoints.lowerLip[1].y,
            (criticalPoints.lowerLip[2].x + criticalPoints.lowerLip[1].x) / 2, (criticalPoints.lowerLip[2].y + criticalPoints.lowerLip[1].y) / 2,
            criticalPoints.lowerLip[2].x, criticalPoints.lowerLip[2].y
        );
    
        mouthShape.quadraticCurveTo(
            criticalPoints.lowerLip[2].x, criticalPoints.lowerLip[2].y,
            criticalPoints.lowerLip[3].x, criticalPoints.lowerLip[3].y
        );
    
        // Closing the shape to form a complete lip shape
        mouthShape.closePath();
    
        return { mouthShape, criticalPoints };
    }
  }