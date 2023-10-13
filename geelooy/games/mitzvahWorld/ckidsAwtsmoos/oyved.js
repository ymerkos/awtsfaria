/**
 * B"H
 * Worker
 * 
 * manages game state to send to main thread.
 */
//B"H

import Olam from "./worldLoader.js"
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
var olam = null;
var tawfkeedeem/*tasks to do*/ = {
    takeInCanvas(canvas) {
        olam.takeInCanvas(canvas);
        
        olam.heesHawvoos();

    },
    mouseup(e){
        if(olam) {
            olam.ayshPeula("mouseup", e);
        }
    },
    rightmousedown() {
        if(olam) {
            olam.ayshPeula("rightmousedown", e);
        }
    },
    rightmouseup() {
        if(olam) {
            olam.ayshPeula("rightmouseup", e);
        }
    },
    mousedown(e){
        if(olam) {
            olam.ayshPeula("mousedown", e);
        }
    },
    keyup(e){
        if(olam) {
            olam.ayshPeula("keyup", e);
        }
    },
    keydown(e){
        if(olam) {
            olam.ayshPeula("keydown", e);
        }
    },
    wheel(e){
        if(olam) {
            olam.ayshPeula("wheel", e);
        }
    },
    mousemove(e){
        if(olam) {
            olam.ayshPeula("mousemove", e);
        }
    },
    resize(e) {
        if(olam) {
            olam.ayshPeula("resize", e);
        }
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

    async htmlCreated(info) {
        if(!olam)
        return;

        olam.ayshPeula("htmlCreated", info);
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
        if(!olam)
        return;

        olam.ayshPeula("htmlDeleted", info);
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
        if(!olam)
        return;

        olam.ayshPeula("htmlGot", info);
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
        if(!olam)
        return;

        olam.ayshPeula("htmlActioned", info);
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
        
        olam = new Olam();
        olam.on("htmlCreate", async (info={}) => {
            info.id = Math.random().toString();
            const resultPromise = registerPromise(info.id);
            postMessage({
                htmlCreate: info
            });
            const result = await resultPromise;
            // Now you can handle the result right here
            return result;
        });

        olam.on("htmlAction", async (info={}) => {
            
            info.id = Math.random().toString();
            const resultPromise = registerPromise(info.id);
            postMessage({
                htmlAction: info
            });
            const result = await resultPromise;
            // Now you can handle the result right here
            return result;
        });

        olam.on("htmlGet", async (info={}) => {
            
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
            
            result = await olam.tzimtzum(options);

        } catch(e) {
            console.log("Awtsmoos erro:" ,e)
            return msg(
                "There was an error.",
                "ERROR",
                {error:e}
            )
        }
        if(result) {
            olam.on("mouseLock", () => {
                postMessage({
                    lockMouse: true
                });
            });
            olam.on("mouseRelease", () => {
                postMessage({
                    lockMouse: false
                });
            });

            

            return msg(
                "Successfully made olam",
                "OLAM_GOOD"
            );
        }
    },

    async getBitmap(toRender=false) {
        if(olam && olam.renderer && olam.renderer.domElement) {
            var can = olam.renderer.domElement;
            if(toRender) {
                olam.heesHawvoos();
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
        if(olam && olam.renderer && olam.renderer.domElement) {
            var can = olam.renderer.domElement;
            
            return olam.renderer.domElement;
        }
    },
    async getOlam() {
        if(olam !== null && olam.serialize) {
            return {tawchlees:olam.serialize()};
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
