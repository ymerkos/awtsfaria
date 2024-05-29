/**
 * B"H
 * 
 * methods related to initally setting up the main (and/or minimap) canvas(es)
 */
import PostProcessingManager from 
"../../postProcessing/postProcessing.js";

import Environment from "../../postProcessing/environment.js";

export default class {

	
    


    /** 
     * In the tale of Ayin's quest to illuminate the world,
     * The canvas is our stage, where the story is unfurled.
     * @param {HTMLCanvasElement} canvas - The stage where the graphics will dance.
     * @example
     * takeInCanvas(document.querySelector('#myCanvas'));
     */
    takeInCanvas(canvas, devicePixelRatio = 1) {
       
            
        // With antialias as true, the rendering is smooth, never crass,
        // We attach it to the given canvas, our window to the graphic mass.
        var temp = this.rendererTemplate(
            canvas
        )
        console.log(temp,canvas,"Minimap?")
        this.renderer = new temp({ antialias: true, canvas: canvas });
        if(!this.renderer.compute) this.renderer.compute = () => {}
        if(!this.renderer.renderAsync) {
		this.renderer.clearAsync=this.renderer.clear;



	
            this.renderer.renderAsync = this.renderer.render;
        }
        this.environment = new Environment({
            scene: this.scene
            ,
            renderer: this.renderer,
            camera: this.ayin.camera
        });

        this.renderer.setPixelRatio(
            devicePixelRatio
        )
        //this.renderer.autoClear = false;
        var renderer = this.renderer
       // renderer.shadowMap.enabled = true;
       // renderer.shadowMap.type = THREE.PCFSoftShadowMap;


       
        // On this stage we size, dimensions to unfurl,
        // Setting the width and height of our graphic world.
      //  this.setSize(this.width, this.height);
        this.ayshPeula("canvased")
         /**
         * other effects
         */
      
        /*this.composer = new EffectComposer(this.renderer);
        var renderPass = new RenderPass(
            this.scene,
            this.camera
        );
        this.composer.addPass(renderPass);
        */
    }

    postprocessingSetup() {
        if(!this.postprocessing)
            this.postprocessing = new PostProcessingManager({
                camera: this.camera,
                scene: this.scene,
                renderer: this.renderer,
                width: this.width,
                height: this.height
            });
        this.postprocessing.postprocessingSetup();
        
    }

    postprocessingRender() {
        if(!this.postprocessing)
            return;

        var rend = this.postprocessing.postprocessingRender();
     
        return rend

    }

    adjustPostProcessing() {
        if(!this.postprocessing)
            return;

        this.postprocessing.setSize({
            width: this.width,
            height: this.height
        })
    }
    /** 
     * As the eyes grow wider, or squint in the light,
     * Our view changes size, adjusting to the sight.
     * @param {Number|Object} vOrWidth - The width of the canvas or an object containing width and height.
     * @param {Number} [height] - The height of the canvas.
     * @example
     * setSize(800, 600);
     * // or 
     * setSize({width: 800, height: 600});
     */
    async setSize(vOrWidth={}, height) {
        let width;

        // If we're given a number, it's simple, it's plain,
        // That's our width, assigned without pain.
        if(typeof vOrWidth === "number") {
            width = vOrWidth;
        } 
        // If instead we're given an object, never fear,
        // Destructure its properties, making width and height clear.
        else if (typeof vOrWidth === "object") {
            ({width, height} = vOrWidth);
        }

        /**
         * Calculate aspect
         * ratio to keep canvas
         * resized at specific ratio
         * so camera angles
         * don't get messed up.
         */

        var desiredAspectRatio = this.ASPECT_X / this.ASPECT_Y;
        let oWidth = width; //original Width
        let oHeight = height;
        // Calculate new width and height
        let newWidth = width;
        let newHeight = height;
        //console.log("Aspect ratio",width,height,width/height,desiredAspectRatio,ASPECT_X)
        if (width / height > desiredAspectRatio) {
           
            // total width is wider than desired aspect ratio
            newWidth = height * desiredAspectRatio;
            if(this.rendered) {
                await this.ayshPeula("htmlAction", {
                    shaym: "main av",
                    methods: {
                        classList: {
                            remove: "sideInGame",
                            add: "horizontalInGame"
                        }
                    }
                });
            }
        } else {
            if(this.rendered) {
                await this.ayshPeula("htmlAction", {
                    shaym: "main av",
                    methods: {
                        classList: {
                            add: "sideInGame",
                            remove: "horizontalInGame"
                        }
                    }
                });
            }
            // total width is taller than desired aspect ratio
            newHeight = width / desiredAspectRatio;
        }

        this.width = newWidth;
        this.height = newHeight;
		
	
        width = newWidth;
        height = newHeight;
        this.ayshPeula("alert", "size setting in function actually",width,height)
        // When both dimensions are numbers, the world is alright,
        // We can set our renderer's size, aligning the sight.
        if(typeof width === "number" && typeof height === "number" ) {
            
            if(this.renderer) {
                this.ayshPeula(
                    "alert", 
                    "set size of renderer ",width,height
                )
                console.log("About to set size",width,height)
                // Updates the size of the renderer context in pixels and let the canvas's style width and height be managed by CSS (the third parameter, false).
                this.renderer.setSize(width, height, false);
            } else {
                this.ayshPeula("alert", "didnt set renderer!")
            }
            
            await this.updateHtmlOverlaySize(
                width, height, 
                desiredAspectRatio
            );

            await this.getBoundingRect()
            //console.log("RESIZE info",info)

            this.adjustPostProcessing();
            
        }

        this.refreshCameraAspect()
    }

    async getBoundingRect() {
        var info = await this.ayshPeula("htmlAction", {
            shaym: "ikarGameMenu",
            methods: {
                getBoundingClientRect: true
            }
        });

        if(info[0]) {
            var rect = info[0]
                ?.methodsCalled
                ?.getBoundingClientRect;
            if(rect) {
                this.boundingRect = rect;
            }

        }
    }
    async updateHtmlOverlaySize(width, height) {
        
        
		var differenceFromOriginalX = width / this.ASPECT_X;
		var difFromOriginalY = this.ASPECT_Y / height;

        await this.ayshPeula(
            "htmlAction", 
            {
                shaym: `main av`,
                properties: {
                    style: {
                        width:width+"px",
                        height:height+"px"
                    }
                }
            }
        );
        // Set the overlay's style to match the canvas's dimensions and position
        if(this.rendered) 
            await this.ayshPeula(
                "htmlAction", {
                    shaym: `ikarGameMenu`,
                    properties: {
                        style: {
                            transform: `scale(${
                                differenceFromOriginalX
                            })`
                        }
                    }
                }
            );

        this.rendered
            await this.ayshPeula(
                "htmlAction", {
                    shaym: `av`,
                    properties: {
                        style: {
                            width:width+'px',
                            height:height+'px'
                        }
                    }
                }
            );
    }
}