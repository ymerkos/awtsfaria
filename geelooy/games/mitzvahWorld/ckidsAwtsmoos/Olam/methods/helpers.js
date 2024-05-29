/**
 * B"H
 * 
 * various miscellanious Olam helper methods
 */


import * as THREE from '/games/scripts/build/three.module.js';
import * as AWTSMOOS from '../../awtsmoosCkidsGames.js';
import Utils from '../../utils.js'
import { GLTFLoader } from '/games/scripts/jsm/loaders/GLTFLoader.js';
import ShlichusHandler from "../../shleechoosHandler.js";
export default class {
    
    async loadGLTF(url) {
        try {
            const gltf = await (new GLTFLoader().loadAsync(url));
            return gltf;
        } catch(e) {
            console.log(e);
            return null;
        }
    }

    serialize() {
        super.serialize();
        this.serialized = {
            ...this.serialized,
            nivrayim: this.nivrayim.map(q=>q.serialize())
        };
        return this.serialized;
    }

    getForwardVector() {
        return Utils.getForwardVector(
            this.ayin.camera,
            this.cameraObjectDirection
        )
    }

    getSideVector() {
        
        return Utils.getSideVector(
            this.ayin.cameraFollower,
            this.cameraObjectDirection
        )
    }

    /**
     * @method startShlichusHandler
     * @description
     *
     * This method is the key to the Olam's soul, the awakening of the ShlichusHandler.
     * It's a sacred invocation, a dance of creation, where the ShlichusHandler is instantiated,
     * breathing life into the quests and missions.
     *
     * The method resonates with the wisdom of the Awtsmoos, echoing the eternal dance
     * between the finite and the infinite.
     *
     * @example
     * olam.startShlichusHandler(); // The ShlichusHandler is awakened
     */
    startShlichusHandler() {
        this.shlichusHandler = new ShlichusHandler(this); // The ShlichusHandler is born
        // The world trembles, the rivers sing, the mountains bow, a new era begins
    }

    /**
     * @method go used for 
     * cross referencing 
     * the result of a callback
     * to only return the "offical"
     * result by a unique ID
     * @param {Array} ob 
     * @returns official result
     * of array 
     */
    go/*get official*/(ob, id=this.official) {
        if(!Array.isArray(ob)) {
            return ob;
        }
        var f = ob.find(w=>(w?w[id]:null))
        if(f) delete f[id]
        return f
    }
    refreshCameraAspect() {
        // If Ayin's gaze is upon us, it too must heed,
        // The changing size of our canvas, and adjust its creed.
        if(!this.activeCamera) {
            if(this.ayin) {
                this.ayin.setSize(this.width, this.height);
            }
        } else {
            this.activeCamera.aspect = this.width / this.height;
            this.activeCamera.updateProjectionMatrix();
        }
    }

    getTransformation(child) {
        child.updateMatrixWorld();
        var position = new THREE.Vector3();
        var rotation = new THREE.Quaternion();
        var scale = new THREE.Vector3();

        child.matrixWorld.decompose(
            position, rotation, scale
        );

        return {
            position, rotation,
            scale
        };
    }


