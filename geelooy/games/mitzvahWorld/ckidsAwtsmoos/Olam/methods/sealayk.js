/**
 * B"H
 * method to remove nivra from olam
 * 
 */

export default class {
    /**
     * @method sealayk removes a nivra from 
     * the olam if it exists in it
     * @param {AWTSMOOS.Nivra} nivra 
     */

    sealayk(nivra) {
        if(!nivra) return;
        /**
         * keep track of if it was removed
         */
        nivra.wasSealayked = true;
        if(nivra.isMesh) {
            try {
                if(nivra.isSolid) {
                    
                    this.worldOctree.removeMesh(nivra)
                }
                nivra.removeFromParent();
            } catch(e) {

            }
        }
     
        var m = nivra.mesh;
        try {
            if(m) {
                m.removeFromParent();
                
            }
            if(nivra.modelMesh) {
                nivra.modelMesh.removeFromParent();
            }
            
           
        } catch(e){
            console.log("No",e)
            
        }

        if(nivra.addedToPlaceholder) {
            nivra.addedToPlaceholder.addedTo = null;
        }
        
        if(nivra.isSolid) {
            try {
                if(nivra.mesh)
                    this.worldOctree.removeMesh(nivra.mesh);
                
                return;
            } catch(e){
                console.log(e,"Oct")
            }
        }

        ind = this.nivrayimWithPlaceholders.indexOf(nivra);
        if(ind > -1) {
            this.nivrayimWithPlaceholders.splice(ind, 1);
        }

        ind = this.interactableNivrayim.indexOf(nivra);
        if(ind > -1) {
            this.interactableNivrayim.splice(ind, 1);
        }
        try {
            if(nivra && nivra.ayshPeula) {
                
		        nivra.ayshPeula("sealayk")
            }
        } catch(e) {

        }

        var ind = this.nivrayim.indexOf(nivra)
        if(ind > -1) {
            
           // delete this.nivrayim[ind];
            this.nivrayim.splice(ind, 1);
            nivra.clearAll();
        } else {
            console.log("Couldnt find",nivra,ind)
        }
        
     

        
    }
}