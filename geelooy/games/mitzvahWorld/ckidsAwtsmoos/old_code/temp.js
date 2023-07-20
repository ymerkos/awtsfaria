//B"H

import * as THREE from "three";
import Olam from "../worldLoader.js"
import * as AWTSMOOS from "../awtsmoosCkidsGames.js";
console.log("hi")
/*local variables to use for game state*/
var olam = null;
var tawfkeedeem/*tasks to do*/ = {
    hi(){
        console.log("234")
        return "Hi"
    },
    async heescheel/*start world*/ (options={}) {
        console.log("started");
        olam = new Olam();
        var result = await olam.tzimtzum(options);
        if(result) {
            return msg(
                "Successfully made olam",
                "OLAM_GOOD"
            );
        }
    },
    async getOlam() {
        if(olam !== null && olam.serialize) {
            return olam.serialize();
        }
    }
};

function msg(message, code) /*generates message 
object to send back*/{
    return {
        message,
        code
    }
}

addEventListener("message", async e=> {
    var dayuh/*data*/ = e.data;
    if(typeof(dayuh) == "object") {
        console.log("Got it, going", dayuh)
        await Promise.all(Object.keys(dayuh).map(async q=>{
            var tawfeek /*function to do*/
                = tawfkeedeem[q];
            if(typeof(tawfeek) == "function") {

                console.log("Trying",tawfeek)
                var result = await tawfeek(dayuh[q]);
                postMessage({
                    [q]: result
                })
            }
        }))
    }
})

postMessage({
    pawsawch/*opened*/:true
})