/**
 * B"H
 * a class to help with dialogue
 */

export default class Dialogue {
    constructor() {

    }
    static nivraYotsee(nivra, me) {
        
        /**
         * Only interact with player
         */
        if(
            nivra.type != "chossid"
        ) return;

       

        if(nivra.talkingWith)
            me.ayshPeula("close dialogue");
        
        if(me.wasApproached) {
            console.log("What is this",me)
            me.ayshPeula("was moved away from")
        }

        
        me.clear("initial approach");

    }

    static nivraNeechnas(nivra, me) {
        /**
                         * Only interact with player
                         */
        if(
            nivra.type != "chossid"
        ) return;

        const clearEvents = () => {
            me.clear("accepted dialogue");
            me.clear("chose");
            me.clear("accepted message");
        };

        
        
        me.on("initial approach", () => {
            me.olam.htmlAction({
                shaym: "approach npc msg",
                methods: {
                    classList: {
                        remove: "hidden"
                    }
                },
                properties: {
                    textContent: me.name
                }
            });

            
            nivra.ayshPeula("you approached", me);
            me.wasApproached = true;


            me.on("was moved away from", () => {
                
                me.currentMessageIndex = 0;
                me.olam.htmlAction({
                    shaym: "approach npc msg",
                    methods: {
                        classList: {
                            add: "hidden"
                        },
                    },
                    properties: {
                        innerText: ""
                    }
                });
    
                me.wasApproached = false;
                
                nivra.talkingWith = null;
                nivra.ayshPeula("you moved away from", me);
    
                clearEvents();
                
                me.clear("was moved away from");
            });


            me.on("accepted dialogue", () => {
            

                me.olam.htmlAction({
                    shaym: "approach npc msg",
                    methods: {
                        classList: {
                            add: "hidden"
                        }
                    },
                    properties: {
                        innerText: ""
                    }
                });
    
                var cam = me.asset.cameras[0];
                if(cam) {
                    me.olam.activeCamera = cam;
                }
                me.state = "talking";
    
    
                me.nivraTalkingTo = nivra;
                nivra.talkingWith = me;
    
                if(me.state == "idle") {
                    me.state = "talking";
                }
                
    
    
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
                
                
                
                
                me.selectResponse();
               
    
                me.on("close dialogue", (message) => {
                    nivra.ayshPeula("the dialogue was closed from", me)
                    me.olam.activeCamera = null;
                    me.wasApproached = false;
                    
                    me.currentMessageIndex = 0;
                    me.state = "idle";
                    me.clear("close dialogue");
                    clearEvents();
                    if(nivra.talkingWith) {
                        console.log(
                            "Closed without moving away from"
                        );
                        me.ayshPeula("initial approach")
                        console.log(
                            
                            me.wasApproached
                        );
                    }
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
                    
                });
            })
        });


        /**
         * when first 
         * appraoching a dialogue
         * character,
         * a UI component like
         * "Press C to talk to this person"
         * would appear, then if one DOES
         * press C then the "accepted dialogue"
         * event is fired on the NPC, which then 
         * opens the actual dialogue.
         */
        if(!me.wasApproached) {
            me.ayshPeula("initial approach");
        }

        

        
        
    }
}