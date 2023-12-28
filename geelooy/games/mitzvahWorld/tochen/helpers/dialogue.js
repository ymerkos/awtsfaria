/**
 * B"H
 * a class to help with dialogue
 */
import Interaction from "./tzomayachInteraction.js";
export default class Dialogue extends Interaction {
    
    constructor(me, opts = {}) {
        
        opts.approachAction = (nivra) => {
            var asset = this.me.asset;
            if(asset) {
                var cam = this.me.asset.cameras[0];
                if(cam) {
                    this.me.olam.activeCamera = cam;
                }
            }
            this.me.state = "talking";


            this.me.nivraTalkingTo = nivra;

            if(this.me.state == "idle") {
                this.me.state = "talking";
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
            var curMsg = this.me.currentMessage;
            this.me.on("chose", () => {
                curMsg = this.me.currentMessage;
                
                this.me.olam.htmlAction(
                    this.opts.npcMessageShaym,
                    {
                        innerText: curMsg
                            .message
                    }
                );

                
                
            });

            this.me.on("selectedMessage", () => {
          
                if(this.me.state == "idle")
                    return;
                /*if(!nivra.interactingWith)
                    return;*/
                
                curMsg = this.me.currentMessage;
                console.log("msg",curMsg)
                if(curMsg.responses) {
                    var ch = this.me.currentMessage
                    .responses.map((q,i)=>({
                        innerText:(
                            i+1
                        ) + ". " + q.text,
                        className: i == 
                        this.me.currentSelectedMsgIndex
                        ? 
                            "selected" : ""
                    }));
                    console.log("Trying",ch)
                    this.me.olam.htmlAction(
                        this.opts.chossidMessageShaym,
                        {
                            children: ch
                            
                        }
                    );
                }
                    
            });
            
            this.me.olam.htmlAction({

                shaym: this.opts.npcMessageShaym,
                methods: {
                    classList: {
                        add: "active"
                    }
                }
            });


            this.me.olam.htmlAction({

                shaym: this.opts.chossidMessageShaym,
                methods: {
                    classList: {
                        add: "active"
                    }
                }
            });


            this.me.ayshPeula("chose");
            
            
            
            
            this.me.selectResponse();
            this.me.ayshPeula("selectedMessage")

            this.me.on("close dialogue", (message) => {
                this.me.olam.activeCamera = null;
                
                
                this.me.currentMessageIndex = 0;
                this.me.state = "idle";
                this.me.clear("close dialogue");
                this.clearEvents();
                
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
                
                this.me.olam.htmlAction({

                    shaym: this.opts.npcMessageShaym,
                    
                    properties: {
                        innerHTML: msg
                    }
                });

                

                
                this.me.olam.htmlAction({

                    shaym: this.opts.chossidMessageShaym,
                    methods: {
                        classList: {
                            remove: "active"
                        }
                    }
                });
                
                setTimeout(() => {
                    
                    this.me.olam.htmlAction({

                        shaym: this.opts.npcMessageShaym,
                        
                        methods: {
                            classList: {
                                remove: "active"
                            }
                        }
                    });
                }, lng);
                
            });
        }
        super(me, opts);
        
    }
   

    clearEvents() {
        super.clearEvents();
        this.me.clear("chose");
        this.me.clear("selectedMessage");
    }

    nivraNeechnas(nivra) {
        

        
        
        super.nivraNeechnas(nivra, this.me);

        /**
         * Only interact with player
         */
        if(
            nivra.type != "chossid"
        ) return;

        this.me.on("initial approach", () => {
            

            


            this.me.on("was moved away from", () => {
                
                this.me.currentMessageIndex = 0;
                
    
                
            });


            
        });

        

        
        
    }
}