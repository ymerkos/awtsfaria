/**
 * B"H
 * Worker
 * 
 * manages game state to send to main thread.
 */
//B"H

import * as THREE from "/games/scripts/build/three.module.js";
import Olam from "./worldLoader.js"
import * as AWTSMOOS from "./awtsmoosCkidsGames.js";



/*local variables to use for game state*/
var olam = null;
var tawfkeedeem/*tasks to do*/ = {
    mouseup(e){
        if(olam) {
            olam.ayshPeula("mouseup", e);
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
        console.log(e)
        if(olam) {
            console.log(33,e)
            olam.ayshPeula("resize", e);
        }
    },
    hi(){
        console.log("234")
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
    async heescheel/*start world*/ (options={}) {
        
        olam = new Olam();
        var result;
        try {
            
            result = await olam.tzimtzum(options);
        } catch(e) {
            console.log(e)
            return msg(
                "There was an error.",
                "ERROR",
                {error:e}
            )
        }
        if(result) {
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
            var bit = can.transferToImageBitmap();
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
        
        await Promise.all(Object.keys(dayuh).map(async q=>{
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
        }))
    }
})

postMessage({
    pawsawch/*opened*/:true
})

postMessage("hi");