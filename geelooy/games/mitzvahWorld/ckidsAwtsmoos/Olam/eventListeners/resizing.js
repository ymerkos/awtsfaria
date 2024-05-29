/**
 * B"H
 * 
 resizing and inital setup event listeners
 */


 import * as THREE from '/games/scripts/build/three.module.js';
 export default function() {
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
 }