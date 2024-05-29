/**
 * B"H
 * 
 * the difference event listeners needed
 * to make the Olam class function
 */
import userInput from "./userInput.js"
import labels from "./labels.js";


import * as THREE from '/games/scripts/build/three.module.js';

export default function() {
    
    userInput.bind(this)();
    labels.bind(this)();
    

    


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

    this.on("minimap fullscreen toggle", async () => {
        await this.htmlAction({
            shaym: "map parent",
            methods: {
                classList: {
                    toggle: "biggerMap"
                }
            }
        })
        
    });

    this.on("minimap zoom in", (amount = 0.25) => {

        if(!this.minimap) return;
        this.minimap.zoom += amount
    });

    this.on("minimap zoom out", (amount = 0.25) => {

        if(!this.minimap) return;
        this.minimap.zoom -= amount
    });

    this.on("captureMinimapScene", async () => {
        if(!this.minimap) return;
        this.minimap.captured = false;
        
    })

    
    this.on("start minimap", ({canvas, size}) => {
        this.minimapCanvas = canvas;
        var temp = this.rendererTemplate(
            canvas
        )
        this.minimapRenderer = new temp({ antialias: true, canvas });
        this.minimapRenderer.isMinimap=true
        this.minimapRenderer.setSize(size.width, size.height, false)
        this.minimap = new MinimapPostprocessing({
            renderer:this.minimapRenderer,
            scene: this.scene,
            olam: this
        })
        
    })

    

    this.on("update minimap camera", ({position, rotation, targetPosition}) => {
        if(!this.minimap) {
            return;
        }

        this.minimap.ayshPeula(
            "update minimap camera", {
                position, 
                rotation, 
                targetPosition
            }
        )     
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

    this.on("ready", () => {
        
    });

    this.on("ready from chossid", () => {
        setTimeout(() => {
            console.log("rain starting?")
            //this.ayshPeula("start rain cycle", 77)
            console.log("Started rain")
        }, 500)
        
    })


    /**
        * 
        */
    /**
        * In order to determine what the
        * inital size of the window is
        * presumably the first time we 
        * resize the canvas represents this.
        * 
        * Currently relevant for THREE.MeshLine
        * that requires the canvas size parameter
        * 
        */
    var setSizeOnce = false;
    this.windowSize = new THREE.Vector2()
    this.rendered = false;
    this.on("resize", async peula => {
        
        this.windowSize.x = peula.width
        this.windowSize.y = peula.height
        if(!this.rendered) return;
        await this.setSize(peula.width, peula.height, false);
        
        await this.ayshPeula(
            "alert", "Set size: "+this.width +
            " by "+ this.height,
            "after trying from: ", peula
        )
        if(!setSizeOnce) {
            await this.ayshPeula(
                "alert", "First time setting up " + 
                this.nivrayim.length
            )
            
            
            
            // this.postprocessingSetup()
            await this.ayshPeula("alert", "Finished first size set")
            this.ayshPeula("ready to start game")
            setSizeOnce = true;
        }
        if(this.minimap) {
            this.minimap.resize()
        }
    });

    this.on("rendered first time", async () => {
        /**
            * actual time when started
            */
        this.rendered = true
        this.renderer.renderedOnce = true;
        var windowSize = await this.ayshPeula("get window size")
        if(Array.isArray(windowSize)) {
            windowSize = windowSize[0]
        }

        await this.ayshPeula("hide loading screen")
        
        this.windowSize.x = windowSize.width;
        this.windowSize.y = windowSize.height;
        await this.ayshPeula("resize", {
            width: this.windowSize.x,
            height: this.windowSize.y  
        })
        
        if(this.minimap) {
            await this
            .minimap
            .setMinimapItems(this.nivrayimWithShlichuseem, "Mission statements")
        }
        

        for(var n of this.nivrayim) {
                
            await n.ayshPeula("started", n, this);
            if(typeof(n.started) == "function") {
                await n.started()
            }
        };
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

    this.on("reset player position", () => {
        
        var c = this.nivrayim.find(w => 
            w.constructor.name == "Chossid"
        );
        if(!c) return console.log("couldn't find player");
        if(this.playerPosition) {
            console.log("Resseting position",this.playerPosition)
            try {
                c
                .ayshPeula(
                    "change transformation", {
                        position: this
                            .playerPosition
                    }
                );
                
            } catch(e) {
                console.log(e)
            }
        } else {
            console.log("No player position!?")
        }
    });

    this.on("save player position", () => {
        var c = this.nivrayim.find(w => 
            w.constructor.name == "Chossid" 
        );
        if(!c) return console.log("no player found");
        this.playerPosition = c.mesh.position.clone();
    //    console.log("Saved!",this.playerPosition,c.mesh.position,c.modelMesh.position)
    });

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

    this.on("get shlichus data", shlichusID => {
        var shl = this.modules.shlichuseem;
        if(!shl) return null;
        if(typeof(shl) != "object") {
            return null;
        }
        var found = null;
        Object.keys(shl).forEach(w=> {
            if(found) return;
            var sh = shl[w];
            if(sh.id == shlichusID) {
                found = sh;
            }
        });
        return found;
    });

    //nivra.iconPath = "indicators/exclamation.svg"
    this.on("is shlichus available", shlichusID => {
        if(Array.isArray(shlichusID)) {
            var hasIt = false;
            for(var k of shlichusID) {
                var isItAvailable = this.ayshPeula("is shlichus available",k);
                if(isItAvailable) {
                    hasIt = isItAvailable;
                    return hasIt;
                }
            }
        }
        let shlichusData =  this.ayshPeula("get shlichus data", shlichusID);
        if(!shlichusData) {
            return null;
        }
        
        var r = shlichusData.requires;
        if(!r) return shlichusData;
        var st = r.started;
        if(Array.isArray(st)) {
            /**
                * if it requires certain shlichuseem to be started check
                * if they are ALL started
                */
            var allStarted = true;
            for(var n of st) {
                var started = this.ayshPeula("is shlichus started", n);
            
                if(!started) {
                    allStarted = false;
                    return allStarted;
                }
            }
            
            return shlichusData;
        }
        return shlichusData;
    })
    /**
        * Gets most recent shlichus data in chain of shlichuseem.
        * 
        * @param {number} shlichusID - The ID of the STARTING shlichus.
        * @returns {number|null} The ID of the next shlichus 
        * in the chain that hasn't been completed,
        *  or null if all are completed.
        */
    this.on("get next shlichus data",  (shlichusID) => {
        try {
            let currentShlichusData =  this.ayshPeula("get shlichus data", shlichusID);
            
            if(!currentShlichusData) {
                
                return null;
            }
            
        //     console.log("Trying",currentShlichusData,shlichusID)

            var r = currentShlichusData.requires;
            if(r) {
                var st = r.started;
                if(st) {
                    var isStarted = true;
                    if(Array.isArray(st)) {
                        st.forEach(w => {
                            var started = 
                            this.ayshPeula("is shlichus started", w);
                            if(!started) {
                                isStarted = false;
                            }
                        })
                    }
                    if(!isStarted) {

                        return null;
                    }
                }
            }
            if(currentShlichusData.type !== "chain") {
                if(this.completedShlichuseem.includes(shlichusID))
                    return null;

                return currentShlichusData// null;
            }
            if(!currentShlichusData.nextShlichusID) return null;
            // Recursively check the next shlichus if the current one is completed
            while (
                
                currentShlichusData.nextShlichusID
            ) {
                const isDone = this.ayshPeula(
                    "is shlichus completed", 
                    currentShlichusData.id
                );
                if (!isDone) {
                    return currentShlichusData;
                }

                currentShlichusData =  this.ayshPeula(
                    "get shlichus data",
                    currentShlichusData.nextShlichusID
                );
            }

            if(!currentShlichusData) {
                return null;
            }
            
            // If the chain ends or the 
            //current shlichus is not completed, return the current shlichus data
            //(2nd to last one, should be last result at this point)
            return currentShlichusData.type === "chain" ? currentShlichusData : null;
        } catch (error) {
            console.error("Error in getting next shlichus data: ", error);
            return null;
        }
        
    });



    
    this.on("get active shlichus", shlichusID => {
    //    console.log("Trying",shlichusID,this.shlichusHandler)
        if(!this.shlichusHandler) {
            console.log("NOT!")
            return null;
        }
        var sh = this.shlichusHandler.getShlichusByID(shlichusID);
        return sh;  
    });

    

    this.on("accept shlichus",async  (shlichusID, giver) => {
        if(!this.shlichusHandler) return null;
            var shData = this.ayshPeula("get shlichus data", shlichusID);
            if(!shData) return null;

            var shl = await this.shlichusHandler.
                createShlichus(shData, giver);

            shl.initiate();
            this.ayshPeula("updateProgress",{
                
                ["acceptedShlichus_"+shlichusID]: {
                    shlichusID,
                    time: Date.now()
                }
            })

            /*
                add to list of started shlichuseem
                
            */
            
            var ind = this.startedShlichuseem.indexOf(shlichusID);
            if(ind < 0) {
                this.startedShlichuseem.push(shlichusID)
            }
            return shl;
    });

    this.on("complete shlichus", sID => {
        var ash = this.ayshPeula("get active shlichus", sID)
        if(!ash) return false;

        ash.isActive = false;
        
        this.ayshPeula("updateProgress",{
                
            completedShlichus: {
                shlichusID: sID,
                time: Date.now()
            }
        })
        var ind = this.completedShlichuseem.indexOf(sID);
        if(ind < 0) {
            this.completedShlichuseem.push(sID)
        }

        ash.finish(ash);
    });

    this.on("remove shlichus", sID => {
        var ind = this.startedShlichuseem.indexOf(sID);
        if(ind > -1) {
            this.startedShlichuseem.splice(ind, 1)
        }
    })
    this.on("is shlichus started", sID => {
        return this.startedShlichuseem.includes(sID)
    });

    this.on("is shlichus completed", sID => {
        return this.completedShlichuseem.includes(sID)
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