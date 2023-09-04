/**
 * B"H
 * Starting world for the player, containers
 * components to load and nivrayim.
 */

import * as AWTSMOOS from "../helpers/dialogue.js";

export default {
    components: {
        awduhm: "../models/gltf/awduhm.glb",
        grass: "../models/gltf/grass.glb",
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
                            /**
                             * Make ocean texture move up
                             * to give the appearance of the splitting
                             * of the sea
                             */
                            var ocean = d.materials.find(q=>q.name.includes("ocean"))
                           
                           if(ocean) {
                                d.heesHawveh = true;

                                var map = ocean.map;
                                if(map) {
                                    d.on("heesHawvoos", () => {
                                        map.offset.x -= 0.01;
                                    });
                                }
                           }

                           /**
                            * Make grass particles
                            */
                            var a = d.olam.loadNivrayim({
                                   
                                Domem: {
                                    grass: {
                                        position: {
                                            x: -15,
                                            z: -65
                                        },
                                        path: "awtsmoos://grass",
                                        instanced: 10000,
                                        on: {
                                            ready(g) {
                                                g.disperseInstance(
                                                    100, 200
                                                )
                                                
                                            }
                                        }
                                    }
                                    
                                }
                                
                            }).then(r=>console.log("did",r))
                            .catch(e=>console.log(e))



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
                speed:260,
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

                                    if(me.olam.shlichusHandler) {
                                        var shl = me.olam.shlichusHandler
                                            .createShlichus({
                                                shaym: "Redemption of the Destitute",
                                                totalCollectedObjects: 5,
                                                collected:0,
                                                on: {
                                                    creation(sh) {
                                                        console.log("Made");
                                                        me.olam.htmlAction(
                                                            "shlichus progress info",
                                                            {
                                                                className: "active"
                                                            }
                                                        );

                                                        me.olam.htmlAction(
                                                            "shlichus title",
                                                            {
                                                                innerHTML: "Shlichus Accepted: "
                                                                + sh.shaym,
                                                                className: "active"
                                                            }
                                                        );

                                                        me.olam.htmlAction(
                                                            "shlichus info",
                                                            {
                                                                innerHTML: sh.collected + " out of "
                                                                + sh.totalCollectedObjects,
                                                                className: "active"
                                                            }
                                                        );

                                                    },
                                                    progress(p, sh) {
                                                        console.log("Progress for shlichus: ", p)
                                                        me.olam.htmlAction(
                                                            "shlichus info",
                                                            {
                                                                innerHTML: sh.collected + " out of "
                                                                + sh.totalCollectedObjects,
                                                                className: "active"
                                                            }
                                                        );
                                                    },
                                                    collected(c, t) {
                                                        console.log("Collected",c,t)
                                                    }
                                                }
                                            });
                                        console.log("sh", shl)
                                    }
                                    
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
                                    placeholderName: "coin",
                                    on: {
                                        collected(n) {
                                            console.log("Got collected!", n);
                                            var sh = n.olam.shlichusHandler
                                                .getShlichusByShaym(
                                                    "Redemption of the Destitute"
                                                )
                                            if(sh) {
                                                sh.collectItem();
                                            }
                                        }
                                    }
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
                        AWTSMOOS.Dialogue.nivraNeechnas(
                            nivra, me
                        );
                    },
                    nivraYotsee(nivra, me) {
                        AWTSMOOS.Dialogue.nivraYotsee(
                            nivra, me
                        );
                        
                    }
                }
            },
            
        }
    }
};