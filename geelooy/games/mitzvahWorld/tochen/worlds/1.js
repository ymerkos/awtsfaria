/**
 * B"H
 * Starting world for the player, containers
 * components to load and nivrayim.
 */

import * as AWTSMOOS from "../helpers/dialogue.js";

export default {
    components: {
        awduhm: 
        "https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/models%2Fawduhm.glb?alt=media"
        //"https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fawduhm.glb?alt=media"
        
       // "../models/gltf/awduhm.glb"
        ,
        grass: "../models/gltf/grass.glb",
        world: 
        "https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/models%2Fworld2.glb?alt=media"
        //"https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fworld2.glb?alt=media"
        /*"../models/gltf/" + 
           // "../models/gltf/beisHamikdash.glb"
           "world2.glb"*/
           // "collision-world.glb"
        ,
        goof/*body*/: {
            mouth: "mouth",
            pupilLeft: "pupilLeft",
            pupilRight: "pupilRight",

            innerEyeLeft: "innereyeleft",
            innerEyeRight: "innereyeright",

            eyelidRight: "ilidright",
            eyelidLeft: "ilidleft",

            eyeWhiteLeft: "eyeleft",
            eyeWhiteRight: "eyeright",

            eyebrowLeft: "eyeBrowLeft",
            eyebrowRight: "eyeBrowRight",

            hair: "hairPlaceholder"
        }
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
                                      //  map.offset.x -= 0.01;
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
                speed:126,
                interactable: true,
                path: "awtsmoos://awduhm",
                position: {
                    x:25
                },
                on: {
                    canvased(m) {
                        m.heesHawveh = true;
                        var mouth = m.goof.mouth;
                        if(mouth) {
                            console.log("Chossid started, mouth", m, mouth);
                            var path = m.initializeMouth(mouth);
                            console.log("mouth path", path)
                            mouth.material.color = {
                                isColor:true,
                                r:0.2,
                                g: 0.4,
                                b: 0.5
                            }
							mouth.material.needsUpdate = true;
                        }
						var iLidR = m.goof.eyelidRight;
						var iLidL = m.goof.eyelidRight;
                    },
                    ready(m) {
                        
						
                    },
                    heesHawvoos(me) {
                        me.updateMouth();
                    }
                },
                goof: "awtsmoos://goof"
            }
        },
        Medabeir: {
            him: {
                name: "npc_1",
                placeholderName: "npc_1",
                path: "awtsmoos://awduhm",
                proximity:3,
                messageTree(myself) {
                    return !myself.activeShlichus ? [
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
                                    action(me, nivra) {
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
                                                    objective: "Go out onto the obstacle course (of life) "
                                                    + "and collect 5 perutahs (coins), then bring them back.",
                                                    totalCollectedObjects: 5,
                                                    collected:0,
                                                    giver: me,
                                                    on: {
                                                        creation(sh) {
                                                            sh.giver.activeShlichus = sh;
                                                            me.olam.htmlAction(
                                                                "shlichus progress info",
                                                                {
                                                                
                                                                },
                                                                {
                                                                    classList: {
                                                                        add:  "active"
                                                                    }
                                                                }
                                                            );

                                                            me.olam.htmlAction(
                                                                "shlichus title",
                                                                {
                                                                    innerText: "Shlichus Accepted: "
                                                                    + sh.shaym
                                                                    +" \n " + sh.objective,
                                                                    
                                                                },
                                                                {
                                                                    classList: {
                                                                        add:  "active"
                                                                    }
                                                                }
                                                            );

                                                            me.olam.htmlAction(
                                                                "shlichus info",
                                                                {
                                                                    innerHTML: sh.collected + " out of "
                                                                    + sh.totalCollectedObjects
                                                                },
                                                                {
                                                                    classList: {
                                                                        remove:  "active"
                                                                    }
                                                                }
                                                            );

                                                        },
                                                        progress(p, sh) {
                                                            if(sh.collected < sh.totalCollectedObjects) {
                                                                me.olam.htmlAction(
                                                                    "shlichus info",
                                                                    {
                                                                        innerHTML: sh.collected + " out of "
                                                                        + sh.totalCollectedObjects
                                                                    },
                                                                    {
                                                                        classList: {
                                                                            add:  "active"
                                                                        }
                                                                    }
                                                                );
                                                            } else {
                                                                sh.completed = true;
                                                                //completed!
                                                                me.olam.htmlAction(
                                                                    "shlichus info",
                                                                    {
                                                                        innerText: "You have collected all "
                                                                        + sh.totalCollectedObjects+" coins!\n"+
                                                                        "Now return to that guy."
                                                                    },
                                                                    {
                                                                        classList: {
                                                                            add:  "active"
                                                                        }
                                                                    }
                                                                );

                                                                me.playChayoos("dance  silly");
                                                                nivra.playChayoos("dance hip hop");
                                                            }
                                                        },
                                                        collected(c, t) {
                                                            
                                                        }
                                                    }
                                                });
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
                        
                        
                    ] : !myself.activeShlichus.completed ? [
                        {
                            message: "B\"H\n"+
                            "What are you still doing here? You've got a SHLICHUS to do!",
                            
                            responses: [
                                {
                                    text: "Oh yeah, I forgot. See ya soon IYH!",
                                    action(me) {
                                        me.ayshPeula("close dialogue", "Ad Mihayra Yaroots!");
                                    }
                                },
                                {
                                    text: "Actually, can u tell me about Merkos 302?",
                                    nextMessageIndex: 1
                                }
                            ]
                        },
                        {
                            message: "Merkos 302, a beacon bright," + //new line !!
                            "In endless quest for Torah's light." + //new line !!
                            "It's not just brick and mortar laid," + //new line !!
                            "But sacred space where souls are made." + //new line !!
                            "A shlichus of immortal theme," + //new line !!
                            "Awake in it the lifelong dream." + //new line !!
                            "Here chassidus, the core unfurls," + //new line !!
                            "And spirals out to reach all worlds." + //new line !!
                            "Not bound by time, nor space it hides," + //new line !!
                            "It’s the Awtsmoos in earthly guides.", //end,
                            responses: [
                                {
                                    text: "Cool. See ya",
                                    action(me) {
                                        me.ayshPeula("close dialogue", "Hurry up, the poor need u!");
                                    }
                                }
                            ]
                        }
                    ] : [
                        {
                            message: "B\"H\n"+
                            "You have done it! You have collected all of the coins needed to bring Moshiach"
                            + " NOW! Tzion will be redeemed with Tzedakah, and u have just tipped the scales. "
                            + " Prepare for the ulitmate redemption for all.",
                            
                            responses: [
                                {
                                    text: "Great!",
                                    action(me) {
                                        me.ayshPeula("close dialogue", "Here he comes");
                                    }
                                }
                            ]
                        },
                    ]
                },
                on: {
                    ready(me) {
                        me. addCoins = function(num) {
                            var coins = Array.from({length:num})
                                .map(q=>({
                                    placeholderName: "coin",
                                    on: {
                                        collected(n) {
                                            
                                            var sh = n.olam.shlichusHandler
                                                .getShlichusByShaym(
                                                    "Redemption of the Destitute"
                                                )
                                            if(sh) {
                                                //used for testing completion
                                                for(var i = 0; i < 5; i++)
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