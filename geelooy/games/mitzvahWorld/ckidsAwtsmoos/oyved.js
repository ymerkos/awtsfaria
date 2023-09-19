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
    htmlCreated(info) {
        if(!olam)
        return;

        olam.ayshPeula("htmlCreated", info);
    },
    
    htmlDeleted(info) {
        if(!olam)
        return;

        olam.ayshPeula("htmlDeleted", info);
    },

    htmlGot(info) {
        if(!olam)
        return;

        olam.ayshPeula("htmlGot", info);
    },

    htmlActioned(info) {
        if(!olam)
        return;

        olam.ayshPeula("htmlActioned", info);
    },
    async heescheel/*start world*/ (options={}) {
        
        olam = new Olam();
        olam.on("htmlCreate", (info={}) => {
            
            postMessage({
                htmlCreate: info
            });
        });

        olam.on("htmlAction", info => {
            postMessage({
                htmlAction: info
            });
        });
        
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
