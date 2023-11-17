/**
 * B"H
 * Worker
 * 
 * manages game state to send to main thread.
 */
//B"H

import Olam from "./worldLoader.js"
import Utils from "./utils.js"
/*
try {
    var mod = await import("./worldLoader.js")
    console.log("HI",mod, mod.Olam);
    Olam = mod.Olam
} catch(e) {
    
    console.error(e, "WOW!")
    throw e;
}*/
var inter;

// Map to keep track of resolve functions for each action
var promiseMap = new Map();


const off/*official*/ = "official"


// A function to register a promise and return a unique identifier
function registerPromise(id) {
    
    return new Promise((resolve, reject) => {
        promiseMap.set(id, { resolve, reject });
    });
}

/*local variables to use for game state*/
var me = {
    olam: null
}

var tawfkeedeem/*tasks to do*/ = {
    takeInCanvas(canvas) {
        me.olam.takeInCanvas(canvas);
        
        me.olam.heesHawvoos();

    },
    
    mouseup(e){
        if(me.olam) {
            me.olam.ayshPeula("mouseup", e);
        }
    },
    rightmousedown() {
        if(me.olam) {
            me.olam.ayshPeula("rightmousedown", e);
        }
    },
    rightmouseup() {
        if(me.olam) {
            me.olam.ayshPeula("rightmouseup", e);
        }
    },
    mousedown(e){
        if(me.olam) {
            me.olam.ayshPeula("mousedown", e);
        }
    },
    keyup(e){
        if(me.olam) {
            me.olam.ayshPeula("keyup", e);
        }
    },
    keydown(e){
        if(me.olam) {
            me.olam.ayshPeula("keydown", e);
        }
    },
    wheel(e){
        if(me.olam) {
            me.olam.ayshPeula("wheel", e);
        }
    },
    mousemove(e){
        if(me.olam) {
            me.olam.ayshPeula("mousemove", e);
        }
    },
    resize(e) {
        if(me.olam) {
            me.olam.ayshPeula("resize", e);
        }
    },
    async destroyWorld(e) {
        console.log("DEstroying",e)
        if(me.olam) {
            await me.olam.ayshPeula("destroy");
            //delete me.olam;
        }
        postMessage({
            deleteCanvas: true
        })
    },
    hi(){
        
        return "Hi"
    },

    async awtsmoosEval(code) {
        if(typeof(code) == "string") {
            var result = eval(code);
            return msg(
                "Got result of code",
                "SUCCESS",
                {code:result + ""}
            );
        }
        
    },
	
	async htmlPeula(obj={}) {
		for(const k in obj) {
			me.olam.ayshPeula("htmlPeula", {
				[k]: obj[k]
			});
		}
	},

	async htmlSet(shaym) {
		 if(!me.olam)
        return;

        me.olam.ayshPeula("htmlSet", shaym);
	},
	
    async htmlCreated(info) {
        if(!me.olam)
        return;

        me.olam.ayshPeula("htmlCreated", info);
        // Check if there is a promise to resolve
        const promiseInfo = promiseMap.get(info.id);
        
        if (promiseInfo) {
            
            if(info.id) delete info.id
            info[off] = true;
            promiseInfo.resolve(info);
            promiseMap.delete(info.id);
        }
    },
    
    htmlDeleted(info) {
        if(!me.olam)
        return;

        me.olam.ayshPeula("htmlDeleted", info);
        // Check if there is a promise to resolve
        const promiseInfo = promiseMap.get(info.id);
        
        if (promiseInfo) {
            info[off] = true;
            if(info.id) delete info.id
            promiseInfo.resolve(info);
            promiseMap.delete(info.id);
        }
    },
    htmlGot(info) {
        if(!me.olam)
        return;

        me.olam.ayshPeula("htmlGot", info);
        // Check if there is a promise to resolve
        const promiseInfo = promiseMap.get(info.id);
        
        if (promiseInfo) {
            
            info[off] = true;
            if(info.id) delete info.id
            promiseInfo.resolve(info);
            promiseMap.delete(info.id);
        }
    },

    htmlActioned(info) {
        if(!me.olam)
        return;

        me.olam.ayshPeula("htmlActioned", info);
        // Check if there is a promise to resolve
        const promiseInfo = promiseMap.get(info.id);
        
        if (promiseInfo) {
            
            info[off] = true;
            if(info.id) delete info.id
            promiseInfo.resolve(info);
            promiseMap.delete(info.id);
        }
    },
    async heescheel/*start world*/ (options={}) {
        
        me.olam = new Olam();

        me.olam.on("increased percentage", (info = {}) => {
            try {
                postMessage({
                    increasedOlamLoading: info
                })
            } catch(e) {
                console.log(e,4)
            }
        });


        me.olam.on("reset loading percentage", () => {
            postMessage({
                resetPercentage: true
            })
        })

        me.olam.on("htmlCreate", async (info={}) => {
            info.id = Math.random().toString();
            const resultPromise = registerPromise(info.id);
            postMessage({
                htmlCreate: info
            });
            const result = await resultPromise;
            // Now you can handle the result right here
            return result;
        });

        me.olam.on("switchWorlds", async (worldDayuh) => {
            
            var dayuh = Utils.stringifyFunctions(worldDayuh);
            postMessage({
                switchWorlds: dayuh
            })
        });
		
        me.olam.on("htmlDelete", async (info={}) => {
            postMessage({
                htmlDelete: info
            })
        })
		
        me.olam.on("setHtml", async ({shaym,info={}}={}) => {
            var dayuh = Utils.stringifyFunctions(info);
            info.id = Math.random().toString();
            const resultPromise = registerPromise(info.id);
            
            postMessage({
                setHtml: {
					shaym,
					dayuh
				}
            });
            const result = await resultPromise;
            // Now you can handle the result right here
            return result;
        });


        me.olam.on("htmlAction", async (info={}) => {
            
            info.id = Math.random().toString();
            const resultPromise = registerPromise(info.id);
            postMessage({
                htmlAction: info
            });
            const result = await resultPromise;
            // Now you can handle the result right here
            return result;
        });

        me.olam.on("htmlGet", async (info={}) => {
            
            info.id = Math.random().toString();
            const resultPromise = registerPromise(info.id);
            postMessage({
                htmlGet: info
            })
            
            const result = await resultPromise;
            // Now you can handle the result right here
            return result;
        })
        
        var result;
        try {
            
            result = await me.olam.tzimtzum(options);

        } catch(e) {
            console.log("Awtsmoos erro:" ,e)
            return msg(
                "There was an error.",
                "ERROR",
                {error:e}
            )
        }
        if(result) {
            me.olam.on("mouseLock", () => {
                postMessage({
                    lockMouse: true
                });
            });
            me.olam.on("mouseRelease", () => {
                postMessage({
                    lockMouse: false
                });
            });

            

            return msg(
                "Successfully made me.olam",
                "OLAM_GOOD"
            );
        }
    },

    async getBitmap(toRender=false) {
        if(me.olam && me.olam.renderer && me.olam.renderer.domElement) {
            var can = me.olam.renderer.domElement;
            if(toRender) {
                me.olam.heesHawvoos();
            }
            var bit = null;
            bit = can.transferToImageBitmap();
            return {
                tawchlees: bit,
                transfer: true
            }
        }
    },
    async getCanvas() {
        if(me.olam && me.olam.renderer && me.olam.renderer.domElement) {
            var can = me.olam.renderer.domElement;
            
            return me.olam.renderer.domElement;
        }
    },
    async getOlam() {
        if(me.olam !== null && me.olam.serialize) {
            return {tawchlees:me.olam.serialize()};
        }
    }
};

function msg(message, code, extra={}) /*generates message 
object to send back*/{
    
    return {tawchlees:{
        message,
        code,
        ...extra
    }}
}



addEventListener("message", async e=> {
    var dayuh/*data*/ = e.data;
    if(typeof(dayuh) == "object") {
        
        try {
            for(const q of Object.keys(dayuh)) {
                var tawfeek /*function to do*/
                    = tawfkeedeem[q];
                if(typeof(tawfeek) == "function") {
                    var result = await tawfeek(dayuh[q]);
                    
                    var tawch;
                    if(!result) result = {};
                    if( result.tawchlees) {
                        tawch = result.tawchlees
                    };
                    
                    var shouldITransfer = !!result.transfer;
                    postMessage({
                        [q]: tawch
                    }, shouldITransfer?[tawch]: undefined)
                }
            }
        } catch(e) {
            console.log(e)
        }
    }
})

postMessage({
    pawsawch/*opened*/:true
})
