//B"H

import * as THREE from '/games/scripts/build/three.module.js';
import  Heeooleey  from '../chayim/heeooleey.js';

export default class MinimapPostprocessing extends Heeooleey {
    renderer;
    rTexture;
    constructor({renderer, scene, camera, olam}) {
        super();
        this.olam = olam
        this.renderer = renderer;
        this.scene = scene;

        this.size = new THREE.Vector3();
        this.on("update minimap camera", ({position, rotation, targetPosition}) => {
            if (!this.minimapCamera) {
                return;
            }
        
            if (position) {
                this.minimapCamera.position.x = position.x
                this.minimapCamera.position.z = position.z
                if (targetPosition) {
                    this.minimapCamera.lookAt(targetPosition);
                }
                this.minimapCamera.updateMatrixWorld();
        
                var dir = new THREE.Vector3();
                this.minimapCamera.getWorldDirection(dir);
                
            }

            if(rotation) {
             //   this.minimapCamera.rotation.copy(rotation)
            }

            
        });

    }

    resize() {

        this.renderer.getSize(this.size)
    }

    shaderMap = {
        cameraPosition: "cameraPos"
    }
    async updateItemPositions() {
        if(!Array.isArray(this.items)) {
            return;
        }
        var items = this.items;
        return
        try {
            /*var ac = this.olam.htmlAction({
                shaym: "map overlays",
                properties: {
                    innerHTML: ""
                }
            });*/
            for(var i = 0; i < items.length; i++) {
                (i => {
                 
                   // var pos = items[i].position;
                  //  var w = this.worldToMinimap(pos.x, pos.z);
                    var item = this.olam.ayshPeula("htmlCreate", {
                        parent: "map overlays",
                        className: "overlayItem",
                        style: {
                           /* left: w.x +"px",
                            top: w.z + "px"*/
                        },
                        innerHTML: items[i].type
                    })
                    console.log("Added",item)
                })(i);//worldToMinimap
                
            }

        } catch(e){
            console.log(e)
        }
    }
    async setMinimapItems(items) {
        if(!Array.isArray(items)) {
            return;
        }
        this.items = items;
        

        this.updateItemPositions()
    }

    
    minimapCamera = null
    defaultFrustumSize = 100
    
    render() {
        if(!this.renderer) {
            return;
        }
        if(!this.scene) {
            return;
        }
        var ppc = this.minimapCamera;
        if (!this.minimapCamera) {
            var size = new THREE.Vector2();
            this.renderer.getSize(size);
            var aspectRatio = size.x / size.y;
        
            // Define the frustum size. You may need to adjust these values to fit your scene.
            var frustumSize = this.defaultFrustumSize; // Adjust this value based on the size of your scene
            var halfFrustumSize = frustumSize * 0.5;
        
            this.minimapCamera = new THREE.OrthographicCamera(
                -halfFrustumSize * aspectRatio, // left
                halfFrustumSize * aspectRatio,  // right
                halfFrustumSize,                // top
                -halfFrustumSize,               // bottom
                1,                              // near
                1000                            // far
            );
        
            // Set the camera position to view the scene from above (adjust as needed)
            this.minimapCamera.position.set(0, 5, 0);
            this.minimapCamera.lookAt(this.scene.position);
        
            this.minimapCamera.updateProjectionMatrix();
        
            ppc = this.minimapCamera;
            this.scene.add(ppc);
            this.zoom = this.zoom;
        }
        
    
     
       
        this.renderer.render(
            this.scene,
            ppc
        )
    }

    _zoom = 4;
    get zoom() {
        return this._zoom;
    }
    set zoom(zoomLevel) {
        this._zoom = zoomLevel;
        const camera = this.minimapCamera;
        if(!camera) return;
        const aspectRatio = camera.right / camera.top;
        const frustumHeight = this.defaultFrustumSize / zoomLevel; // 100 is a base size, adjust as needed
    
        camera.top = frustumHeight / 2;
        camera.bottom = -frustumHeight / 2;
        camera.left = -frustumHeight / 2 * aspectRatio;
        camera.right = frustumHeight / 2 * aspectRatio;
    
        camera.updateProjectionMatrix();
        this.updateItemPositions()
    }
    
    worldToMinimap(worldX, worldZ) {
        // Assuming you have these variables already
       
        let cameraPosition = this.minimapCamera?.position;
        if(!cameraPosition) return;
        let {
            width, height /*for minimap canvas*/
        } = this.size; // Your minimap canvas dimensions
        
        let cameraFrustumHeight = this.defaultFrustumSize / this._zoom;

        // Step 1: Calculate Scale Factor
        let scaleFactor = Math.min(width, height) / cameraFrustumHeight;

        // Step 2: Normalize World Coordinates
        let normalizedX = worldX - cameraPosition.x;
        let normalizedZ = worldZ - cameraPosition.z;
    
        // Step 3: Scale to Minimap
        let minimapX = normalizedX * scaleFactor;
        let minimapZ = normalizedZ * scaleFactor;
    
        // Step 4: Adjust for Minimap Canvas Size
        let canvasX = (minimapWidth / 2) + minimapX;
        let canvasZ = (minimapHeight / 2) - minimapZ; // Inverting Z if necessary, depends on your coordinate system
    
        return {x: canvasX, z: canvasZ};
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
