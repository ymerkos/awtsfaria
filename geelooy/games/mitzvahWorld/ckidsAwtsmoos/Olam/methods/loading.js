/** 
 * B"H
 * methods related to inital load
*/

export default class {
    /**
     * Load a component and store it in the components property.
     * Components are raw data loaded from a server
     * or stored as static assets directly.
     * @param {String} shaym - The name of the component.
     * @param {String} url - The URL of the component's model.
     */
    async loadComponent(shaym, url) {
        if(typeof(url) == "string") {
            var self = this;
            // Fetch the model data
            var response = await this.fetchWithProgress(url, null, {
                async onProgress(p) {
                    var size = self.componentSizes[shaym];
                    var ttl = self.totalComponentSize;

                    if(!size) return;

                    var myPercent = size / ttl;

                    await self.ayshPeula("increase loading percentage", {
                        amount: 100 * p * myPercent,
                        action: "Loading component: "+ shaym + ". ",
                       // subAction: (myPercent * 100).toFixed(2) + "%"
                    })

                   
                }
            });

            // Check if the fetch was successful
            if (!response.ok) {
                throw new Error(`Failed to fetch the model from "${url}"`);
            }

            // Get the model data as a Blob
            var blob = await response.blob();

            // Create a URL for the Blob
            var blobUrl = URL.createObjectURL(blob);

            // Store the blob URL in the components property
            this.components[shaym] = blobUrl;
        }

        if(typeof(url) == "object" && url) {
            this.components[shaym] = url;
        }

        if(typeof(url) == "function") {
            var res = await url(this);
            this.components[shaym] = res;
        }

        return shaym;
        
    }

    /**
     * Retrieve a component by its name.
     * @param {String} shaym - The name of the component.
     * @returns {Object|undefined} - The component's data URL, or undefined if the component is not found.
     */
    getComponent(shaym) {
        if(typeof(shaym) != "string") return;

        var awts = shaym.startsWith("awtsmoos://");
        if(awts)
            return this.components[
                shaym.slice(11)
            ];
        var awtsVar = shaym.startsWith("awtsmoos.vars");
        if(awtsVar) {
            return this.vars[
                shaym.slice(16)
            ];
        }
        else return shaym;
    }

    $gc(shaym) {
        return this.getComponent(shaym)
    }

    async loadComponents(components) {
        /**
         * first, get total components size
         * fetchGetSize
         */
        var ent = Object.entries(components);
        var sizes = {}
        var componentSize = 0;
        for(var [shaym, url] of ent) {
            var size = await this.fetchGetSize(url)
            sizes[shaym] = size
            componentSize += size;
        }
        this.totalComponentSize = componentSize;
        this.componentSizes = sizes;
        //console.log("COMP SIZES",sizes)
        for (var [shaym, url] of ent) {
            await this.loadComponent(shaym, url);
        }
    }

    modules = {};
    async getModules(modules={}) {
        if(typeof(modules) != "object" || !modules) {
            return;
        }

        var getModulesInValue = async modules => {
            var ks = Object.keys(modules);
            var modulesAdded = {};
            for(var key of ks) {
                
                var v = modules[key];
                if(typeof(v) == "object") {
                    var subModules = await getModulesInValue(v);
                    modulesAdded[key] = subModules;
                   
                } else if(typeof(v) == "string") {
                    var mod = await this.getModule(v, {others:ks,name:key});
                    modulesAdded[key] = mod;
                    
                }
            }
            return modulesAdded;
        };

        var mods = await getModulesInValue(modules);
        if(mods) {
            this.modules = {
                ...this.modules,
                ...mods
            }
        }
        return mods;



        
    }

    async getModule(href, {others, name}) {
        if(
            typeof(href) != "string"
        ) return;
        var perc = 1 / others.length;
        var ob  = null;
        this.ayshPeula("increase loading percentage", {
            amount: perc * 100,
            action: "Loading Modules...",
            subAction: "Module: " + name
        });
        try {
            ob = await import(href);
            if(ob && typeof(ob) != "object") {
                return
            }
            if(!ob.default) {
                return
            }
            return ob.default;
        } catch(e) {
            console.log(e);
            return null;
        }


        

        
    }


    /**
     * @method setAsset simply
     * loads in the instantiated
     * JS object (or other raw data)
     * into the world's assets for later use
     * and local caching. Does not include
     * remote resources. For remote -  see
     * components.
     * @param {String} shaym 
     * @param {*} data 
     */
    setAsset(shaym, data) {
        this.assets[shaym] = data;
    }

    /**
     * @method $ga short for 
     * getAsset.
     * @param {String} shaym 
     */
    $ga(shaym) {
        return this.getAsset(shaym);
    }

    getAsset(shaym) {
        return this.assets[shaym] || null;
    }

    setAssets(assets = {}) {
        if(
            typeof(assets) != "object" ||
            !assets
        ) {
            return;
        }
        Object.keys(assets)
        .forEach(k => {
            this.assets[k] =
            assets[k]
        });
    }

    constructor()  {
        
    }
}