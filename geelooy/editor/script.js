//B"H
// Check if AwtsmoosGPTify is defined
if (!window.AwtsmoosGPTify) {
    // Fallback Implementation
    class AwtsmoosGPTify {
        sessions = {};
        conversationId = null;
        parentMessageId = null;
        constructor() {
            // Listening for messages from the extension
            window.onmessage = (e) => {
                if (e.data) {
                    this.handleResponse(e.data);
                }
            };

            // Callback function for streaming data
            this.onstream = null;

            // Store the last conversation ID
            this.conversationId = null;
        }

        go({ prompt, onstream, conversationId, parentMessageId }) {
            conversationId = conversationId || this.conversationId;
            parentMessageId = parentMessageId || this.parentMessageId;
            return new Promise((r,j) => {
                this.onstream = onstream;
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
                var msg = data.data.message;
                var cnv = data.data.conversation_id
                if(msg) {
                    this.parentMessageId = msg.id;
                }
                this.conversationId = cnv;
                console.log('Conversation completed:', data);
                if(data.data.to) {
                    var s=  this.sessions[data.data.to];
                   // console.log("FOund resolver",s,data,data.data.to)
                    if(s) s(msg);
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
