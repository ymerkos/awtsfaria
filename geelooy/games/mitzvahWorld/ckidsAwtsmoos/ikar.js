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
            
            man.postMessage({
                heescheel: {
                    components: {
                        player: "../models/gltf/awduhm.glb",
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
                                isSolid:true
                            }
                        },
                        Chai: {
                            cow: {
                                path: "awtsmoos://cow",
                                name:"Parah",
                                on: {
                                    heescheel(me) {
                                        console.log("Cow!",me.name,me)
                                        

                                    },
                                    ready(me) {
                                        me.heesHawveh = true;
                                        console.log(
                                            "Cw",me,
                                            Object.entries(me.events)
                                            .map(
                                                q=>[
                                                    q[0]+""
                                                    ,
                                                    q[1]+""
                                                ]
                                            )
                                        );

                                    },
                                    constructed(me) {
                                        console.log("22")
                                    },
                                    heesHawvoos(me) {
                                       // console.log("lol")
                                       me.playChaweeyoos(
                                            "walk"
                                        );
                                    }
                                }
                            }
                        },
                        Chossid: {
                            me: {
                                name:"co",
                                path: "awtsmoos://player"
                            }
                        }
                    }
                }
            });
        }
    },
    canvas
);



