/**
 * B"H
 */


import * as THREE from '/games/scripts/build/three.module.js';

//import DepthOfField from '../shaders/TestBasic.js';
import DepthOfField from '../shaders/TestDepth.js';
//import DepthOfField from '../shaders/DepthOfField.js';

export default class PostProcessingManager {
    width;
    height;
    viewDepth = true;
    postprocessing = null;
    settings = {
        
    }
    constructor({
        scene, camera, renderer,
        width,
        height
    }) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.ayin = {
            camera
        };
        this.width = width || 1920;
        this.height = height || 1080
        console.log("B\"H")

    }
    
    postprocessingRender() {
        if(!this.postprocessing) {
            
            return false;
        }
        

        var pp = this.postprocessing

        var scene = this.scene
        var camera = this.activeCamera || this.ayin.camera;
        var renderer = this.renderer;
       
        renderer.setRenderTarget(
           pp.screenTexture
        );
        
        renderer.clearAsync();
        renderer.renderAsyncAsync(
            scene, 
            camera
        );

        
        scene.overrideMaterial = pp.depthMaterial;

        renderer.setRenderTarget(
           !this.viewDepth ? pp.depthTexture:
            null
        );
        renderer.clearAsync();
        renderer.renderAsyncAsync(
            scene, 
            camera
        );
        

        scene.overrideMaterial = null;
        
        renderer.setRenderTarget(null)
        
        if(this.viewDepth)
            return true;

        renderer.clearAsync();
        //other stuff

        renderer.renderAsyncAsync(pp.scene, pp.camera);
        return true;
        renderer.clearAsync();
                renderer.renderAsync(
                    scene, 
                    camera
                )
    }


    postprocessingSetup() {
        
        
        var width = this.width;
        var height = this.height;
        var camera = this.camera;
        if(!this.postprocessing) {
            this.postprocessing = {}
            this.details = this.postprocessing
        }

        var pp = this.postprocessing;
        pp.scene = new THREE.Scene()
        pp.camera = new THREE.OrthographicCamera(
            width / - 2, 
            width / 2, 
            height / 2, 
            height / - 2, 
            - 10000, 10000 
        );

        pp.camera.position.z = 100;
        pp.scene.add(pp.camera);

        


        pp.screenTexture = new 
            THREE.WebGLRenderTarget(
                width,
                height,
                {
                    type: 
                    THREE.HalfFloatType
                }
            );

        pp.depthTexture = new 
            THREE.WebGLRenderTarget(
                width,
                height,
                {
                    type: 
                    THREE.HalfFloatType
                }
            );


        pp.depthMaterial = new THREE.ShaderMaterial({
            uniforms: {
                near: {
                    value: camera.near
                },
                
                far: {
                    value: camera.far
                }
            },
            vertexShader: /* glsl */`
                // Your vertex shader code
                varying vec4 vPosition;
                void main() {
                    vPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * vPosition;
                }
            `,
            fragmentShader: /* glsl */`
                
                varying vec4 vPosition;
                uniform float near; // Camera's near plane
                uniform float far; // Camera's far plane
                
               
                
                float normalizeDepth(float depth) {
                    return 0.5 * depth / far + 0.5;
                }

                void main() {
                    // Get depth in camera space
                    float depth = vPosition.z / vPosition.w;
                    // Map depth to 0-1 range. This is a simpler approach for visualization.
                    float normalizedDepth = normalizeDepth(depth);
                
                    gl_FragColor = vec4(vec3(normalizedDepth), 1.0);
                }
            `});
        
        this.setSize({
            width: this.width,
            height: this.height
        })

        var shader = new THREE.ShaderMaterial({
            uniforms: {
                screenTexture: {
                    value: 
                    pp.screenTexture.texture
                },
                depthTexture: {
                    value: 
                    pp.depthTexture.texture
                },
                focusDepth: {
                    value: 2
                },
                focusSize: {
                    value: 1
                },
                samples:{
                    value:6
                },
                blurScale: {
                    value:75
                },
                near: {
                    value: camera.near
                },
                
                far: {
                    value: camera.far
                },
                resolution: {
                    value: new THREE.Vector2(width, height)
                }

            },
            vertexShader: DepthOfField.vertex,
            fragmentShader: DepthOfField.fragment
        });


        pp.shader=shader;

        var planeGeo = new THREE.PlaneGeometry(
            width, height
        );

        pp.quad = new THREE.Mesh(
            planeGeo,
            shader
        );

        
        pp
        .quad.position.z = -500;

        pp.scene.add(pp.quad);

        
    }
    setFocalDepth(amount) {
        var pp = this.postprocessing;
        if(!pp) return;

        var s = pp.shader;
        if(!s) return;
        var fd = s.uniforms["focusDepth"]
        if(!fd) return;
        fd.value = amount;
        return true;
    }

    setSize({
        width,
        height
    }) {
        var pp = this.postprocessing;
        if(!pp) return;

        if(pp.screenTexture)
        pp.screenTexture.setSize(
            width,
            height
        );

        if(pp.depthTexture)
        pp.depthTexture.setSize(
            width,
            height
        );

        
        this.width = width;
        this.height = height;
    }
}