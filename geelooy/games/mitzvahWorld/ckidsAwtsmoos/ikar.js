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
 * 
 * 7:13pm 7/20/2023
 * to 7:38pm
 * 
 * 7:39pm to 7:44pm
 * 7:59pm 8:14pm
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


import OlamWorkerManager from "./ikarOyvedManager.js";

console.log("B\"H");
var canvas = document.createElement("canvas");

document.body.appendChild(canvas);


var man = new OlamWorkerManager(
    "./ckidsAwtsmoos/oyved.js",
    {
        async pawsawch() {
            console.log("why?");
            
            var model = "./models/gltf/" + 
            //"beisHamikdash.glb"
            "beix.glb"
            //"collision-world.glb";
            var chos = "./models/gltf/awduhm.glb"
            var loaded = await fetch(model);
            var blob = await loaded.blob();

            var player = await fetch(chos);
            var playerB = await player.blob();
            var playerURL = URL.createObjectURL(playerB)
            var url = URL.createObjectURL(blob);
            
            man.postMessage({
                heescheel: {
                    nivrayim: {
                        Domem: {
                            world: {
                                path: url,
                                isSolid:true
                            }
                        },
                        Chossid: {
                            me: {
                                path: playerURL
                            }
                        }
                    }
                }
            });
        }
    },
    canvas
);



