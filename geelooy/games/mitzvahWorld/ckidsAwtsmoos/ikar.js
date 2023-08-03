/**
 * B"H
 * 7:42-9:08
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
            
            
            man.postMessage({
                heescheel: {
                    components: {
                        awduhm: "../models/gltf/awduhm.glb",
                        world: "../models/gltf/" + 
                           // "beisHamikdash.glb"
                            "collision-world.glb"
                            ,
                        cow: "../models/gltf/cow.glb"
                    },
                    nivrayim: {
                        Domem: {
                            world: {
                                name: "me",
                                path: "awtsmoos://world",
                                isSolid:true,
                                position: {
                                    x:10
                                }
                            }
                        },
                        Chai: {
                           
                        },
                        Chossid: {
                            me: {
                                name:"co",
                                interactable: true,
                                path: "awtsmoos://awduhm",
                                position: {
                                    x:25
                                }
                            }
                        },
                        Medabeir: {
                            him: {
                                name: "ok",
                                path: "awtsmoos://awduhm",
                                proximity:1,
                                on: {
                                    ready(me) {
                                        console.log(me,2,me.name,me.proximity)
                                        me.playChayoos("stand");
                                    },
                                    nivraNeechnas(nivra) {
                                        /**a nivra
                                         * that entered interaction zone
                                         */

                                        console.log("Hi",nivra)
                                    },
                                    nivraYotsee(nivra) {
                                        console.log("Bye!", nivra);
                                    }
                                }
                            },
                            
                        }
                    }
                }
            });
        }
    },
    canvas
);



