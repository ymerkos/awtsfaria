/**
 * B"H
 * environment related listeners
 */
import { Mayim } from '/games/scripts/jsm/objects/Mayim.js';
import { Sky } from '/games/scripts/jsm/objects/Sky.js';
import * as THREE from '/games/scripts/build/three.module.js';
export default function() {
    var self = this;
    this.on("start rain", d => {
        
        this.environment.startRain()
    })

    this.on("stop rain", d => {
        this.environment.stopRain();
    });

    var _rainCycle = null;
    this.on("start rain cycle", seconds => {
        if(!seconds) seconds = 15

        function rainCycle() {
            if(!self.environment) return;
            if(self.environment.isRaining) {
                self.ayshPeula("stop rain")
            } else
                self.ayshPeula("start rain");
                
            _rainCycle = setTimeout(
                rainCycle,
                seconds * 1000
            )
        }

        rainCycle();

    });

    this.on("stop rain cycle", () => {
        this.ayshPeula("stop rain");
        if(_rainCycle) {
            clearTimeout(_rainCycle);
        }
    })

    
    

    

    


    var sceneEnv;
    var skyRenderTarget;
         
            
    const parameters = {
        elevation: 12,
        azimuth: 180
    };
    var sun = new THREE.Vector3();
    this.on("start sky", () => {
       // return
        const sky = new Sky();
        sky.scale.setScalar( 10000 );
        this.scene.add( sky );

        const skyUniforms = sky.material.uniforms;

        skyUniforms[ 'turbidity' ].value = 10;
        skyUniforms[ 'rayleigh' ].value = 2;
        skyUniforms[ 'mieCoefficient' ].value = 0.005;
        skyUniforms[ 'mieDirectionalG' ].value = 0.8;


        

    
        sceneEnv = new THREE.Scene();
        this.sky = sky;
        this.ayshPeula("update sun")
    })

    this.on("update sun", () => {
       // return;
        var sky = this.sky;
        if(!sky) return;
        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        if(this.mayim) {
            this.mayim.forEach(water => {
                water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();
            })
        }

        if ( skyRenderTarget !== undefined ) skyRenderTarget.dispose();

        sceneEnv.add( sky );
        //skyRenderTarget = pmremGenerator.fromScene( sceneEnv );
        this.scene.add( sky );

        

        //this.scene.environment = skyRenderTarget.texture;()
    })
    this.on("start water", async mesh => {
      
       // this.ayshPeula("alert", "WHAT ARE YOU MAYIM",mesh,Mayim)
        
        
        try {
            const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
            if(this.isGPU()) {
                return console.log("No water, GPU!")
            }
            var bitmap = await this.loadTexture({
                nivra: mesh.nivraAwtsmoos,
                url: "https://firebasestorage.googleapis.com/v0/b/ckids-games.appspot.com/o/chawfawtseem%2Ftextures%2Fwaternormals.jpg?alt=media"
            })
            var mayim = new Mayim(
                waterGeometry,
                {
                    textureWidth: 512,
                    textureHeight: 512,
                    waterNormals: bitmap,
                    sunDirection: new THREE.Vector3(),
                    sunColor: 0xffffff,
                    waterColor: 0x001e0f,
                    distortionScale: 3.7,
                    fog: false
                }
            ); 
            mayim.layers.enable(2);
            this.scene.add(mayim);
            mayim.rotation.x = - Math.PI / 2;
            mayim.updateMatrixWorld(true);
            mesh.updateMatrixWorld(true)
            var y = this.placePlaneOnTopOfBox( mayim, mesh);
            this.resetY = Math.min(-5, y);
            mesh.visible = false;
            
            
            if(!this.mayim) {
                this.mayim = [];
            }
            this.mayim.push(mayim);
            
            this.ayshPeula("start sky");
            this.ayshPeula("alert", "made mayim",mayim)
        } catch(e) {
            this.ayshPeula("alert", "issue with mayim",e)
        }
    })
}