/**
 * B"H
 * 
 * methods related to the constant
 * game update and rendering
 */

export default class {

    velz = 0;
    deltaTime = 1;
    async heesHawvoos() {
        var self = this;
        var firstTime = false;
        // This will be the loop we call every frame.
        async function go(time) {
             // Delta time (in seconds) is the amount of time that has passed since the last frame.
            // We limit it to a max of 0.1 seconds to avoid large jumps if the frame rate drops.
            // We divide by STEPS_PER_FRAME to get the time step for each physics update.
            // Note: We moved the calculation inside the loop to ensure it's up to date.
            
            self.deltaTime = Math.min(0.1, self.clock.getDelta())
             // The physics updates.
            // We do this STEPS_PER_FRAME times to ensure consistent behavior even if the frame rate varies.
            var envRendered = false//self.environment.update(self.deltaTime)
            if(self.shlichusHandler) {
                self.shlichusHandler.update(self.deltaTime)
            }

            if(self.mayim) {
                self.mayim.forEach(w => {
                    w.material.uniforms[ 'time' ].value += 1.0 / 60.0;
                })
            }
                

                
   
                if(self.nivrayim) {
                    self.nivrayim.forEach(n => 
                        n.isReady && 
                        (n.heesHawveh?
                        n.heesHawvoos(self.deltaTime) : 0)
                    );
                }

            

                self.ayin.update(self.deltaTime);


                

                
                
            

            if(self.coby&&self.postprocessing) {
                var rend = false//self.postprocessingRender();
                if(!rend) realRender(time);
            } else {
                realRender(time)
            }

            

            
            var frames = 0;
            async function realRender() {
              
                // The rendering. This is done once per frame.
                if(!firstTime) {
                    firstTime = true;
                    self.ayshPeula("rendered first time")
                    self.ayshPeula("alert", "First time rendering " + self.renderer)
                }
                if(self.renderer) {
                    
                    if(!envRendered) {
                        
                        self.renderer.renderAsync(
                            self.scene,
                            self.activeCamera
                            ||
                            self.ayin.camera
                        );
                    }

                    
                }
                if(self.hoveredNivra) {
                    
                    /*
                    self.ayshPeula("mousemove", {
                        clientX: self.achbar.x,
                        clientY: self.achbar.y
                    })*/
                }
                
            }
            
            if(!self.destroyed)
                // Ask the browser to call go again, next frame
                requestAnimationFrame(go);
        }
        
        requestAnimationFrame(go);
    }

    async renderMinimap() {
        async function minimapRender() {
            if(self.minimap) {
            //    await self.minimap.render()
            }
            
        }
        
       // requestAnimationFrame(minimapRender);
    }
}
