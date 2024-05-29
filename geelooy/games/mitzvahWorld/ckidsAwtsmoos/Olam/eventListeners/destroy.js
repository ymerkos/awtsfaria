/**
 * B"H
 * the event listener to destroy a nivra from the Olam
 */

export default function() {
    this.on("destroy", async() => {
        for(var nivra of this.nivrayim) {
            await this.sealayk(
                nivra
            );
            
        }
        this.components = {};
        this.vars = {};
        this.ayshPeula("htmlDelete", {
            shaym: `ikarGameMenu`
        });
        this.renderer.renderAsyncLists.dispose();
    

                    // Function to dispose materials
        var disposeMaterial = (material) => {
            material.dispose(); // Dispose of the material
            if (material.map) material.map.dispose(); // Dispose of the texture
            if (material.lightMap) material.lightMap.dispose();
            if (material.bumpMap) material.bumpMap.dispose();
            if (material.normalMap) material.normalMap.dispose();
            if (material.specularMap) material.specularMap.dispose();
            if (material.envMap) material.envMap.dispose();
            // Dispose of any other maps you may have
        };
        
        // Function to dispose hierarchies
        var disposeHierarchy = (node, callback) => {
            for (var child of node.children) {
            disposeHierarchy(child, callback);
            callback(child);
            }
        };
        
        // Function to dispose node (geometry, material)
        var disposeNode = (node) => {
            if (node instanceof THREE.Mesh) {
            if (node.geometry) {
                node.geometry.dispose(); // Dispose of geometry
            }
        
            if (node.material instanceof THREE.Material) {
                // Dispose of material
                disposeMaterial(node.material);
            } else if (Array.isArray(node.material)) {
                // In case of multi-material
                for (var material of node.material) {
                disposeMaterial(material);
                }
            }
            }
        };
        
        // Call this function when you want to clear the scene
        var clearScene = (scene, renderer) => {
            disposeHierarchy(scene, disposeNode); // Dispose all nodes
            scene.clear(); // Remove all children
        
            // Dispose of the renderer's info if needed
            if (renderer) {
            renderer.dispose();
            }
        
            // Clear any animation frames here
            // cancelAnimationFrame(animationFrameId);
            
            // Remove any event listeners if you have added them to the canvas or renderer
        };
        if(this.scene && this.renderer) {
            clearScene(
                this.scene,
                this.renderer
            )
        }
        this.clearAll();
        this.nivrayim = [];
        this.nivrayimWithPlaceholders = [];
        
        delete this.renderer;
        delete this.scene;
        
        delete this.worldOctree;

        this.destroyed = true;
        

        
    });
}