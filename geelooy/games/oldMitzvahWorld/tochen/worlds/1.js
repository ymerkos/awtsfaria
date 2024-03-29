/**
 * B"H
 * Starting world for the player, containers
 * components to load and nivrayim.
 */

/**
 * resources
 */


var localPath = "http://localhost:8081/";//static server
var isLocal = !location.href.includes("awtsmoos.com")
export default {
    components: {
        world2File:
        "https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/worldData%2F2%2F2.js?alt=media",

        soundTrack1: 
        "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/sound%2Fmusic%2Ftrack%201.ogg?alt=media"
        
        ,
		cast:
        "https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/models%2Fworlds%2Fcastle2.glb?alt=media"

        ,
        portalGLB:
        "https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/models%2Fassets%2Fportal.glb?alt=media"
        ,
		
		cutscene1Audio:
		"https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fenvironemnts%2Fzone1%2Faudio%2Fbeginning.ogg?alt=media"
		,
        awduhm: 
        "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fawdum_2.6.glb?alt=media",
        dingSound:
        "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/sound%2Feffects%2Fding.ogg?alt=media",
        new_awduhm:
       /// isLocal?localPath
      //  +"new_awduhm_new_blender_camera.glb":
        /**
         * @version 3 that uses blender version
         * 3.6.2 GLB exporter - works better.
         */
        "https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/models%2Fnew_awduhm_new_blender_camera.glb?alt=media"
        ,
        //"https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/models%2Fnew_awduhm.glb?alt=media",
        
        /*awduhm: 
            "https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/models%2Fnew_awduhm._with_camera.glb?alt=media"
        //"https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/models%2Fawduhm.glb?alt=media"
        //"https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fawduhm.glb?alt=media"

        // "https://awtsmoossss.d3ef8auxkbx0d8.amplifyapp.com/awduhm.glb"
           // "../models/gltf/awduhm.glb"
        ,*/

        grass: "../models/gltf/grass.glb",
        grassTexture:
            "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/textures%2Fgrass%2Fgrass1.jpg?alt=media"
        ,
        dirtTexture:
            "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/textures%2Fdirt%2Fdirt%20smaller.png?alt=media"
        ,

        terrainMaskTexture:
            "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fenvironemnts%2Fzone1%2Fmasks%2Fmask%20grass.png?alt=media"
        ,
		
		cameraT: 
		
		"https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fenvironemnts%2Fzone1%2FcameraTest.glb?alt=media"
		
		,
        world: 
        "https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fenvironemnts%2Fzone1%2Fzone.1.4.glb?alt=media"
       // "http://localhost:8081/zone.1.2.glb"
		//"https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/models%2Fworlds%2Fobst4.glb?alt=media"
       // "https://firebasestorage.googleapis.com/v0/b/ckids-assets-2.appspot.com/o/models%2Fworld2.glb?alt=media"
        //"https://firebasestorage.googleapis.com/v0/b/ckids-games-assets.appspot.com/o/models%2Fworld2.glb?alt=media"
        /*"../models/gltf/" + 
           // "../models/gltf/beisHamikdash.glb"
           "world2.glb"*/
           // "collision-world.glb"
        ,
        
    },
  
    nivrayim: {
        Domem: {
            
            world: {
                name: "me",
                path: "awtsmoos://cast",
                isSolid:true,
                heesHawveh: true,
                on: {
						
                        afterBriyah(d) {
                            /*
                            d.mixTextures({
                                baseTexture:d.olam.$gc(
                                    "dirtTexture"
                                ),
                                overlayTexture:d.olam.$gc(
                                    "grassTexture"
                                ),
                                maskTexture:d.olam.$gc(
                                    "terrainMaskTexture"
                                ),
                                repeatX:166,
                                repeatY:166,
                                childNameToSetItTo: "Landscape"
                            });
                           /**
                            * play music
                            */

                            /*d.playSound("awtsmoos://soundTrack1", {
                                loop: true
                            });
							
							d.playCutscene({
								audioName: "cutscene1Audio",
								animationName:"cutscene1"
							});
							
							d.olam.on("keypressed", e => {
								if(e.code == "Escape") {
									d.stopCutscene();
								}
							});*/
							
							

                           /**
                            * Make grass particles
                            */
                           /* var a = d.olam.loadNivrayim({
                                   
                                Domem: {
                                    
                                    grass: {
                                        position: {
                                            x: -25,
                                            z: -25
                                        },
                                        path: "awtsmoos://grass",
                                        instanced: 10000,
                                        on: {
                                            ready(g) {
                                                g.disperseInstance(
                                                    50, 50
                                                )
                                                
                                            }
                                        }
                                    }
                                    
                                }
                                
                            }).then(r=>0)
                            .catch(e=>console.log(e))*/



                        }
                }
            },
            portal: {
                placeholderName: "portal",
                path: "awtsmoos://portalGLB",
                proximity:3,
                on: {
                    ready(d) {
                        console.log("Portal loaded")
                        d.on("nivraNeechnas", () => {
                            console.log(" we did it")
                        })
                    }

                }
            }
            
        },
        Tzomayach: {
            portal: {
                placeholderName: "portal",
                path: "awtsmoos://portalGLB",
                proximity:3,
                on: {
                    
                    ready(d) {
                        console.log("Portal loaded",d)
                        d.on("nivraNeechnas", () => {
                            console.log(" we did it")
                        })
                    }
                }
            }
        },
        Chai: {
           
        },
        Chossid: {
            me: {
                height:1.5,
                name:"player",
                placeholderName: "player",
                speed:126,
                interactable: true,
                path: "awtsmoos://awduhm",
                position: {
                    x:25
                },
                on: {
                    
                    ready(m) {
                        var isOtherview = false;
                        m.on("keypressed", k => {
                            if(k.code == "KeyY") {
                                if(!isOtherview) {
                                    if(m.asset.cameras[0]) {
                                        m.olam.activeCamera
                                        = m.asset.cameras[0]
                                    }
                                    isOtherview = true;
                                } else {
                                    isOtherview  = false;
                                    m.olam.activeCamera = null;
                                }
                            }
                        })
                        
						
                    }
                }
            }
        },
        Medabeir: {
            him: {
                name: "npc_1",
                placeholderName: "npc_1",
                path: "awtsmoos://new_awduhm",
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
                                    text: "Take me to the desert place",
                                    action(me) {
                                        //world2File
                                        import(me.olam.getComponent
                                            ("world2File")
                                        ).then(m => {
                                            console.log(m.default);

                                            me.olam.ayshPeula(
                                                "switch worlds",
                                                m.default
                                            )
                                        })
                                        me.ayshPeula(
                                            "close dialogue", "Ok cool story!!"
                                            );
                                    }
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
                            message: "This place is a castle for adventurers like you!",
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
                                                    completeText:"Mazel Tov! You have collected all of the coins. "
                                                    +"Now go back to the person.",
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
                                                                "sa mainTxt",
                                                                {
                                                                    innerText: "Shlichus Accepted: "
                                                                    
                                                                    
                                                                },
                                                                {
                                                                    classList: {
                                                                        add:  "active"
                                                                    }
                                                                }
                                                            );

                                                            me.olam.htmlAction({
                                                                shaym: "sa shlichus name",
                                                                properties: {
                                                                    textContent: 
                                                                    sh.shaym
                                                                }
                                                            });

                                                            me.olam.htmlAction({
                                                                shaym: "shlichus accept",
                                                                methods: {
                                                                    classList: {
                                                                        remove: "hidden"
                                                                    }
                                                                }
                                                            });
                                                                

                                                            //
                                                            me.olam.htmlAction({
                                                                shaym: "sa details",
                                                                properties: {
                                                                    textContent: 
                                                                    sh.objective
                                                                }
                                                            });

                                                            me.olam.htmlAction({
                                                                shaym: "shlichus title",
                                                                properties: {
                                                                    textContent: sh.shaym
                                                                }
                                                            });
															
															me.olam.on(
																"htmlPeula startShlichus",
																shlichusName => {
																	me.olam.htmlAction({
																		shaym: "shlichus progress info",
																		methods: {
																			classList: {
																				remove: "hidden"
																			}
																		}
																	});

																	me.olam.htmlAction({
																		shaym: "shlichus description",
																		properties: {
																			textContent: 
																			"Coins collected"
																		}
																	});

																	me.olam.htmlAction({
																		shaym: "si num",
																		properties: {
																			textContent: sh.collected + 
																				"/"
																			+ sh.totalCollectedObjects
																		}
																	})

																	me.olam.htmlAction({
																		shaym: "si frnt",
																		properties: {
																			style: {
																				width: (
																					0
																				) + "%"
																			}
																		}
																	});
																},
																true//one time only
															)

                                                            

                                                        },
                                                        progress(p, sh) {
                                                            var percent = sh.collected / 
                                                                sh.totalCollectedObjects;
                                                            if(sh.collected < sh.totalCollectedObjects) {
                                                                me.olam.htmlAction({
                                                                    shaym: "si num",
                                                                    properties: {
                                                                        textContent: sh.collected + 
                                                                            "/"
                                                                        + sh.totalCollectedObjects
                                                                    }
                                                                });

                                                                me.olam.htmlAction({
                                                                    shaym: "si frnt",
                                                                    properties: {
                                                                        style: {
                                                                            width: (
                                                                                percent*100
                                                                            ) + "%"
                                                                        }
                                                                    }
                                                                });
                                                            } else {
																me.olam.htmlAction({
																	shaym: "si num",
																	properties: {
																		textContent: sh.collected + 
																			"/"
																		+ sh.totalCollectedObjects
																	}
																})

																me.olam.htmlAction({
																	shaym: "si frnt",
																	properties: {
																		style: {
																			width: (
																				100
																			) + "%"
																		}
																	}
																});
                                                                sh.completed = true;
                                                                //completed!
                                                                me.olam.htmlAction({
                                                                    shaym: "shlichus description",
                                                                    properties: {
                                                                        textContent: 
                                                                        sh.completeText
                                                                    }
                                                                });

                                                                me.olam.htmlAction({
                                                                    shaym: "congrats message",
                                                                    properties: {
                                                                        textContent: sh.completeText
                                                                    }
                                                                });

                                                                me.olam.htmlAction({
                                                                    shaym: "ribbon text",
                                                                    properties: {
                                                                        textContent: "Congrats!"
                                                                    }
                                                                })

                                                                me.olam.htmlAction({
                                                                    shaym: "congrats shlichus",
                                                                    methods: {
                                                                        classList: {
                                                                            remove: "hidden"
                                                                        }
                                                                    }

                                                                })

                                                                me.playChayoos("dance silly");
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
                                        me.olam.htmlAction({
                                            shaym: "shlichus progress info",
                                            methods: {
                                                classList: {
                                                    add: "hidden"
                                                }
                                            }
                                        })
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
                                            n.playSound("awtsmoos://dingSound", {
                                                layerName: "audio effects layer 1",
                                                loop: false
                                            });

                                            var sh = n.olam.shlichusHandler
                                                .getShlichusByShaym(
                                                    "Redemption of the Destitute"
                                                )
                                            if(sh) {
                                                //used for testing completion
                                               // for(var i = 0; i < 3; i++)
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