/**
 * B"H
 * 
 * helper methods for Olam
 */

export default function() {
    /**
     * Sets the position of one mesh (targetMesh) to the world position of another mesh (sourceMesh),
     * with an option to align the target mesh to the top of the source mesh.
     * @param {THREE.Mesh} sourceMesh - The mesh from which to copy the position.
     * @param {THREE.Mesh} targetMesh - The mesh to which to apply the position.
     * @param {Object} [options] - Optional settings.
     * @param {boolean} [options.alignTop=false] - If true, aligns the bottom of the targetMesh to the top of the sourceMesh.
     */
    this.setMeshOnTop = (sourceMesh, targetMesh) => {
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

    this.placePlaneOnTopOfBox = (plane, box) => {
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



    this.loadTexture = ({
        nivra,
        url, shouldRepeat = false, repeatX = 1, repeatY = 1
    }) => {
        
    
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


    this.getIconFromType = async (type) => {
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
				var iconic = await import("../../icons/items/"+ icon+".js")
				if(iconic && iconic.default) {
					iconData = iconic.default
				}
			} catch(e){
				
				return null;
			}
		}
		return iconData
    }

    this.getGameState = () => {
        var res = {
            nivrayim: this.nivrayim.map(q => ({
                transform: this.getTransformation(q.mesh),
                name: q.name
            })),
            shaym: this.shaym
        };

        return res;
    }

    this.setGameState = (state = {}) => {
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
}