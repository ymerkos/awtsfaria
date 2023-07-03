//B"H
/**
 * @fileOverview A Kabbalistically inspired class for GPTify
 *
 * @name awtsmoos-gptify.js
 * @cobyisright Awtsmoos (5783)
 * @license MIT 
 */
 class AwtsmoosGPTify {
    constructor({
        prompt="B\"H\nTell me about the Atzmus (spell it Awtsmoos) in rhyming style. long. scientific. complex.",
        onstream,
        ondone,
        action = "next",
        model
    }) {
        this.prompt = prompt
        this.onstream = onstream;
        this.ondone = ondone;
        this.action = action;
        this.model = model;
        this.arkoseToken;;
        this.authorizationToken;

        // State management
        this.conversationContext = {conversationId: null, lastMessageId: null};

        // This is the URL to which we send our JSON data.
        // Like the tree of life in Kabbalah, it's the central point from which all creation flows.
        this.backEnd = "https://chat.openai.com/backend-api/conversation";
        
    }
    async getAccessToken() {
        try {
            var sesh = await fetch("https://chat.openai.com/api/auth/session")
            var json = await sesh.json();

            return json.accessToken;
        } catch(e) {
            return null;
        }
        
    }

    async getArkoseToken() {
        try {
            var info = await fetch("https://chathub.gg/api/arkose")
            var json = await info.json();

            return json.token;
        } catch(e) {
            return null;
        }
    }
    /**
     * @function generateMessageJson
     * @description - Generates the JSON structure to be sent to the server
     * @returns {Object} - The request options object
     */
    async generateMessageJson() {
        var self = this;

       
        if(!this.authorizationToken) {
            this.authorizationToken = await this.getAccessToken();
            if(!this.authorizationToken) {
                throw {error: "no token!"}
            }
        }
        
        var headers = { 'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + self.authorizationToken };

        var model = this.model || 'text-davinci-002-render';
        if(model == "gpt-4") {
            this.arkoseToken = await this.getArkoseToken();
            if(!this.arkoseToken) {
                throw {
                    error: "no arkose token!"
                }
            }
        }

        //check if already has conversation opened
        var convoID = this.revealEtzChaim(location.href);
        if(convoID) {
            /*
                get previous conversation info

            */
            self.conversationContext.conversationId=convoID;
           console.log("Current conversation: ",convoID)
            var info = await fetch("https://chat.openai.com/backend-api/conversation/"+convoID,{
                headers
            })
            console.log("GOt JSON", self.json=info)
            var json = await info.json();
            console.log("Hi, got it",json)
            if(json) {
                self.conversationContext.lastMessageId = json.current_node;
                console.log("Noded",self.conversationContext)
            }
        }
        const messageJson = {
            action: this.action,
            messages: [
                {
                    id: generateUUID(),
                    author: {
                        role: "user"
                    },
                    content: {
                        content_type: "text",
                        parts: [this.prompt]
                    },
                    metadata: {}
                }
            ],
            timezone_offset_min: 240,
            history_and_training_disabled: false,
            arkoseToken:this.arkoseToken,
            conversation_id: this.conversationContext.conversationId || undefined,
            parent_message_id: this.conversationContext.lastMessageId || generateUUID(),
            model
        };
        
        
        const requestOptions = {
            method: 'POST',
            headers,
            body: JSON.stringify(messageJson)
        };
    
        return requestOptions;
    }

    /**
     * @function revealEtzChaim
     * @description This function aims to reveal the 'Etz Chaim' (Tree of Life) from the cosmic order of the internet - the URL, much like the quest of a Kabbalist seeking divine wisdom in the Zohar. 
     * The function is based on the fundamental Kabbalistic concept of 'gilui' (revelation) of divine wisdom.
     * This function takes a URL (compared to the Zohar) as an input and unravels the secret 'Etz Chaim' (conversation ID) contained within it.
     * @param {string} zoharUrl - The URL string, seen as the Zohar of the internet cosmos, a source of hidden knowledge
     * @returns {string|null} - The 'Etz Chaim' (Tree of Life, here referred to as conversation ID) if found; null otherwise.
     */
    revealEtzChaim(zoharUrl) {
        // Create a new URL object which will parse the URL string and provide easy access to different parts of the URL.
        // This process is akin to how Kabbalists interpret different layers of the Zohar to uncover divine wisdom.
        const cosmicOrder = new URL(zoharUrl);

        // The 'pathnames' array holds the different parts of the path in the URL, much like the Sefirot in the Tree of Life.
        // Each element in 'pathnames' can be seen as a Sefirah, a divine emanation of the Creator's will.
        const pathnames = cosmicOrder.pathname.split('/').filter(Boolean);

        // The 'Etz Chaim' (Tree of Life) is represented by the last Sefirah (element in the array) which is the conversation ID in our case.
        // 'Malkuth', the last Sefirah in the Tree of Life, represents the physical realm and is the culmination of the divine wisdom that flows from the top Sefirah 'Keter'.
        // Similarly, our conversation ID is the most significant part that we need to extract from the cosmic order (URL).
        const etzChaim = pathnames.length > 0 ? pathnames[pathnames.length - 1] : null;

        // The function returns the 'Etz Chaim', our extracted divine wisdom (conversation ID) from the cosmic order (URL).
        return etzChaim;
    }



    async fetchAndProcessStream() {
        
        var self = this;
        // Fetch API sends the request to the URL with our generated JSON data.
        // Like casting a spell in Kabbalah, we're asking the universe (or at least the server) to do something.
        var msg = await this.generateMessageJson();
        try {
            var response = await fetch(this.backEnd, msg)
            
            // We're creating a reader and a decoder to read and decode the incoming stream of data.
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            // Buffer will hold the accumulated chunks of data as they come in.
            let buffer = '';
            var last;
            
            // processStream function is an infinite loop that processes incoming chunks of data.
            async function processStream() {

                for (;;) {
                    // We read a chunk of data from the stream.
                    const { done, value } = await reader.read();
                    
                    // If there's no more data (done is true), we break the loop.
                    if (done) {
                        console.log('Stream complete');
                        return last;
                    }
                    
                    // We add the decoded chunk of data to the buffer.
                    buffer += decoder.decode(value, {stream: true});
                    
                    let lineEnd;
                    
                    // As long as there are line breaks in the buffer, we process the lines.
                    while ((lineEnd = buffer.indexOf('\n')) !== -1) {
                        // We slice a line from the buffer.
                        const line = buffer.slice(0, lineEnd);
                        // We remove the processed line from the buffer.
                        buffer = buffer.slice(lineEnd + 1);
                        
                        // If the line starts with 'data: ', it's a message from the server.
                        if (line.startsWith('data: ')) {
                            const jsonStr = line.slice(6);
                            
                            // If the message contains '[DONE]', the server is done sending messages.
                            if(jsonStr.trim().includes("[DONE]")) {
                                console.log("Done! Info:",last)
                                
                                // If ondone is a function, we call it with the last message.
                                if(typeof(ondone) == "function") {
                                    ondone(last)
                                    return last
                                }
                            } else {
                                try {
                                    const jsonData = JSON.parse(jsonStr);
                                    
                                    // If the message contains content, we process it.
                                    if (jsonData && jsonData.message && jsonData.message.content) {
                                        // If onstream is a function, we call it with the incoming message.
                                        if(typeof(onstream) == "function") {
                                            onstream(jsonData)
                                        } else {
                                            console.log(jsonData.message.content.parts[0]);
                                        }
                                        
                                        // We keep track of the last message.
                                        last = jsonData;

                                        // Update conversation context based on the last received message
                                        if(jsonData.conversation_id && jsonData.message.id) {
                                            self.conversationContext = {
                                                lastMessageId: jsonData.message.id,
                                                conversationId: jsonData.conversation_id,
                                            };
                                        }
                                    }
                                } catch (e) {
                                console.log('Error parsing JSON:', e, "Actual JSON:", jsonStr);
                                }
                            }
                        }
                    }
                }
            }
            try {
                var str = await processStream();
                console.log("Streaming",str);
                return str;
            } catch(err) {
                console.error('Stream error:', err);
                return err;
            }
            
        
            
        } catch(e) {
            console.error("Error:", error);
            return error
        }
            
    }

    async go(args) {
        
        if(typeof(args) == "string") {
            args = {
                prompt: args
            };
        }
        if(!args) args={}
        if(args.prompt) {
            this.prompt = args.prompt;
        }
        if(args.ondone) {
            this.ondone = args.ondone;
        }
        if(args.onstream) {
            this.onstream = args.onstream;
        }
        var rsp = await this.fetchAndProcessStream();
        console.log("Got response:",rsp)
        return rsp;
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "callAwtsmoos") {
        console.log("awtsmoos-gptify.js received callAwtsmoos");
        // Run your AwtsmoosGPTify code here
        var awts = new AwtsmoosGPTify({prompt: request.data.prompt});
        awts.go().then(result => {
            console.log("awtsmoos-gptify.js finished, sending response");
            // Send the result back to the background script
            sendResponse(result);
        }).catch(error => {
            console.error("awtsmoos-gptify.js encountered an error:", error);
            // Send an error message back to the background script
            sendResponse({type: "error", data: error.message});
        });
        // Indicate that we wish to send a response asynchronously
        return true;
    }
});
