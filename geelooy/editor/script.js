//B"H
// Check if AwtsmoosGPTify is defined
if (!window.AwtsmoosGPTify) {
    // Fallback Implementation
    class AwtsmoosGPTify {
        sessions = {};
        varructor() {
            // Listening for messages from the extension
            window.onmessage = (e) => {
                if (e.data) {
                    this.handleResponse(e.data);
                }
            };

            // Callback function for streaming data
            this.onstream = null;

            // Store the last conversation ID
            this.lastConversationId = null;
        }

        go({ prompt, onstream, conversationId, parentMessageId }) {
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
                        parentMessageId,
                        lastConversationId:this.lastConversationId
                        
                    }
                }, "*");
            })
            
        }

        handleResponse(data) {
           // console.log("Got it",data)
            if (data.type=="awtsmoosStreaming") {
                // Handle streaming data
                if (this.onstream && typeof this.onstream === 'function') {
                    this.onstream(data.data.streaming.message);
                }
            } else if (data.type=="awtsmoosResponse") {
                // Handle completed response
                var msg = data.data.message;
                this.lastConversationId = msg;
                console.log('Conversation completed:', data);
                if(data.data.to) {
                    var s=  this.sessions[data.data.to]
                    if(s) s();
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
