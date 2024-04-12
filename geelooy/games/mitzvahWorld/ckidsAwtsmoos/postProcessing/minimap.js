//B"H

import * as THREE from '/games/scripts/build/three.module.js';
import  Heeooleey  from '../chayim/heeooleey.js';
const arrayToObject = ([x, y, z]) => ({ x, y, z });
export default class MinimapPostprocessing extends Heeooleey {
    renderer;
    rTexture;

    itemSize = 25/*pixels*/
    itemGroups = {
        /**
         * items displayed have different cateogries
         * to be stored by
         */
    }

    needsPositionUpdate = null
    prevCamPos = new THREE.Vector2();
    maxRendererSize = 2345
    constructor({renderer, scene, camera, olam}) {
        super();
        this.olam = olam
        this.renderer = renderer;
        this.scene = scene;

        this.size = new THREE.Vector2(300, 300);
        this.captured = false;
        this.on("update minimap camera", async ({position, rotation, targetPosition}) => {
            
          //  this.render()
            if (!this.minimapCamera) {
                this.render();
               
            }

            if (!this.minimapCamera) {
           
                return;
            }


            this.playerPosition = position;
            if (position) {
                if(position.equals(this.prevCamPos)) {
                    return;
                }
                
                this.needsPositionUpdate = {
                    position,
                    targetPosition
                };
                this.prevCamPos = position;
                
            }
           
            

            if(rotation) {
             //   this.minimapCamera.rotation.copy(rotation)
            }

            if(!this.captured) {
                await this.captureScene();
                this.captured = true;
            }

            if(this.captured) {
                if(this.minimapCamera) {
                    await this.updateScroll()
                }
                return false;
            }

            

            
        });

    }
    async updateScroll() {
        if(!this.playerPosition) return;
        if(!this.minimapCamera) return;
        await this.olam.ayshPeula("update minimap scroll", {
            center: this.playerPosition,
            minimapCamera: this.serializeOrthographicCamera(
                this.minimapCamera
            ),
            sceneBoundingBox: this.sceneBoundingBox
        });
    }

    sceneBoundingBox = null;
    serializeOrthographicCamera(camera) {
        var serializedCamera = {};
    
        // Extract camera position
        serializedCamera.position = arrayToObject(camera.position.toArray())
            
    
        // Extract camera rotation (Euler angles)
        var euler = new THREE.Euler().setFromQuaternion(camera.quaternion);
        serializedCamera.rotation = arrayToObject(euler.toArray());
    
        // Extract orthographic camera properties
        serializedCamera.left = camera.left;
        serializedCamera.right = camera.right;
        serializedCamera.top = camera.top;
        serializedCamera.bottom = camera.bottom;
        serializedCamera.near = camera.near;
        serializedCamera.far = camera.far;
    
        return serializedCamera;
    }

