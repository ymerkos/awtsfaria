/**
 * B"H
 */

import * as THREE from '/games/scripts/build/three.module.js';
import { tslFn, texture, uv, uint, positionWorld, modelWorldMatrix, cameraViewMatrix, timerLocal, timerDelta, cameraProjectionMatrix, vec2, instanceIndex, positionGeometry, storage, MeshBasicNodeMaterial, If }
			 from  '/games/scripts/jsm/nodes/Nodes.js';

import StorageInstancedBufferAttribute from '/games/scripts/jsm/renderers/common/StorageInstancedBufferAttribute.js';
import * as BufferGeometryUtils from '/games/scripts/jsm/utils/BufferGeometryUtils.js';
export default class RainEffect {
    timeElapsed = 0; /*in seconds, float precision*/
    startTime = Date.now()
    constructor({
        scene, 
        renderer,
        camera,
        boundingBox, 
        density = 0.13,
        dropSpeed=10,
        dropLength=0.05,
        maxParticleCount = 50000
    }) {
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;
        this.minY = -10;
        this.boundingBox = boundingBox;
        this.density = density;
        this.isRaining = true;
        this.maxParticleCount=maxParticleCount;
        const instanceCount = maxParticleCount / 2;
        this.instanceCount =  instanceCount
        this.dropSpeed = dropSpeed||8.0; // Increase for faster rain
        this.dropLength = dropLength||0.1; // Decrease for shorter raindrops
        this.initStuff()
        this.initRain({
            start: Date.now()
        });

        
    }

    changeMinY(v) {
        this.minY = v;
    }

