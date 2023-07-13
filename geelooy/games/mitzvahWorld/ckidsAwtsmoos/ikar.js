/**
 * B"H
 * 
 */
import * as AWTSMOOS from "./awtsmoosCkidsGames.js";
import Utils from "./utils.js";
import { Eved } from "./workerDocument.js";

var w = new Eved(
    "./ckidsAwtsmoos/oyved.js",
    {
        type: "module"
    }
);


window.wk=w;
console.log("B\"H");
var canvas = document.createElement("canvas");
var container = document.getElementById("container");
container.appendChild(canvas);
var ctx = canvas.getContext("2d");

var tawfkeedeem = {
    async pawsawch() {
        
        var model = "./models/gltf/collision-world.glb";
        var loaded = await fetch(model);
        var blob = await loaded.blob();
        var url = URL.createObjectURL(blob);
        w.postMessage({
            heescheel: {
                nivrayim: {
                    Domem: {
                        world: {
                            path: url
                        }
                    }
                }
            }
        })
    },
    async heescheel(data) {
        console.log("Started!",data)
        w.postMessage("resize", {
            width:window.innerWidth,
            height:window.innerHeight
        });
        wk.postMessage({
            getBitmap:true
        })
    },
    async getBitmap(bit) {
        
        drawBitmap(bit);
    }
}

window.isGoing = true;
function drawBitmap(bit) {
    canvas.width = bit.width;
    canvas.height=bit.height;
    ctx.drawImage(bit,0, 0);
    if(window.isGoing) {
        wk.postMessage({
            getBitmap:true
        })
    }
}

w.addEventListener("message", async e => {
    
    var dayuh/*data*/ = e.data;
    if(typeof(dayuh) == "object") {
        
        await Promise.all(Object.keys(dayuh).map(async q=>{
            var tawfeek /*function to do*/
                = tawfkeedeem[q];
            if(typeof(tawfeek) == "function") {

                

                var result = await tawfeek(dayuh[q]);
                postMessage({
                    [q]: result
                })
            }
        }))
    }
}, false);


addEventListener('resize', (event) => {
	w.postMessage({"resize": {
        width:window.innerWidth,
        height:window.innerHeight
    }});
});

addEventListener('keydown', (event) => {
    var ev = Utils.clone(event)

	w.postMessage("keydown", ev);
});


addEventListener('keyup', (event) => {
	w.postMessage("keyup", Utils.clone(event));
});


addEventListener('mousedown', (event) => {
	w.postMessage("mousedown", Utils.clone(event))
});

addEventListener('mouseup', (event) => {

	w.postMessage("mouseup", Utils.clone(event))

});

document.body.addEventListener('mousemove', (event) => {
	w.postMessage("mousemove", Utils.clone(event))
});



document.addEventListener('wheel', (event) => {

	w.postMessage("wheel", Utils.clone(event))
});