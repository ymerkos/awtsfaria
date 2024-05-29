/**
 * B"H
 * the initial "tzimtzum" setup method for Olam
 */

export default class {
    async tzimtzum/*go, create world and load things*/(info = {}) {

        
        
        await this.ayshPeula("alert", "Starting tzimtzum")
        try {
            var on = info.on;
            if(typeof(on) == "object") {
                Object.keys(on)
                .forEach(q=> {
                    this.on(q, on[q]);
                })
                

            }

            if(info.shaym) {
                if(!this.shaym)
                    this.shaym = info.shaym;
            }


            
            await this.loadHebrewFonts();
            if(!info.nivrayim) {
                info.nivrayim = {}
            }
            
            // Load components if any
            if (info.components) {
                await this.loadComponents(info.components);
            }

            if(info.vars) {
                try {
                    this.vars = {...info.vars}
                } catch(e) {}
            }
            if(
                info.assets
            ) {
                this.setAssets(info.assets);
            }

            if(info.modules) {
                await this.getModules(info.modules)
            }
            

            if(info.html) {
                var style = null
                    
                
                if(!this.styled) { 
                    style = {
                        tag: "style",
                        innerHTML:/*css*/`
                            .ikarGameMenu {
                                
                                overflow: hidden;
                                position: absolute;
                                transform-origin:top left;
                                
                                width:${this.ASPECT_X}px;
                                height:${this.ASPECT_Y}px;
                                top: 0;
                                left: 0;
                            }

                            .gameUi > div {
                                position:absolute;
                            }
                        `
                    };
                    this.styled = true;
                }
                

                var par = {
                    shaym: `ikarGameMenu`,
                    parent: "main av",
                    children: [
                        info.html,
                        style
                    ],
                    ready(me, c) {
                        
                    },

                    className: `ikarGameMenu`
                }
                
                
                
            
                var cr = await this.ayshPeula(
                    "htmlCreate",
                    par
                );

                
                
                this.htmlUI = par;
            }

            /**
             * Load the creations specified in the tzimtzum (start)
             */
            var loaded;
            try {
                
                await this.ayshPeula("alert", "Starting to load nivrayim")
                
                loaded = await this.loadNivrayim(info.nivrayim);
                
                await this.ayshPeula("alert", "finished loading nivrayim and scene")
            } catch(e) {
                
                await this.ayshPeula("alert", "Problem in loading nv")
                console.log("Error",e)
                this.ayshPeula("error", {
                    code: "NO_LOAD_NIVRAYIM",
                    details: e,
                    message: "Couldn't load the Nivrayim"
                })
                return;
            }
            var st = info.gameState[this.shaym];
            if(st && st.shaym == this.shaym) {
                await this.ayshPeula("alert", "setting game state")
                var set = this.setGameState(st);
                
            } else {
                await this.ayshPeula("alert", "loading level for first time")
                
            }
            this.ayshPeula("ready", this, loaded);
            this.ayshPeula(
                "reset loading percentage"
            );
            this.ayshPeula(
                "setup map"
            )
            await this.ayshPeula("alert", "officially ready, hid loading screen")
            return loaded;
        } catch(e) {
            
            await this.ayshPeula("alert", "Problem in tzimtzum")
            console.log("Error",e)
            this.ayshPeula("error", {
                code: "ISSUE_IN_TZIMTZUM",
                details: e,
                message: "Some issue in the Tzimtzum not "
                +"related to Nivrayim loading"
            })
        }
    }
}