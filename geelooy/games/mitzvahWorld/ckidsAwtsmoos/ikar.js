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
    async takeInCanvas() {
        console.log("took in");
        w.postMessage("resize", {
            width:window.innerWidth,
            height:window.innerHeight
        });
    },
    async heescheel(data) {
        console.log("Started!",data);
        
        var off = canvas.transferControlToOffscreen();
        w.postMessage({
            takeInCanvas: off
        }, [off]);

    },
    async getBitmap(bit) {
        
    }
}

window.isGoing = true;
function drawBitmap(bit) {
    
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

addEventListener('mousemove', (event) => {
	w.postMessage("mousemove", Utils.clone(event))
});



addEventListener('wheel', (event) => {

	w.postMessage("wheel", Utils.clone(event))
});