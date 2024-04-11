/**
 * B"H
 * a class to help with dialogue
 */
import Interaction from "./tzomayachInteraction.js";
function processText(txt) {
    return txt.split('\n').map(line => line.trimStart()).join('\n');
}
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
                        innerText: processText(curMsg
                            .message)
                    }
                );

                
                
            });

            this.me.on("selectedMessage", () => {
          
                if(this.me.state == "idle")
                    return;
                /*if(!nivra.interactingWith)
                    return;*/
                var self = this;
                curMsg = this.me.currentMessage;
                if(curMsg.responses) {
                    var ch = this.me.currentMessage
                    .responses.map((q,i)=>({
                        innerText:(
                            i+1
                        ) + ". " + processText(q.text),
                        className: i == 
                            this.me.currentSelectedMsgIndex
                            ? 
                            "selected" : "",
                        attributes: {
                            "data-index": i
                        },
                        onclick: function(e, $, ui) {
                            var ind = e.target.getAttribute("data-index");
                            
                        
                            ui.peula(e.target, {
                                toggleToOption: {
                                    id: ind
                                }
                            });
                        },
                        awtsmoosClick: true
                    }));
                    
                    this.me.olam.htmlAction(
                        this.opts.chossidMessageShaym,
                        {
                            children: ch
                            
                        }
                    );

                    var self = this
                    function toggle(ind) {
                        var id = ind.id;
                        self.me.olam.clear("htmlPeula toggleToOption");

                        self.me.olam.on("htmlPeula toggleToOption", toggle)
                    //    console.log("Trying to choose",ind, id)
                        self.me.chooseResponse(id)
                        
                    }
                    self.me.olam.clear("htmlPeula toggleToOption");

                    this.me.olam.on("htmlPeula toggleToOption", toggle)
                }
                    
            });
            
            this.me.isShowing = true;
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
                
                this.me.isShowing = false;
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
                    if(this.me.isShowing) return;
                    
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
   

    clearDialogueEvents() {
        this.me.olam.clear("htmlPeula toggleToOption")
        this.me.clear("chose");
        this.me.clear("selectedMessage");
    }
    clearEvents() {
        super.clearEvents();
        this.clearDialogueEvents()
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