//B"H

import * as THREE from '/games/scripts/build/three.module.js';
import  Heeooleey  from '../chayim/heeooleey.js';
import { EffectComposer } from '/games/scripts/jsm/postprocessing/EffectComposer.js';

import {RenderPass} from '/games/scripts/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '/games/scripts/jsm/postprocessing/ShaderPass.js';

export default class MinimapPostprocessing extends Heeooleey {
    renderer;
    rTexture;
    constructor({renderer, scene, camera}) {
        super();
        this.renderer = renderer;
        this.scene = scene;
        this.on("update minimap camera", ({position, rotation, targetPosition}) => {
            if(!this.minimapCamera) {
                return;
            }

     

            if(position) {

                this.minimapCamera.position.copy(position)
                if(targetPosition)
                    this.minimapCamera.lookAt(targetPosition);
                this.minimapCamera.updateMatrixWorld();
                var dir = new THREE.Vector3();
                this.minimapCamera.getWorldDirection(dir);
                this.updateShader({
                    cameraPosition: this.minimapCamera.position,
                    cameraDirection: dir
                })
            }

            if(rotation) {
                this.minimapCamera.rotation.copy(rotation)
            }

            
        })
    }

    resize(width, height) {

    }

    shaderMap = {
        cameraPosition: "cameraPos"
    }
    updateShader(obj={}) {

        if(!this.shaderPass) {
            return;
        }
        if(typeof(obj) != "object") {
            obj = {};
        }
        var keys = Object.keys(obj)
        var k;
        for(k of keys) {
            
            if(!this.shaderPass.uniforms[k]) continue;
            if(!obj[k]) return;
            var maptK = this.shaderMap[k]
            this.shaderPass.uniforms[maptK||k].value = obj[k]
        }
        
        obj.minimapRadius ?
        this.shaderPass.uniforms
        .minimapRadius.value=obj.minimapRadius:null;

        obj.cameraAspect ?
        this.shaderPass.uniforms
        .cameraAspect.value=obj.cameraAspect:null;

        obj.cameraFOV ?
            this.shaderPass.uniforms
            .cameraFOV.value=obj.cameraFOV:null;

        obj.cameraPosition ?
            this.shaderPass.uniforms
            .cameraPos.value=obj.cameraPosition:null;

        obj.cameraDirection ?
            this.shaderPass.uniforms
            .cameraDirection.value=obj.cameraDirection:null;
    }
    
    minimapCamera = null
    render() {
        if(!this.renderer) {
            return;
        }
        if(!this.scene) {
            return;
        }
        var ppc = this.minimapCamera;
        if(!this.minimapCamera) {
            var size = new THREE.Vector2();
            this.renderer.getSize(size)
            var {
                x, y
            } = size;

            this.minimapCamera = 
           
            new THREE.PerspectiveCamera(
                70, x / y, 0.1, 1000
            );
            
            ppc = this.minimapCamera
            this.scene.add(ppc)
            this.minimapCamera.updateProjectionMatrix();

            

        }
        
    
     
       
        this.renderer.render(
            this.scene,
            ppc
        )
    }

   

    /**
     * Normalizes the player's world coordinates to minimap coordinates.
     * @param {THREE.Vector3} worldPos - The object's position in world coordinates.
     * @param {THREE.PerspectiveCamera} minimapCamera - The camera used for the minimap.
     * @param {THREE.WebGLRenderer} renderer - The renderer for the minimap.
     * @returns {THREE.Vector2 | null} The normalized position for the minimap or null if the object is out of view.
     */
    getNormalizedMinimapCoords(worldPos, minimapCamera, renderer) {
        var { x, y, z } = worldPos;
        if(!minimapCamera) {
            minimapCamera = this.minimapCamera;
        }
    
        if(!renderer) {
            renderer = this.renderer;
        }
        if (typeof (x) != "number" || typeof (y) != "number" || typeof (z) != "number")
            return null;

        if (!minimapCamera || !renderer) {
            console.log("not initted yet");
            return null;
        }

        // Update the camera's matrix world
        minimapCamera.updateMatrixWorld();
        var relativePosition = new THREE.Vector3().subVectors(worldPos, minimapCamera.position);

        // Calculate the depth along the camera's viewing direction
        var cameraDirection = new THREE.Vector3();
        minimapCamera.getWorldDirection(cameraDirection);
        var depth = relativePosition.dot(cameraDirection);
        // Adjust for the camera's FOV and aspect ratio
        var fovFactor = Math.tan(THREE.MathUtils.degToRad(minimapCamera.fov) / 2);
        var aspectFactor = minimapCamera.aspect;
        var adjustedX = (relativePosition.x / depth) / (fovFactor * aspectFactor);
        var adjustedZ = -(relativePosition.z / depth) / (fovFactor * aspectFactor);


        // Normalize the coordinates for the minimap
        // Assuming the minimap has dimensions normalized between -1 and 1
      //  var normalizedX = THREE.MathUtils.clamp(adjustedX, -1, 1);
       // var normalizedZ = THREE.MathUtils.clamp(adjustedZ, -1, 1);

        return new THREE.Vector2(adjustedX, adjustedZ);
    }

    

    calculateEdgeIntersection(ndcPos) {
        // Assuming ndcPos is in the range [-1, 1]
        // Calculate the intersection point on the edge of the NDC box
        var direction = { x: ndcPos.x, y: ndcPos.z }; // Direction vector from center to the object
        let edgeX, edgeY;
    
        // Calculate the slope and aspect ratio
        var slope = direction.y / direction.x;
        var aspectRatio = 1; // Adjust this based on your minimap's aspect ratio
    
        if (Math.abs(slope) <= aspectRatio) {
            // Intersects with left or right edge
            edgeX = Math.sign(direction.x);
            edgeY = slope * edgeX;
        } else {
            // Intersects with top or bottom edge
            edgeY = Math.sign(direction.y);
            edgeX = edgeY / slope;
        }
    
        return { x: edgeX, y: edgeY };
    }

    _drawn = []

    getVisibleDimensions(camera, rendererWidth, rendererHeight) {
        // Calculate the aspect ratio
        var aspect = rendererWidth / rendererHeight;
    
        // Calculate the height of the near plane
        var nearHeight = 2 * Math.tan(THREE.Math.degToRad(camera.fov) / 2) * camera.near;
        var nearWidth = nearHeight * aspect;
    
        // Corners of the near plane in camera space
        var corners = [
            new THREE.Vector3(-nearWidth / 2, nearHeight / 2, -camera.near), // top-left
            new THREE.Vector3(nearWidth / 2, nearHeight / 2, -camera.near),  // top-right
            new THREE.Vector3(nearWidth / 2, -nearHeight / 2, -camera.near), // bottom-right
            new THREE.Vector3(-nearWidth / 2, -nearHeight / 2, -camera.near) // bottom-left
        ];
    
        // Transform corners to world space
        var worldCorners = corners.map(corner => corner.applyMatrix4(camera.matrixWorld));
    
        // Determine bounds
        var bounds = new THREE.Box3().setFromPoints(worldCorners);
        return {
            minX: bounds.min.x,
            maxX: bounds.max.x,
            minY: bounds.min.y,
            maxY: bounds.max.y,
            minZ: bounds.min.z,
            maxZ: bounds.max.z
        };
    }


    

}
