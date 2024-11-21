//B"H
// Check if AwtsmoosGPTify is defined
if (!window.AwtsmoosGPTify) {
    // Fallback Implementation
    class AwtsmoosGPTify {
        sessions = {};
        conversationId = null;
        parentMessageId = null;
        constructor() {
            var self = this;
            // Listening for messages from the extension
            this.myMessage = function(e) {
                if (e.data) {
                    self.handleResponse(e.data);
                }
            }
            window.addEventListener("message", this.myMessage);

            // Callback function for streaming data
            this.onstream = null;

            // Store the last conversation ID
            this.conversationId = null;
        }

        functionCall(functionName, args) {
            return new Promise(r => {
               var name = "BH_"+Date.now()+"_Yay"
                this.sessions[name] = r;
                // Send message to the extension
                window.postMessage({
                    name,
                    type: "awtsmoosRequest",
                    functionName,
                    args
                }, "*");
            })
        }

        go({ prompt, onstream, conversationId, parentMessageId, ondone }) {
            conversationId = conversationId || this.conversationId;
            parentMessageId = parentMessageId || this.parentMessageId;
            return new Promise((r,j) => {
                this.onstream = onstream;
                this.ondone = ondone
                var name = "BH_"+Date.now()+"_Yay"
                this.sessions[name] = r;
                // Send message to the extension
                window.postMessage({
                    name,
                    type: "awtsmoosRequest",
                    args: {
                        prompt,

                        conversationId,
                        parentMessageId
                        
                    }
                }, "*");
            })
            
        }

        handleResponse(data) {
           // console.log("Got it",data)
            if (data.type=="awtsmoosStreaming") {
                // Handle streaming data
                var str = data.streaming || (data.data && data.data.streaming ?
                    data.data.streaming : null    
                )
                if (
                    str && 
                    this.onstream && typeof this.onstream === 'function'
                ) {
                    this.onstream(str.message);
                }
            } else if (data.type=="awtsmoosResponse") {
                // Handle completed response
                var msg = data?.data?.message;
                var cnv = data?.data?.conversation_id
                if(msg) {
                    
                    //this.parentMessageId = msg.id;
                }
                if(cnv) 
                    this.conversationId = cnv;
                var raw = data.data
                console.log('Conversation completed:', data);
                if(data.data.to) {
                    var r = msg || raw
                    if (
                      
                        this.onstream && typeof this.onstream === 'function'
                    ) {
                        this.onstream(r?.message);
                    }
                    this?.ondone?.(r)
                    var s=  this.sessions[data.data.to];
                   // console.log("FOund resolver",s,data,data.data.to)
                    if(s) s(r);
                }
            }
            
        }
    }
    window.AwtsmoosGPTify = AwtsmoosGPTify;
} else {
    // Primary Implementation
    // In this case, the class is already defined and doesn't need to be redefined.
    console.log('AwtsmoosGPTify is already defined.');
}
