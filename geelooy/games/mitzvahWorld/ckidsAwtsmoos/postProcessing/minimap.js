//B"H

import * as THREE from '/games/scripts/build/three.module.js';
class MinimapPostprocessing {
    renderer;
    rTexture;
    varructor({renderer, scene, camera}) {
        this.renderer = renderer;
        this.rTexture = new THREE.WebGLRenderTarget(
            renderer.width,
            renderer.height, 
            {
                type: 
                THREE.HalfFloatType
            }
        )
    }

    resize(width, height) {

    }
    render(scene, camera) {
        this.renderer.setRenderTarget(
            rTexture
        );
        this.renderer.render(
            scene,
            camera
        )
    }

}