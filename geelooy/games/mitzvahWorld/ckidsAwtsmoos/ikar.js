/**
 * B"H

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


                        
                        children: [
                            {
                                tag: "style",
                                innerHTML:/*css*/`
                                    .dialogue {
                                        width: 30%;
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

                                    .selected {
                                        box-shadow: 0 10px 30px RGBA(0, 0, 0, 0.5),
                                         0 2px 10px rgba(0, 0, 0, 0.2) inset;
                                    }

                                    .dialogue .chossid > div:hover {
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
                                innerText: `
                                WASD or arrow keys to move (no mobile as of yet).

                                Q and E to stride side to side.
                                
                                Mouse + left click to move camera.

                                Left + right click to move character via mouse.

                                just right click hold to rotate character.

                                F and R keys to pan camera up or down.

                                C to toggle messages. Enter to select.

                                T to switch between FPS and Third Person mode.

                                
                                `,
                                style: {
                                    left:26,
                                    top:26
                                }
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
                           // "../models/gltf/beisHamikdash.glb"
                           "world2.glb"
                           // "collision-world.glb"
                            ,
                        cow: "../models/gltf/cow.glb"
                    },
                    nivrayim: {
                        Domem: {
                            
                            world: {
                                name: "me",
                                path: "awtsmoos://world",
                                isSolid:true,
                                
                                on: {
                                        ready(d) {
                                           console.log("Hi!",d) 
                                        }
                                }
                            }
                            
                        },
                        Chai: {
                           
                        },
                        Chossid: {
                            me: {
                                name:"player",
                                placeholderName: "player",
                                interactable: true,
                                path: "awtsmoos://awduhm",
                                position: {
                                    x:25
                                }
                            }
                        },
                        Medabeir: {
                            him: {
                                name: "npc_1",
                                placeholderName: "npc_1",
                                path: "awtsmoos://awduhm",
                                proximity:3,
                                messageTree: [
                                    {
                                        message: "B\"H\n"+
                                        "Hi! How are you today?",
                                        
                                        responses: [
                                            {
                                                text: "Tell me more about this place.",
                                                nextMessageIndex: 1
                                            },
                                            {
                                                text: "I'm just browsing.",
                                                action(me) {
                                                    me.ayshPeula("close dialogue", "Browse away!");
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        message: "This place is a hub for adventurers like you!",
                                        responses: [
                                            {
                                                text: "That's interesting. What else?",
                                                nextMessageIndex: 2
                                            },
                                            {
                                                text: "Thanks for the info.",
                                                action(me)  {
                                                    // Some custom action, for example:
                                                    me.ayshPeula("close dialogue", "You're welcome!");
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        message: "I have a special shlichus for you. \n" + 
                                            "Will you accept it?",
                                        responses: [
                                            {
                                                text: "What's in it for me?",
                                                nextMessageIndex:3
                                            },
                                            {
                                                text: "No",
                                                action(me)  {
                                                    me.ayshPeula("close dialogue", "One day we'll see");
                                                }
                                            }
                                        ]
                                    },
                                    {

                                        message: "The poor of this city need help for Shabbos" 
                                        +". Go out and collect"
                                        +" 5 perutahs so we can give them to Tzedaka, then bring them back here.",
                                        responses: [
                                            {
                                                text: "Ok, sounds good.",
                                                action(me, nivraTalkingTo) {
                                                    /**
                                                     * Upon the player's acceptance of the shlichus,
                                                     * the mission is activated, and the player is
                                                     * bound to a divine task, guided by the Awtsmoos.
                                                     *
                                                     * The shlichus becomes a living part of the player's
                                                     * journey, a quest that transcends the digital realm,
                                                     * echoing the eternal dance between the finite and the infinite.
                                                     */
                                                    
                                                    me.addCoins(5)
                                                    

                                                    
                                                }
                                            },
                                            {
                                                text: "No thanks, I've got things to do.",
                                                action(me, nivraTalkingTo) {
                                                    me.ayshPeula("close dialogue", 
                                                    
                                                    "You'll come around sooner or later, "
                                                    +"there's nothing else to do here.");
                                                }
                                            }
                                        ]
                                    }
                                    
                                    
                                ],
                                on: {
                                    ready(me) {
                                        me. addCoins = function(num) {
                                            var coins = Array.from({length:num})
                                                .map(q=>({
                                                    placeholderName: "coin"
                                                }));
                                            me.olam.loadNivrayim({
                                                Coin: coins
                                            }).then(() => {
                                                me.ayshPeula("close dialogue", 
                                            
                                                "See you soon!?");
                                            });
                                        };

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

                                        me.state = "talking"
                                        /**a nivra
                                         * that entered interaction zone
                                         */

                                            

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

                                            
                                            
                                        });

                                        me.on("selectedMessage", () => {
                                            if(me.state == "idle")
                                                return;
                                            if(!nivra.talkingWith)
                                                return;
                                            
                                            curMsg = me.currentMessage;
                                            console.log("Seelected", curMsg)
                                            if(curMsg.responses)
                                                me.olam.htmlAction(
                                                    "msg chossid",
                                                    {
                                                        children: 
                                                        me.currentMessage
                                                        .responses.map((q,i)=>({
                                                            innerText:(
                                                                i+1
                                                            ) + ". " + q.text,
                                                            className: i == 
                                                            me.currentSelectedMsgIndex
                                                            ? 
                                                                "selected" : ""
                                                        }))
                                                    }
                                                );
                                                
                                        });
                                        
                                        me.olam.htmlAction(
                                            "msg npc",
                                            {},
                                            {
                                                classList: {
                                                    add: "active"
                                                }
                                            }
                                        );


                                        
                                        me.olam.htmlAction(
                                            "msg chossid",
                                            {},
                                            {
                                                classList: {
                                                    add: "active"
                                                }
                                            }
                                        );
                                        me.ayshPeula("chose");
                                        
                                        
                                        
                                        
                                       
                                        me.on("close dialogue", (message) => {
                                            me.state = "idle";
                                            nivra.talkingWith = null;

                                            var msg = message ||
                                            "bye bye!";

                                            /**
                                             * Make a variable
                                             * length of how
                                             * much time the 
                                             * message should
                                             * still exist before it
                                             * fades away 
                                             * based on last response length.
                                             */
                                            var lng = msg.length * 62.5;
                                            me.olam.htmlAction(
                                                "msg npc",
                                                {
                                                    innerHTML: 
                                                    msg
                                                }
                                            );
                                            console.log("Closed", message)

                                            
                                            me.olam.htmlAction(
                                                "msg chossid",
                                                {
                                                    innerText: ""
                                                },
                                                {
                                                    classList: {
                                                        remove: "active"
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
                                                            remove: "active"
                                                        }
                                                    }
                                                );
                                            }, lng);
                                            console.log("Bye!", nivra);
                                        });
                                        
                                    },
                                    nivraYotsee(nivra, me) {
                                        /**
                                         * Only interact with player
                                         */
                                        if(
                                            nivra.type != "chossid"
                                        ) return;

                                        

                                        if(nivra.talkingWith)
                                            me.ayshPeula("close dialogue");

                                        
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



