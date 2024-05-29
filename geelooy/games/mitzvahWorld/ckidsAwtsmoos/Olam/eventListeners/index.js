/**
 * B"H
 * 
 * the difference event listeners needed
 * to make the Olam class function
 */
import userInput from "./userInput.js"
import labels from "./labels.js";
import minimap from "./minimap.js";
import resizing from "./resizing.js";
import destroy from "./destroy.js"
import chossidReactions from "./chossidRaections.js";
import shlichus from "./shlichus.js"

import * as THREE from '/games/scripts/build/three.module.js';

export default function() {
    
    userInput.bind(this)();
    labels.bind(this)();
    minimap.bind(this)();
    resizing.bind(this)();
    destroy.bind(this)();
    chossidReactions.bind(this)();
    shlichus.bind(this)();

    this.on("htmlPeula peula", ({peulaName, peulaVars}) => {
        if(!Array.isArray(peulaVars)) {
            peulaVars = [];
        }
        
        try {
            this.ayshPeula(peulaName, ...peulaVars)
        } catch(e) {
            console.log("Issue",e)
        }
    });


    this.on("htmlPeula", async ob => {
        if(!ob || typeof(ob) != "object") {
            return;
        }
        
        for(
            var k in ob
        ) {
            await this.ayshPeula("htmlPeula "+k,ob[k]);
        }
    });

    

    var lastAction;
    var lastTime = Date.now();
    this.on("increase loading percentage", async ({
        amount, action, info, subAction
    }) => {
        if(!info) info = {};
        var {
            nivra
        } = info;
        var reset = false;
        if(lastAction != action) {
            lastTime = Date.now();
            this.currentLoadingPercentage = 0;
            //this.ayshPeula("reset loading percentage")
            reset = true;
        }
        this.currentLoadingPercentage += amount;
        

        if(this.currentLoadingPercentage > 100) {
            this.currentLoadingPercentage = 100;
        }
        else {
            /*this.ayshPeula(
                "finished loading", ({
                    amount,  action,
                    total: this.currentLoadingPercentage 
                })
            )*/
        }
        this.ayshPeula("increased percentage", ({
            amount, action, subAction,
            total: this.currentLoadingPercentage,
            reset
        }))
        
        lastAction = action;
        
    });



    
    
    
    


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

    
    this.on("switch worlds", async(worldDayuh) => {
        var gameState = this.getGameState();
        this.ayshPeula("switchWorlds", {
            worldDayuh,
            gameState
        })
    });

    

    


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
        var bitmap = await this.loadTexture({
            nivra: mesh.nivraAwtsmoos,
            url: "https://firebasestorage.googleapis.com/v0/b/ckids-games.appspot.com/o/chawfawtseem%2Ftextures%2Fwaternormals.jpg?alt=media"
        })
        
        try {
            const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
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