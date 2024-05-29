/**
 * B"H
 * 
 * the difference event listeners needed
 * to make the Olam class function
 */

export default function() {
    var c;
    /*setup event listeners*/
    this.on("keydown", peula => {
        c = peula.code;
        if(!this.keyStates[peula.code]) {
            this.ayshPeula("keypressed", peula);
        }
        this.keyStates[peula.code] = true;
        
        if(this.keyBindings[c]) {
            this.inputs[this.keyBindings[c]] = true;
        }
    });

    this.on("setInput", peula => {
        var c = peula.code;
        if(this.keyBindings[c]) {
            this.inputs[this.keyBindings[c]] = true;
        }
    })

    this.on("setInputOut", peula => {
        var c = peula.code;
        if(this.keyBindings[c]) {
            this.inputs[this.keyBindings[c]] = false;
        }
    })

    this.on("keyup", peula => {
        c = peula.code;
        this.keyStates[peula.code] = false;

        if(this.keyBindings[c]) {
            this.inputs[this.keyBindings[c]] = false;
        }
    });

    this.on("presskey", peula => {
        this.ayshPeula("keypressed", peula);
        var c= peula.code;

    })

    this.on('wheel', (event) => {

        this.ayin.deltaY = event.deltaY;
        this.ayshPeula("htmlAction",{
            shaym:"Debug",
            properties: {
                textContent: "In world now got diff: "
                +event.deltaY
            }
        });
        this.ayin.zoom(event.deltaY)
    })

    this.on("mousedown", peula => {
        if(!peula.isAwtsmoosMobile)
            this.ayshPeula("mouseLock", true);

        this.ayin.onMouseDown(peula);
        this.mouseDown = true;
        if(this.hoveredNivra) {
            console.log(this.hoveredNivra);
            this.ayshPeula("keypressed", {
                code: "KeyC"
            })
        }
        
    });
    
    this.pointer = new THREE.Vector2();
    var intersected = null;
    var hoveredLabel = false;

    this.on("hide label", async () => {
        await this.htmlAction({
            shaym: "minimap label",
            properties: {
                innerHTML: "",
                style: {
                    
                    transform:`translate(${-1e4}px, ${
                        -1e4
                    }px)`
                }
            },
            
            methods: {
                classList: {
                    add: "invisible"
                }
            }
        })
    })

    const mouseMove = async peula => {
        if(!this.boundingRect) {
            return;
        }
        if(peula) {
            this.achbar.x = peula.clientX;
            this.achbar.y = peula.clientY;
        }
        var {
            left,
            top,
            width,
            height
        } = this.boundingRect
        if(peula) {
            this.pointer.x = ((peula.clientX - left) / width) * 2 -1;
            this.pointer.y = -(
                (peula.clientY - top) / height
            ) * 2 + 1;
        }

        /**
         * as mouse moves check if any objects 
         * are being hovered over
         */

        var hit = this.ayin.getHovered()
        
        var ob = hit?.object;
        //   console.log("HIT 1",hit,ob)
        var niv = ob?.nivraAwtsmoos;
        const removeIntersted = () => {
            intersected.niv.isHoveredOver = false;
            this.hoveredNivra = null;

            intersected
            .ob.material.emissive.setHex( 
                // intersected.currentHex
                0x00
                );
            intersected = null;
            this.htmlAction({
                selector: "body",
                properties: {
                    style: {
                        cursor: "revert"
                    }
                }
            })
        }
        
        if(niv && !niv.wasSealayked) {
            niv.isHoveredOver = true;
            if(intersected && intersected?.niv != niv) {

                
                removeIntersted()
            }
            if((niv.dialogue || ob.hasDialogue)) {
                const makeMessage = async ({
                    tooFar=false,
                    gone=false
                }={}) => {
                    if(gone) {
                        await this.ayshPeula("hide label")
                        return;
                    }
                    var msg = "This is: " + niv.name;
                    if(!niv.inRangeNivra || tooFar) {
                        msg += ".\nYou are too far away. Come closer!"
                    }
                    var tx = this.achbar.x;
                    var ty = this.achbar.y;
                    hoveredLabel = true;
                    await this.htmlAction({
                        shaym: "minimap label",
                        properties: {
                            innerHTML:msg,
                            style: {
                                
                                transform:`translate(${tx}px, ${ty}px)`
                            }
                        },
                        
                        methods: {
                            classList: {
                                remove: "invisible"
                            }
                        }
                    })
                }
                await makeMessage()
                
                if(intersected?.niv != niv) {
                    console.log("NIV")
                    //wasApproached
                    var color = 0xff0000;
                    if(niv?.wasApproached) {
                        color = 0x00ff00;
                    }
                    

                    if(!ob.material.awtsmoosifized) {
                        var nm = ob.material.clone();
                        nm.awtsmoosifized = true;
                        nm.needsUpdate = true;
                        ob.material = nm;
                        
                    }

                    

                    niv.on("someone left", async () => {
                        if(!niv.isHoveredOver) return;
                        if(!ob) {
                            await makeMessage({gone:true})
                            ob.material.emissive.setHex(0x00);
                            niv.clear("someone left")
                            
                        } else {
                            await makeMessage({tooFar:true})
                            ob.material.emissive.setHex(0xff0000);
                            
                        }
                        await mouseMove();
                    });

                
                    niv.on("was approached", async () => {
                        if(!niv.isHoveredOver) return;
                        if(ob) {
                            ob.material.emissive.setHex(0x00ff00)
                            await makeMessage()
                        } else {
                            ob.material.emissive.setHex(0x00);
                            niv.clear("was approached")
                            
                        }
                        await mouseMove();
                    })
                    
                    
                    intersected = {niv, ob};
                    intersected.currentHex = ob
                        .material
                        .emissive.getHex();
                    ob.material.emissive.setHex( color );
                    this.hoveredNivra = niv;
                    this.htmlAction({
                        selector: "body",
                        properties: {
                            style: {
                                cursor: "pointer"
                            }
                        }
                    })
                }
        
            }
        } else {
            if(hoveredLabel) {
                hoveredLabel = false;
                await this.ayshPeula("hide label");
                
            }
            if(intersected) {
                
                removeIntersted()
            }
            

        }
        this.hoveredNivra = niv;
        if(this.mouseDown) {
            this.ayin.onMouseMove(peula);
        }

    };


    this.on("mousemove", mouseMove);

    this.on("mouseup", peula => {
        this.ayshPeula("mouseRelease", true);
        this.ayin.onMouseUp(peula);
        this.mouseDown = false;
        
    });


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
}