    initStuff() {

        const timer = timerLocal();
        var size = 100
        var collisionCamera = new THREE.OrthographicCamera( - size, size, size, - size, .1, size );
        collisionCamera.position.y = size;
        collisionCamera.lookAt( 0, 0, 0 );
        collisionCamera.layers.disableAll();
        collisionCamera.layers.enable( 1 );

        this.collisionCamera = collisionCamera;
        this.collisionPosRT = new THREE.RenderTarget( 2048, 2048 );
        
        this.collisionPosRT.texture.type = THREE.HalfFloatType;

        var collisionPosMaterial = new MeshBasicNodeMaterial();
		collisionPosMaterial.colorNode = positionWorld;

        this.collisionPosMaterial=collisionPosMaterial;

        const createBuffer = ( type = 'vec3' ) => storage( new StorageInstancedBufferAttribute( this.maxParticleCount, 3 ), type, this.maxParticleCount );

        this. positionBuffer = createBuffer();
        this. velocityBuffer = createBuffer();
        this. ripplePositionBuffer = createBuffer();
        this. rippleTimeBuffer = createBuffer();
        this. createBuffer = createBuffer;

        this. randUint = () => uint( Math.random() * 0xFFFFFF );

        var {
            positionBuffer,
            velocityBuffer,
            ripplePositionBuffer,
            rippleTimeBuffer,
            collisionPosRT
        } = this;
        this. computeInit = tslFn( () => {

            const position = positionBuffer.element( instanceIndex );
            const velocity = velocityBuffer.element( instanceIndex );
            const rippleTime = rippleTimeBuffer.element( instanceIndex );

            const randX = instanceIndex.hash();
            const randY = instanceIndex.add( this.randUint() ).hash();
            const randZ = instanceIndex.add( this.randUint() ).hash();

            position.x = randX.mul( 100 ).add( - 50 );
            position.y = randY.mul( 25 );
            position.z = randZ.mul( 100 ).add( - 50 );

            velocity.y = randX.mul( - .04 ).add( - .2 );

            rippleTime.x = 1000;

        } )().compute( this.maxParticleCount );




        this.computeUpdate = tslFn( () => {

            const getCoord = ( pos ) => pos.add( 50 ).div( 100 );

            const position = positionBuffer.element( instanceIndex );
            const velocity = velocityBuffer.element( instanceIndex );
            const ripplePosition = ripplePositionBuffer.element( instanceIndex );
            const rippleTime = rippleTimeBuffer.element( instanceIndex );

            position.addAssign( velocity );

            rippleTime.x = rippleTime.x.add( timerDelta().mul( 4 ) );

            //

            const collisionArea = texture( collisionPosRT.texture, getCoord( position.xz ) );

            const surfaceOffset = .05;

           
            var floorPosition = collisionArea.y.add( surfaceOffset ).add(this.minY);
            
            // floor

            const ripplePivotOffsetY = - .9;

            If( position.y.add( ripplePivotOffsetY ).lessThan( floorPosition ), () => {

                position.y = 25;

                ripplePosition.xz = position.xz;
                ripplePosition.y = floorPosition;

                // reset hit time: x = time

                rippleTime.x = 1;

                // next drops will not fall in the same place

                position.x = instanceIndex.add( timer ).hash().mul( 100 ).add( - 50 );
                position.z = instanceIndex.add( timer.add( this.randUint() ) ).hash().mul( 100 ).add( - 50 );

            } );

            const rippleOnSurface = texture( collisionPosRT.texture, getCoord( ripplePosition.xz ) );

            const rippleFloorArea = rippleOnSurface.y.add( surfaceOffset );

            If( ripplePosition.y.greaterThan( rippleFloorArea ), () => {

                rippleTime.x = 1000;

            } );

        } );

        this.computeParticles = this.computeUpdate().compute( this.maxParticleCount );


        // rain

        this. billboarding = tslFn( () => {

            const particlePosition = positionBuffer.toAttribute();

            const worldMatrix = modelWorldMatrix.toVar();
            worldMatrix[ 3 ][ 0 ] = particlePosition.x;
            worldMatrix[ 3 ][ 1 ] = particlePosition.y;
            worldMatrix[ 3 ][ 2 ] = particlePosition.z;

            const modelViewMatrix = cameraViewMatrix.mul( worldMatrix );
            modelViewMatrix[ 0 ][ 0 ] = 1;
            modelViewMatrix[ 0 ][ 1 ] = 0;
            modelViewMatrix[ 0 ][ 2 ] = 0;

            //modelViewMatrix[ 0 ][ 0 ] = modelWorldMatrix[ 0 ].length();
            //modelViewMatrix[ 1 ][ 1 ] = modelWorldMatrix[ 1 ].length();

            modelViewMatrix[ 2 ][ 0 ] = 0;
            modelViewMatrix[ 2 ][ 1 ] = 0;
            modelViewMatrix[ 2 ][ 2 ] = 1;

            return cameraProjectionMatrix.mul( modelViewMatrix ).mul( positionGeometry );

        } );



        const rainMaterial = new MeshBasicNodeMaterial();
        rainMaterial.colorNode = uv().distance( vec2( .5, 0 ) ).oneMinus().mul( 3 ).exp().mul( .1 );
        rainMaterial.vertexNode = this.billboarding();
        rainMaterial.opacity = .2;
        rainMaterial.side = THREE.DoubleSide;
        rainMaterial.forceSinglePass = true;
        rainMaterial.depthWrite = false;
        rainMaterial.depthTest = true;
        rainMaterial.transparent = true;

        const rainParticles = new THREE.Mesh( new THREE.PlaneGeometry( .1, 2 ), rainMaterial );
        rainParticles.isInstancedMesh = true;
        rainParticles.count = this.instanceCount;

        this.rainMaterial=rainMaterial;
        this.rainParticles =rainParticles;

        this.scene.add( rainParticles );



        // ripple

        const rippleTime = rippleTimeBuffer.element( instanceIndex ).x;

        const rippleEffect = tslFn( () => {

            const center = uv().add( vec2( - .5 ) ).length().mul( 7 );
            const distance = rippleTime.sub( center );

            return distance.min( 1 ).sub( distance.max( 1 ).sub( 1 ) );

        } );

        const rippleMaterial = new MeshBasicNodeMaterial();
        rippleMaterial.colorNode = rippleEffect();
        rippleMaterial.positionNode = positionGeometry.add( ripplePositionBuffer.toAttribute() );
        rippleMaterial.opacityNode = rippleTime.mul( .3 ).oneMinus().max( 0 ).mul( .5 );
        rippleMaterial.side = THREE.DoubleSide;
        rippleMaterial.forceSinglePass = true;
        rippleMaterial.depthWrite = false;
        rippleMaterial.depthTest = true;
        rippleMaterial.transparent = true;

        // ripple geometry

        const surfaceRippleGeometry = new THREE.PlaneGeometry( 2.5, 2.5 );
        surfaceRippleGeometry.rotateX( - Math.PI / 2 );

        const xRippleGeometry = new THREE.PlaneGeometry( 1, 2 );
        xRippleGeometry.rotateY( - Math.PI / 2 );

        const zRippleGeometry = new THREE.PlaneGeometry( 1, 2 );

        const rippleGeometry = BufferGeometryUtils.mergeGeometries( [ surfaceRippleGeometry, xRippleGeometry, zRippleGeometry ] );

        const rippleParticles = new THREE.Mesh( rippleGeometry, rippleMaterial );
        rippleParticles.isInstancedMesh = true;
        rippleParticles.count = this.instanceCount;
        this.scene.add( rippleParticles );


        this.renderer.compute( this.computeInit );
    }
    started = false;

    initRain({
        start /**
        started milliseconds timestamp
         */
    }) {
        if(!start) {
            start = Date.now()
        }
        this.startTime = start;
        this.timeElapsed = (Date.now() - start) / 1000;
        if(!this.started) {
            this.started = true;
            

           // this.rain = new THREE.LineSegments(geometry, material);
           // this.scene.add(this.rain);
        } else {
            if(this.rainParticles) {
                this.rainParticles.visible = true;
            }
        }
    }

    stop() {
        this.isRaining = false;
        if(this.rainParticles) {
            this.rainParticles.visible = false;
        }
    }

    update(deltaTime) {
        if (!this.isRaining) return false;
        this.timeElapsed = (Date.now() - this.startTime) / 1000;
        
        // position

        this.scene.overrideMaterial = this.collisionPosMaterial;
        this.renderer.setRenderTarget( this.collisionPosRT );
        this.renderer.renderAsync( this.scene, this.collisionCamera );

        // compute

        this.renderer.compute( this.computeParticles );

        // result

        this.scene.overrideMaterial = null;
        this.renderer.setRenderTarget( null );
        this.renderer.renderAsync( this.scene, this.camera );
        return true;
        //this.rain.material.uniforms.currentTime.value = this.timeElapsed;
        //console.log("Time elapsed", this.timeElapsed, this.rain.material.uniforms.currentTime,
        /*
        this.boundingBox.min.y,
        this.boundingBox.max.y
        )*/
    }
}