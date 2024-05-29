/**
 * B"H
 */

import MinimapPostprocessing from '../../postProcessing/minimap.js';
export default function() {
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

        if(!this.minimap) return console.log("NOPE!",this);;
        this.minimap.zoom += amount
    });

    this.on("minimap zoom out", (amount = 0.25) => {

        if(!this.minimap) return console.log("NOPE!",this);
        this.minimap.zoom -= amount
    });

    this.on("captureMinimapScene", async () => {
        if(!this.minimap) return  console.log("NOPE!",this);;
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
}