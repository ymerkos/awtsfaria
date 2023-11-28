/**
 * B"H
 */


import * as THREE from '/games/scripts/build/three.module.js';

//import DepthOfField from '../shaders/TestBasic.js';
import DepthOfField from '../shaders/TestDepth.js';
//import DepthOfField from '../shaders/DepthOfField.js';
export default class PostProcessingManager {
    width = window.innerWidth;
    height = window.innerHeight;
    postprocessing = null;
    settings = {
        
    }
    constructor({
        scene, camera, renderer
    }) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.ayin = {
            camera
        };

    }
    setSize(width, height) {
        this.width = width;
        this.height = height;
    }
    postprocessingRender() {
        if(!this.postprocessing) {
            return;
        }
        var pp = this.postprocessing

        var scene = this.scene
        var camera = this.activeCamera || this.ayin.camera;
        var renderer = this.renderer;
       
        renderer.setRenderTarget(
           pp.screenTexture
        );
        
        renderer.clear();
        renderer.render(
            scene, 
            camera
        );

        
        scene.overrideMaterial = pp.depthMaterial;

        renderer.setRenderTarget(
            pp.depthTexture
        );
        renderer.clear();
        renderer.render(
            scene, 
            camera
        );

        scene.overrideMaterial = null;
        
        renderer.setRenderTarget(null)
        

        renderer.clear();
        //other stuff

        renderer.render(pp.scene, pp.camera);
        return
        renderer.clear();
                renderer.render(
                    scene, 
                    camera
                )
            }


    postprocessingSetup() {
        
        
        var width = this.width;
        var height = this.height;
        if(!this.postprocessing) {
            this.postprocessing = {}
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
            vertexShader: /* glsl */`
                // Your vertex shader code
                varying vec4 vPosition;
                void main() {
                    vPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * vPosition;
                }
            `,
            fragmentShader: /* glsl */`
                // Your fragment shader code
                varying vec4 vPosition;
                void main() {
                    float depth = vPosition.z / vPosition.w;
                    gl_FragColor = vec4(vec3(depth), 1.0);
                }
            `});
        pp.screenTexture.setSize(
                this.width,
                this.height
            );

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
                    value: 20
                },
                focusSize: {
                    value: 3
                },
                samples:{
                    value:4
                },
                blurScale: {
                    value: 5
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

}