    async captureScene() {
        var zoomAmount = this.zoom;
        var playerPosition = this.playerPosition;
        if(!playerPosition) return console.log("NO player position")
        // Reset camera position to player position
        this.minimapCamera.position.copy(playerPosition);
        console.log("TRYING to capture scene");
    
        
        if(!this.sceneBoundingBox) {
            // Calculate the bounding box of the entire scene
            var sceneBoundingBox = new THREE.Box3().setFromObject(this.scene);
        
            // Calculate the size of the bounding box
            var sceneSize = new THREE.Vector3();
            sceneBoundingBox.getSize(sceneSize);
            this.sceneBoundingBox = sceneBoundingBox
            this.sceneSize = sceneSize;

            var sceneCenter = new THREE.Vector3();
            sceneBoundingBox.getCenter(sceneCenter);
            this.sceneCenter = sceneCenter;
        }
        
        // Calculate the diagonal length of the bounding box
    
    
       // console.log("scene", diagonalLength, sceneSize, sceneBoundingBox);
    
        var maxRendererSize = this.maxRendererSize;
    
        // Calculate the desired renderer size based on the diagonal length
        var desiredRendererSize = new THREE.Vector2();
    
        // Calculate the aspect ratio of the scene
        var aspectRatio = this.sceneSize.x / this.sceneSize.y;
    
        if (aspectRatio >= 1) {
            // Landscape orientation or square scene
            desiredRendererSize.x = maxRendererSize;
            desiredRendererSize.y = maxRendererSize / aspectRatio;
        } else {
            // Portrait orientation
            desiredRendererSize.y = maxRendererSize;
            desiredRendererSize.x = maxRendererSize * aspectRatio;
        }
    
        //console.log("Size?", desiredRendererSize, sceneBoundingBox, sceneSize);
    
        // Resize the renderer to the desired size
        this.renderer.setSize(desiredRendererSize.x, desiredRendererSize.y, false);
        this.renderer.getSize(this.size);
        this.olam.htmlAction({
            shaym: "raw map",
            properties: {
                style: {
                    width: desiredRendererSize.x+"px",
                    height: desiredRendererSize.y+"px",
                }
            }
        })
        // Calculate the center of the bounding box
       
        
        
        
        // Calculate the distance from the camera to fully encompass the scene
        // Choose the maximum of width, height, and depth of the bounding box
        var maxSceneDimension = Math.max(
            this.sceneSize.x, 
            this.sceneSize.y, 
            this.sceneSize.z
        );
    
        // Adjust the camera position to capture the entire scene
       // this.minimapCamera.position.copy(sceneCenter);
      
    
        // Calculate zoom factor based on zoomAmount
        var zoomFactor = Math.pow(2, zoomAmount); // 2^(zoomAmount)
    
        // Adjust camera position based on zoom factor
        this.minimapCamera.position.y += maxSceneDimension / zoomFactor;
        this.minimapCamera.far = this.minimapCamera.position.y * 2
        // Calculate the size of the orthographic view frustum
        var halfHeight = maxSceneDimension / zoomFactor;
        var halfWidth = halfHeight * aspectRatio;
    
        // Update the camera's frustum boundaries
        this.minimapCamera.left = -halfWidth;
        this.minimapCamera.right = halfWidth;
        this.minimapCamera.top = halfHeight;
        this.minimapCamera.bottom = -halfHeight;
    
        // Update the camera's aspect ratio and projection matrix
        this.minimapCamera.aspect = aspectRatio;
        this.minimapCamera.updateProjectionMatrix();
    
        /*
            // Apply offset to camera position
            this.minimapCamera.position.x += offset.x;
            this.minimapCamera.position.z += offset.z;
        */
        // Render the scene
       // console.log("About to render", this.minimapCamera);
        var oldFog = this.scene.fog;
        this.scene.fog = null;

        this.playerPosition = this?.olam?.chossid?.mesh?.position ||
            this.playerPosition;
           
        

        await this.updateScroll();
        console.log("rendered new") 
        this.render();
        /*
        this.renderer.render(
            this.scene,
            this.minimapCamera
        );*/
        
        this.scene.fog = oldFog;
        //console.log("Scrolled")
    }

    resize() {
        // Get the new size of the renderer
        var newSize = new THREE.Vector2();
        this.renderer.getSize(newSize);
    /*
        // Update the aspect ratio
        var aspectRatio = newSize.x / newSize.y;
    
        // Update the frustum size if needed (optional)
        // var frustumSize = this.defaultFrustumSize;
    
        // Adjust the camera's parameters
        this.minimapCamera.left = -halfFrustumSize * aspectRatio;
        this.minimapCamera.right = halfFrustumSize * aspectRatio;
        this.minimapCamera.top = halfFrustumSize;
        this.minimapCamera.bottom = -halfFrustumSize;
    
        // Update the camera's aspect ratio
        this.minimapCamera.aspect = aspectRatio;
    
        // Update the camera's projection matrix
        this.minimapCamera.updateProjectionMatrix();
    
        // Optionally, you might want to update other elements in your scene here
        // For example, updating the aspect ratio of any render targets or effects
    
        // Store the new size for future reference (optional)
        */
        this.size.copy(newSize);
    }

    shaderMap = {
        cameraPosition: "cameraPos"
    }
    async updateItemPositions(category) {
       
        if(typeof(category) != "string") {
            var k = Object.keys(this.itemGroups)
            
            for(var m of k) {
                await this.updateItemPositions(m)
            }
            return;
        }
        var items = this.itemGroups[category]

        if(!items) return;
        if(!Array.isArray(items)) {
            return;
        }
 
       
        try {
           
            var actions = [];
            for(var i = 0; i < items.length; i++) {
                (i => {
                 
                    var pos = items[i].mesh.position;
                    var w = this.worldToMinimap(pos.x, pos.z);
                    if(!w) return;
                    var item = ({
                        shaym: "item "+ items[i].shaym,
                        properties: {
                            style: {
                                top: w.y+"px",
                                left: w.x+"px"/*,
                                transform: `translateX(${
                                    w.x
                                }px) translateY(${
                                    w.z
                                }px)`*/
                            }
                        }
                    })
                    actions.push(item);
                })(i);
                //worldToMinimap
                //await this.olam.htmlAction
            }

            await this.olam.ayshPeula("htmlActions", actions)

        } catch(e){
            console.log(e)
        }
    }