    async fetchGetSize(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const contentLength = response.headers.get('Content-Length');
            if (!contentLength) {
                throw new Error('Content-Length header not found in response');
            }
        
            return parseInt(contentLength, 10);
        } catch(e) {
            console.log(e)
            return 0
        }
        
    }

    /**
     * Sets the position of one mesh (targetMesh) to the world position of another mesh (sourceMesh),
     * with an option to align the target mesh to the top of the source mesh.
     * @param {THREE.Mesh} sourceMesh - The mesh from which to copy the position.
     * @param {THREE.Mesh} targetMesh - The mesh to which to apply the position.
     * @param {Object} [options] - Optional settings.
     * @param {boolean} [options.alignTop=false] - If true, aligns the bottom of the targetMesh to the top of the sourceMesh.
     */
    setMeshOnTop (sourceMesh, targetMesh)  {
        if (!(sourceMesh instanceof THREE.Mesh) || !(targetMesh instanceof THREE.Mesh)) {
          console.error('Invalid arguments: sourceMesh and targetMesh must be instances of THREE.Mesh.');
          return;
        }
      
        // Get world positions of both meshes
        const sourceWorldPos = new THREE.Vector3();
        const targetWorldPos = new THREE.Vector3();
        sourceMesh.getWorldPosition(sourceWorldPos);
        targetMesh.getWorldPosition(targetWorldPos);

        // Calculate the vertical displacement required
        const displacementY = sourceMesh.geometry.boundingBox.max.y - sourceMesh.geometry.boundingBox.min.y;

        // Apply translation to move targetMesh to the top of sourceMesh
        targetMesh.position.y += displacementY;    
    }

    placePlaneOnTopOfBox (plane, box) {
        // Ensure both meshes have updated world matrices
        box.updateMatrixWorld();
        plane.updateMatrixWorld();
    
        // Compute the bounding box of the box mesh to find its top
        const boxBoundingBox = new THREE.Box3().setFromObject(box);
        const boxTopY = boxBoundingBox.max.y;
    
        // Assuming the plane's local axes are aligned with the world axes
        // We'll place the center of the plane on top of the box
        // If the plane's pivot is at its center, we don't need to adjust for the plane's own dimensions
        plane.position.set(plane.position.x, boxTopY, plane.position.z);
        return boxTopY
        // Optionally, if you want the plane to be exactly on top of the box without intersecting,
        // you might want to add a small offset to boxTopY, especially if the plane has some thickness or different pivot
    }



    loadTexture ({
        nivra,
        url, shouldRepeat = false, repeatX = 1, repeatY = 1
    })  {
        
    
        return new Promise((resolve) => {
            if(!nivra) return resolve();
            var a = nivra.asset;
            if(!a) return resolve();
            var loader = nivra.asset.parser.textureLoader;
            
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
                    console.log(
                        'An error happened while loading texture:', err,
                        url
                    );
                }
            );
        });
    }


    async getIconFromType   (type) {
        var icon;
		if(type && typeof(type) == "string") {
			var collectableItem = AWTSMOOS[type];
		
			if(collectableItem) {
				var ty = collectableItem.iconId;
				if(ty) {
					icon = ty;
				}
			}
		}
		var iconData = null;
		if(typeof(icon) == "string") {
			try {
				var iconic = await import("../../../icons/items/"+ icon+".js")
				if(iconic && iconic.default) {
					iconData = iconic.default
				}
			} catch(e){
				
				return null;
			}
		}
		return iconData
    }

    getGameState ()  {
        var res = {
            nivrayim: this.nivrayim.map(q => ({
                transform: this.getTransformation(q.mesh),
                name: q.name
            })),
            shaym: this.shaym
        };

        return res;
    }

    setGameState  (state = {})  {
        if(typeof(state) != "object") {
            state = {};
        }
        if(!state.nivrayim) return;
        if(!state.shaym) return;
        if(!this.nivrayim.length) {
            return false
        }
        for(var n of state.nivrayim) {
            var nivra = this.nivrayim.find(q => 
                q.name && q.name == n.name
            );
            
            if(!nivra) continue;
            
            nivra.ayshPeula("change transformation", n.transform);
            
        }

        return true

    }

    
      
      // Example usage:
      // Assuming you have two meshes, sourceMesh and targetMesh
      // setMeshOnTop(sourceMesh, targetMesh);



      async fetchWithProgress  (url, options = {}, otherOptions)  {
        var {onProgress} = otherOptions;
        var headers = options?.headers || {};
        if(!options) options =  {}
        options.headers = {
            ...headers,
          
            //'Cache-Control': 'no-cache'
            
        }
        

        const response = await fetch(url, {
            ...options,

        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const contentLength = response.headers.get('Content-Length');
        const total = contentLength ? parseInt(contentLength, 10) : null;
        let loaded = 0;
    
        const reader = response.body.getReader();
        let chunks = [];
        let result = await reader.read();
    
        while (!result.done) {
            loaded += result.value.length;
            chunks.push(result.value);
    
            if (onProgress && total !== null) {
                await onProgress(loaded / total);
            }
            result = await reader.read();
        }
    
        
        return {
            
            
            ...response,
            ok:true,
            blob() {
                const arrayBuffer = new Uint8Array(chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [])).buffer;
                const blob = new Blob([arrayBuffer], { type: response.headers.get('Content-Type') });
                return blob
            },
            text() {
                chunks.join("")
            }
        };
    }
    fetchWithProgressOld  (url, options={})  {

        class CustomResponse {
            constructor(xhr) {
                this.xhr = xhr;
                this.headers = new Headers();
                // Parse headers from XHR response
                var self = this;
                xhr.getAllResponseHeaders().trim().split(/[\r\n]+/).forEach((line) => {
                    var parts = line.split(': ');
                    var header = parts.shift();
                    var value = parts.join(': ');
                    console.log("Appending",value,header)
                    try {
                        self.headers.append(header, value);
                    } catch(e){
                        console.log(e)
                    }
                });
                this.ok = xhr.status >= 200 && xhr.status < 300;
                this.status = xhr.status;
                this.statusText = xhr.statusText;
            }
        
            async text() {
                // Send request for text
                this.xhr.responseType = "text";
                
                // Wait for response and return text
                await new Promise((resolve, reject) => {
                    this.xhr.open("GET", url, true);
               
                    this.xhr.onload = function() {
                        resolve(this.xhr.response);
                    };
                    this.xhr.onerror = function() {
                        reject(new Error("Error fetching response"));
                    };
                    this.xhr.send();
                });
                return this.xhr.responseText;
            }
    
            async blob() {
                // Send request for blob
                this.xhr.responseType = "blob";
                this.xhr.open("GET", url, true);
                this.xhr.send();
                // Wait for response and return blob
                await new Promise((resolve, reject) => {
                    this.xhr.open("GET", url, true);
               
                    this.xhr.onload = function() {
                        resolve(this.xhr.response);
                    };
                    this.xhr.onerror = function() {
                        reject(new Error("Error fetching response"));
                    };
                    this.xhr.send();
                });
                return new Blob([this.xhr.response], {
                    type: "application/octet-stream"
                });
            }
        
            // You can add other methods as needed
        }
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            var progress = options.progress;
            xhr.open("options", url, true);
    
            // Set up progress event listener
            xhr.addEventListener("progress", function(event) {
                if (event.lengthComputable) {
                    var percentComplete = event.loaded / event.total;
                    if (typeof progress === "function") {
                        progress(percentComplete, event);
                    }
    
                  //  console.log("Progress: " + (percentComplete * 100).toFixed(2) + "%");
                } else {
                    console.log("Progress: Unknown (Total size not available)");
                }
            });
    
            xhr.onreadystatechange = function() {
            
                resolve(new CustomResponse(xhr));
             
            };
            xhr.send()
    
            
        });
        
    }


    

    

    

    
    
     

    

   

    async goToAnotherWorld(worldText) {

    }
    

    async heescheel/*starts the continuous creation*/() {
        this.isHeesHawvoos = true;
        
    }

    

    async htmlActions(ar) {
        return await this.ayshPeula("htmlActions",ar)
    }
    
    async htmlAction(
        shaym,
        properties,
        methods,
        selector
    ) {
        if(typeof(shaym) == "object") {
            properties = shaym.properties;
            methods = shaym.methods

            selector = shaym.selector
            shaym = shaym.shaym
        }
        return await this.ayshPeula(
            "htmlAction",
            {
                shaym,
                properties,
                methods,
                selector
            }
        );

    }

}