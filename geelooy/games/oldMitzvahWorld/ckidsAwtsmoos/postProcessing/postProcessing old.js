/**
 * B"H
 */


import * as THREE from '/games/scripts/build/three.module.js';
import { BokehDepthShader, BokehShader } from '/games/scripts/jsm/shaders/BokehShader2.js';
import DepthOfField from '../shaders/DepthOfField.js';
import { ShaderMaterial } from '/games/scripts/build/three.module.js';
export default class PostProcessingManager {
    width = window.innerWidth;
    height = window.innerHeight;
    postprocessing = null;
    settings = {
        RINGS: 3,
        SAMPLES: 2,
        dof: {

            enabled: true,
            jsDepthCalculation: true,
            shaderFocus: false,

            fstop: 2,
            maxblur: 2.0,

            showFocus: false,
            focalDepth: 2.8,
            manualdof: false,
            vignetting: false,
            depthblur: false,

            threshold: 0.5,
            gain: 3.0,
            bias: 0.5,
            fringe: 0.7,

            focalLength: 35,
            noise: true,
            pentagon: false,

            dithering: 0.0001

        }
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

        renderer.clearAsync();
        renderer.setRenderTarget(
            pp.rtTextureColor
        );

        renderer.clearAsync();
        renderer.renderAsync(scene, camera);

        scene.overrideMaterial = 
            pp.depthMaterial;

        renderer.setRenderTarget(
            pp.rtTextureDepth
        );
        renderer.clearAsync();

        renderer.renderAsync(
            scene, camera
        );

        scene.overrideMaterial = null;

        renderer.setRenderTarget(
            null
        );

        renderer.renderAsync(pp.scene, pp.camera)
    }

    adjustPostProcessing() {
        if(!this.postprocessing) {
            return;
        }
        var pp = this.postprocessing;
        pp.rtTextureColor.setSize(
            this.width,
            this.height
        );

        pp.rtTextureDepth.setSize(
            this.width,
            this.height
        );

        pp.bokeh_uniforms["textureWidth"]
            .value = this.width;

        pp.bokeh_uniforms["textureHeight"]
            .value = this.height;
    }

    postprocessingSetup() {
        
        var scene = this.scene
        var camera = this.ayin.camera;
        var renderer = this.renderer;
        
        var width = this.width;
        var height = this.height;

        console.log("Trying wtih width height ",width,height)
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


        var depthShader = BokehDepthShader; 
        
        
        var depthMaterial = new ShaderMaterial({
            uniforms: depthShader.uniforms,
            vertexShader: depthShader.vertexShader,
            fragmentShader: depthShader
                .fragmentShader
        });

        depthMaterial.uniforms["mNear"]
            .value = camera.near;
        depthMaterial.uniforms["mFar"]
            .value = camera.far;
        
        pp.depthMaterial = depthMaterial;



        pp.rtTextureDepth = 
            new THREE.WebGLRenderTarget(
                width,
                height, 
                {
                    type: 
                    THREE.HalfFloatType
                }
            );

        pp.rtTextureColor = 
            new THREE.WebGLRenderTarget(
                width,
                height, {
                    type: 
                    THREE.HalfFloatType
                }
            );

        var bokehShader = BokehShader;
        pp.bokeh_uniforms = THREE
                .UniformsUtils
                .clone(bokehShader.uniforms);

        pp.bokeh_uniforms["tColor"]
            .value = pp.rtTextureColor
                .texture;
        pp.bokeh_uniforms["tDepth"]
            .value = pp.rtTextureDepth
                .texture;

        pp.bokeh_uniforms["textureWidth"]
            .value = width;

        pp.bokeh_uniforms["textureHeight"]
            .value = height;
           
        
        pp.materialBokeh = 
        new THREE.ShaderMaterial( {

                uniforms: pp.bokeh_uniforms,
                vertexShader: bokehShader.vertexShader,
                fragmentShader: bokehShader.    fragmentShader,
                defines: {
                    RINGS:this
                    .settings.RINGS,
                    SAMPLES:
                    this.settings
                    .SAMPLES
                }

            } );


            pp.quad = new THREE
        .Mesh( 
            new THREE.PlaneGeometry( 
                width, height 
            ), 
            pp.materialBokeh 
        );
        pp
        .quad.position.z = -500;
        pp.scene.add(
             pp.quad 
            );

        this.adjustPostProcessingToSettings()
        
    }

    adjustPostProcessingToSettings() {
        if(!this.postprocessing) 
            return;
        var pp = this.postprocessing;
        for ( var e in this.settings.dof ) {
            if ( e in pp.bokeh_uniforms ) {

                pp.bokeh_uniforms[ e ].value = this.settings.dof[ e ];

            }

        }

        pp.bokeh_uniforms[ "znear" ].value = this.ayin.camera.near;
        pp.bokeh_uniforms[ "zfar" ].value = this.ayin.camera.far;

        this.ayin.camera.setFocalLength(this.settings.dof.focalLength);
    }

    setFocalDepth(focalDepth) {
        if(!this.postprocessing) {
            return
        }

        this.postprocessing.bokeh_uniforms[ "focalDepth" ].value 
            = focalDepth
    }

    getFocusFromDistance(distance) {
        var camera = this.activeCamera || this.ayin.camera;
        var near = camera.near;
        var far = camera.far;
        function linearize( depth ) {

            var zfar = far;
            var znear = near;
            return - zfar * znear / ( depth * ( zfar - znear ) - zfar );

        }

        function smoothstep(depth ) {

            var x = saturate( ( depth - near ) / ( far - near ) );
            return x * x * ( 3 - 2 * x );

        }

        function saturate( x ) {

            return Math.max( 0, Math.min( 1, x ) );

        }

        var sdistance = smoothstep(distance);
        var ldistance = linearize(
            
            1 - 
            sdistance
        );

        return ldistance;
    }
}