    async setMinimapItem(item, category) {
        var c = this.itemGroups[category]
        if(Array.isArray(c)) {
            if(!c.includes(item)) {
                c.push(item)
            }
        }
        if(typeof(item.clear) == "function") {
            item.clear("change icon data");
            item.clear("change icon style");
            item.clear("delete icon")
            item.clear("add again")
        }
        var pos = item.mesh.position;

        console.log("TRYING to set",w,item,this, this.size)
        var w = this.worldToMinimap(pos.x, pos.z);
        var iconData = await item.getIcon()//this.olam.getIconFromType(item.constructor.name);
 
        var iconHTML = await this.olam.ayshPeula("htmlCreate", {
            parent: "map overlays " + category,
            className: "overlayItem",
            shaym: "item "+item.shaym,
            
            style: {
                left: w.x + "px",
                top: w.y + "px"
                //transform: `translateX(0px) translateY(0px)`
            },
            
            innerHTML: iconData
        });

        if(typeof(item.on) == "function"){
            item.on("add again", async () => {
                console.log("ADDING again", item)
                await this.setMinimapItem(item, category)
            })
            item.on("delete icon", async () => {
         
                return await this.removeMinimapItem(item, category);
            });

         //   console.log("SETTING",item)
            item.on("change icon style", async(data) => {
          
                var s = "item "+item.shaym;
                var actions = [];
                if(data && typeof(data) == "object") {
                    data.shaym = s;
                    actions.push(data)
                }
                var g = await this.olam.htmlActions(actions);
            //    console.log("TRYINg to set it",data,item)
                return g;
            })
            item.on("change icon data", async (data) => {
     
                var iconData = await item.getIcon();
                var s = "item "+item.shaym;
                var actions = [
                    {
                        shaym: s,
                        properties: {
                            innerHTML: iconData
                        }
                    }
                ]
                if(data && typeof(data) == "object") {
                    data.shaym = s;
                    actions.push(data)
                }
                var g = await this.olam.htmlActions(actions);
                return g;
            });
        }


      //  console.log("Added",item, w,pos,iconHTML)
    }

    async removeMinimapItem(item, category) {
        if(!item || typeof(item) != "object")
            return console.log("no item",item);
        var itemShaym = item.shaym;
        if(typeof(itemShaym) != "string")
            return console.log("no shaym",item);

        var items = this.itemGroups[category]
        if(!Array.isArray(items)) {
            return console.log("No items",category,items);
        }
        var found = items.find(w => w.shaym == itemShaym)
        var indexOf = items.indexOf(found)
     
        if(indexOf > -1) {
            this.itemGroups[category].splice(indexOf, 1);
            try {
                await this.olam.ayshPeula("htmlDelete", {
                    shaym: "item "+itemShaym
                })
            } catch(e){
                console.log(e)
            }
        } else {
            console.log("Didn't do it!",this.items,indexOf,found,item,itemShaym)
        }
        
    }

    async deleteMinimapItems(category) {

        if(typeof(category) != "string") {
            return;
        }
        
        var items = this.itemGroups[category];
        if(!Array.isArray(items)) {
            return;
        }
        var copy = Array.from(items)
        for(var i = 0; i < copy.length; i++) {
            await this.removeMinimapItem(copy[i], category)
        }
        await this.olam.ayshPeula("htmlDelete", ({
                shaym: "map overlays " + category
        }));
        delete this.itemGroups[category];
        
    }

    
    async setMinimapItems(items, category) {
        if(!this.capture) {
            this.captureScene();
        }
        if(typeof(category) != "string") {
            return;
        }
        if(!Array.isArray(items)) {
            if(items === undefined || items === null) {
                return await this.deleteMinimapItems(category);
            }
            return;
        }
        if(!this.itemGroups[category]) {
            this.itemGroups[category] = []
            /**
             * add new group
             */
            var mapOverlays = await this.olam.ayshPeula("htmlCreate", ({
                parent: "raw map",
                shaym: "map overlays " + category,
                className:"overlaysOfMap"

            }));
        }
      
        
        var items = Array.from(items)
        var existing = Array.from(this.itemGroups[category]);
        this.itemGroups[category] = items
       

        try {
            
      
            for(var ex of existing) {
                
                var ac = await this.olam.htmlAction({
                    shaym: "item "+ex.shaym,
                    methods: {
                        remove: []
                    }
                });
                await this.removeMinimapItem(ex, category)
            }
            var ac = await this.olam.htmlAction({
                shaym: "map overlays " + category,
                properties: {
                    innerHTML: ""
                }
            });
           /* */
            for(var i = 0; i < items.length; i++) {
                await this.setMinimapItem(items[i], category)
                
            }

        } catch(e){
            console.log(e)
        }
        this.updateItemPositions(category)
    }

    
    minimapCamera = null
    defaultFrustumSize = 100
    lookedAt = false;


