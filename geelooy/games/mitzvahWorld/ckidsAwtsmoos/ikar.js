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
            
            var ID = Date.now();
            man.postMessage({
                heescheel: {
                    html: {

                        innerHTML: "B\"H\nHi!",
                        children: [
                            {
                                tag: "style",
                                innerHTML:/*css*/`
                                    .dialogue {
                                        width: 40%;
                                        height: auto;
                                        background: linear-gradient(120deg, rgba(127, 63, 152, 0.7),

                                         rgba(63, 127, 191, 0.8));
                                        border-radius: 15px;
                                        box-shadow: 0 10px 30px RGBA(0, 0, 0, 0.5),
                                         0 2px 10px rgba(0, 0, 0, 0.2);
                                        font-family: 'Arial', sans-serif;
                                        font-size: 18px;
                                        color: #ffffff;
                                        padding: 20px;
                                        animation: pulse 2s infinite;
                                        transition: all 0.3s ease-in-out;

                                        opacity: 0;
                                        visibility: hidden;
                                        transition: opacity 0.5s, visibility 0.5s;
                                        animation: contentDance 5s infinite;
                                    }

                                    .dialogue .npc {
                                        background: linear-gradient(120deg, rgba(227, 163, 252, 0.8),

                                         rgba(63, 227, 91, 0.7));
                                    }
                                    
                                    .dialogue.active {
                                        opacity: 1;
                                        visibility: visible;
                                    }
                                    
                                    @keyframes contentDance {
                                        0% {
                                            transform: scale(1);
                                        }
                                        50% {
                                            transform: scale(1.05);
                                        }
                                        100% {
                                            transform: scale(1);
                                        }
                                    }

                                    .dialogue:hover {
                                        transform: scale(1.05);
                                        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 3px 15px rgba(0, 0, 0, 0.25);
                                    }
                                    
                                    @keyframes pulse {
                                        0% {
                                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.2);
                                        }
                                        50% {
                                            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.55), 0 3px 12px rgba(0, 0, 0, 0.22);
                                        }
                                        100% {
                                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.2);
                                        }
                                    }
                                
                                `
                            },
                            {
                                shaym: "try",
                                tag: "button",
                                innerHTML: "click"
                            },
                            {
                                shaym: "msg npc",
                                style: {
                                    bottom: 20,
                                    left:25
                                },
                                className: "dialogue npc",
                            },
                            {
                                shaym: "msg chossid",
                                style: {
                                    bottom: 20,
                                    right:25
                                },
                                className: "dialogue chossid",
                            }
                        ]
                    },
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

                                    nivraNeechnas(
                                        nivra /*
                                            creation 
                                            that entered
                                        */,
                                        me
                                    ) {
                                        /**
                                         * Only interact with player
                                         */
                                        if(
                                            nivra.type != "chossid"
                                        ) return;

                                        /**a nivra
                                         * that entered interaction zone
                                         */

                                        if(me.state == "idle") {
                                            me.state = "talking";
                                            

                                             /**
                                             * Turn on dialogue
                                             * of character.
                                             * 
                                             * Opens 
                                             * system of dialogue screens
                                             * that can be navigated
                                             * with forward action and 
                                             * back action button.
                                             */
                                            var curMsg = me.currentMessage;
                                            me.on("chose", () => {
                                                curMsg = me.currentMessage;
                                                me.olam.htmlAction(
                                                    "msg npc",
                                                    {
                                                        innerText: curMsg
                                                            .message
                                                    }
                                                );


                                                var txt = "";
                                                curMsg
                                                .responses.forEach((q, i)=> {
                                                    txt += (i+1)
                                                        +". " + q
                                                        .text+"\n"
                                                });
                                                
                                                me.olam.htmlAction(
                                                    "msg chossid",
                                                    {
                                                        innerText: txt,
                                                        
                                                        
                                                    }
                                                );
                                            });
                                            
                                            me.olam.htmlAction(
                                                "msg npc",
                                                {},
                                                {
                                                    classList: {
                                                        toggle: "active"
                                                    }
                                                }
                                            );


                                            
                                            me.olam.htmlAction(
                                                "msg chossid",
                                                {},
                                                {
                                                    classList: {
                                                        toggle: "active"
                                                    }
                                                }
                                            );
                                            me.ayshPeula("chose")
                                            //me.chooseResponse(0);
                                            nivra.talkingWith = me;
                                            
                                        }
                                        
                                        
                                       
                                        console.log("Hi",nivra)
                                    },
                                    nivraYotsee(nivra, me) {
                                        /**
                                         * Only interact with player
                                         */
                                        if(
                                            nivra.type != "chossid"
                                        ) return;

                                        me.state = "idle";
                                        nivra.talkingWith = null;
                                        me.olam.htmlAction(
                                            "msg npc",
                                            {
                                                innerHTML: "bye bye!"
                                            }
                                        );
                                           
                                        me.olam.htmlAction(
                                            "msg chossid",
                                            {
                                                innerText: ""
                                            },
                                            {
                                                classList: {
                                                    toggle: "active"
                                                }
                                            }
                                        );
                                        setTimeout(() => {
                                            me.currentMessageIndex = 0;
                                            me.olam.htmlAction(
                                                "msg npc",
                                                {
                                                    innerText: ""
                                                },
                                                {
                                                    classList: {
                                                        toggle: "active"
                                                    }
                                                }
                                            );
                                        }, 500);
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



