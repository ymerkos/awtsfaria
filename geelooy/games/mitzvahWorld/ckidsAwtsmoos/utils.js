/**
 * B"H
 * 
 * Utils
 */

class Utils {
    static replaceMaterialWithLambert(gltf) {
        gltf.scene.traverse((child) => {
            if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {
                let oldMat = child.material;
                let newMat = new THREE.MeshLambertMaterial();
    
                // Copy properties
                newMat.color.copy(oldMat.color);
                newMat.map = oldMat.map;
                newMat.lightMap = oldMat.lightMap;
                newMat.lightMapIntensity = oldMat.lightMapIntensity;
                newMat.aoMap = oldMat.aoMap;
                newMat.aoMapIntensity = oldMat.aoMapIntensity;
                newMat.emissive.copy(oldMat.emissive);
                newMat.emissiveMap = oldMat.emissiveMap;
                newMat.emissiveIntensity = oldMat.emissiveIntensity;
                newMat.specularMap = oldMat.specularMap;
                newMat.alphaMap = oldMat.alphaMap;
                newMat.envMap = oldMat.envMap;
                newMat.combine = oldMat.combine;
                newMat.reflectivity = oldMat.reflectivity;
                newMat.refractionRatio = oldMat.refractionRatio;
                newMat.wireframe = oldMat.wireframe;
    
                // Replace material
                child.material = newMat;
            }
        });
    }
}