    async render() {

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
            this.size.clone(size);
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
  
            this.minimapCamera.layers.set(2/*only draw the map itself*/);
            // Set the camera position to view the scene from above (adjust as needed)
            this.minimapCamera.position.set(0, 50, 0);
            this.minimapCamera.lookAt(this.scene.position);
        
            this.minimapCamera.updateProjectionMatrix();
        
            ppc = this.minimapCamera;
            this.scene.add(ppc);
            this.zoom = this.zoom;
        }

        if(this.needsPositionUpdate) {
            var {
                position,
                targetPosition
             } = this.needsPositionUpdate
            this.minimapCamera.position.x = position.x
            this.minimapCamera.position.z = position.z
            if (targetPosition) {
             //   this.minimapCamera.lookAt(targetPosition);
            }
            this.minimapCamera.updateMatrixWorld();
    
           // var dir = new THREE.Vector3();
           // this.minimapCamera.getWorldDirection(dir);
            
            await this.updateItemPositions()
            this.prevCamPos.copy(position)
            this.needsPositionUpdate = null;
        }
        
    
     
        
        this.renderer.render(
            this.scene,
            ppc
        )
       
    }

    _zoom = 6;
    get zoom() {
        return this._zoom;
    }
    set zoom(zoomLevel) {
        if(zoomLevel < 1) return;
        this._zoom = zoomLevel;

        const camera = this.minimapCamera;
        if(!camera) return;
        this.captureScene();
      //  this.updateScroll();
    }
    
    clampToMinimapEdges({
        minimapX,
        minimapZ,
        minimapWidth,
        minimapHeight
    }) {
        // Define the edges of the minimap
        let minX = 0;
        let maxX = minimapWidth - this.itemSize;
        let minZ = 0;
        let maxZ = minimapHeight - this.itemSize;
    
        // Clamp the X coordinate
        if (minimapX < minX) minimapX = minX;
        else if (minimapX > maxX) minimapX = maxX;
    
        // Clamp the Z coordinate
        if (minimapZ < minZ) minimapZ = minZ;
        else if (minimapZ > maxZ) minimapZ = maxZ;
    
        return {x: minimapX, z: minimapZ};
    }

    worldToMinimap(worldX, worldZ) {
        // Assuming you have these variables already
        let cameraPosition = this.minimapCamera?.position;
        if (!cameraPosition) return;
    
        let { x, y /*for minimap canvas*/ } = this.size; // Your minimap canvas dimensions
        var width = x;
        var height = y;
        let cameraFrustumHeight = this.sceneSize.y / (Math.pow(2, this.zoom)); // Adjusted for zoom
    
        // Step 1: Calculate Scale Factor
        let scaleFactor = Math.min(width, height) / cameraFrustumHeight;
    
        // Step 2: Normalize World Coordinates
        let normalizedX = worldX - cameraPosition.x;
        let normalizedZ = worldZ - cameraPosition.z;
    
        // Step 3: Scale to Minimap
        let minimapX = normalizedX * scaleFactor;
        let minimapZ = normalizedZ * scaleFactor;
    
        // Step 4: Adjust for Minimap Canvas Size
        let canvasX = (width / 2) + minimapX - this.itemSize / 2;
        let canvasZ = (height / 2) + minimapZ - this.itemSize / 2; // Inverting Z if necessary, depends on your coordinate system
    
        return {
            x: canvasX,
            y: canvasZ, // Adjusted for Z
            z: canvasZ // Adjusted for Z
        };
    }


    /*
        var clamped = this.clampToMinimapEdges({
            minimapHeight: height,
            minimapWidth: width,
            minimapX: ob.x,
            minimapZ: ob.z
        })
        */


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
