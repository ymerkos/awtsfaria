//B"H
// Check if AwtsmoosGPTify is defined
if (typeof AwtsmoosGPTify === 'undefined') {
    // Fallback Implementation
    class AwtsmoosGPTify {
        constructor() {
            // Listening for messages from the extension
            window.onmessage = (e) => {
                if (e.data && e.data.from === "gptify") {
                    this.handleResponse(e.data);
                }
            };

            // Callback function for streaming data
            this.onstream = null;

            // Store the last conversation ID
            this.lastConversationId = null;
        }

        async go({ prompt, onstream }) {
            this.onstream = onstream;

            // Send message to the extension
            window.postMessage({
                type: "awtsmoosRequest",
                hi: `B"H\n${prompt}`
            }, "*");
        }

        handleResponse(data) {
            if (data.streaming) {
                // Handle streaming data
                if (this.onstream && typeof this.onstream === 'function') {
                    this.onstream(data.streaming.message);
                }

                // Update the last conversation ID
                this.lastConversationId = data.streaming.conversation_id;
            } else if (data.name === "gptify" && this.lastConversationId === data.to) {
                // Handle completed response
                console.log('Conversation completed:', data);
            }
        }
    }
} else {
    // Primary Implementation
    // In this case, the class is already defined and doesn't need to be redefined.
    console.log('AwtsmoosGPTify is already defined.');
}