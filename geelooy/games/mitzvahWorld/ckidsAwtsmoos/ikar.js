/**
 * B"H
 * 7:42-9:908
 * 
 * 9:09-9:22
 * 
 * 9:24 - 11:56
 * 
 * 11:57 2:06am
 * 
 * 2:07am - 2:33am
 */
/*
var wk = new Worker("ikar_worker2.js", {
    type: "module"
});

var canvas  = document.createElement("canvas");
var c = document.getElementById("container")
c.appendChild(canvas)
wk.onmessage = e=>{
    console.log(e.data);
    if(e.data == "start") {
        wk.postMessage(canvas, [canvas]);
    }
}*/

/**
 * B"H
 * 
 */

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
document.body.appendChild(canvas);

var tawfkeedeem = {
    async pawsawch() {
        
        var model = "./models/gltf/collision-world.glb";
        var chos = "./models/gltf/awduhm.glb"
        var loaded = await fetch(model);
        var blob = await loaded.blob();

        var player = await fetch(chos);
        var playerB = await player.blob();
        var playerURL = URL.createObjectURL(playerB)
        var url = URL.createObjectURL(blob);
        w.postMessage({
            awts:true,
            heescheel: {
                nivrayim: {
					Chossid: {
						me: {
                            path: playerURL,
                            
                        }
					},
                    Domem: {
                        world: {
                            path: url,
							isSolid:true
                        }
                    }
                }
            }
        })
    },
    async takeInCanvas() {
        console.log("took in");
        w.postMessage("resize", {
            width:innerWidth,
            height:innerHeight
        });
        w.postMessage({"pixelRatio": window.devicePixelRatio});
    },
    lockMouse(doIt) {
        if(doIt) {
            document.body.requestPointerLock();
        } else {
            document.exitPointerLock();
        }
    },
    async heescheel(data) {
        console.log("Started!",data);
        
        var off = canvas.transferControlToOffscreen();
        w.postMessage({
            takeInCanvas: off
        }, [off]);

    },
}

w.addEventListener("message", async e => {
    
    var dayuh/*data*/ = e.data;
    if(typeof(dayuh) == "object") {
      //  Utils.evalStringifiedFunctions(dayuh);
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
        width:innerWidth,
        height:innerHeight
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