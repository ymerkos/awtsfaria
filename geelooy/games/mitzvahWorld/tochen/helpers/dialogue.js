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

    }

    static nivraNeechnas(nivra, me) {
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
    }
}