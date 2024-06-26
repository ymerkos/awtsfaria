//B"H
// content.js
console.log("B\"H")
console.log("Awtsmoos GPT extension")
var nm = "gptify"
var port = chrome.runtime.connect({name:"gptify"})
port.postMessage({name:nm})
port.onMessage.addListener(ms => {
    console.log(ms, "GOT port?");
    var message = ms;
    var args = message.data.args;
    var from = message.from || message.name;
    if(ms.command== "awtsmoosTseevoy") {
        executeCommand(args, from).then(res => {
            var msg = {
                from: nm,
                to: from,
                gptData: res
            }
            console.log("Got the full response: ",res,"sending:",msg);
            port.postMessage(msg)
        }).catch(e => {
            console.log("Issue?",e)
        })
    }
});

var sesh = null
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    console.log("Got command",message)
    if (message.command === 'awtsmoosTseevoy') {
      // Handle the command here, for example, sending "hi" to chatgpt.com
      var args = message.data.args;
      console.log("Got request",args)
        var from = message.data.from;
    
       executeCommand(args, from).then(res => {
        console.log("Got the full response: ",res)
        sendResponse(res);
       }).catch(e => {
        console.log("Issue?",e)
       })
       return true;
      
    }
  });
  
  async function executeCommand(args, from) {
    // Implementation for handling the command on chatgpt.com
    // Return the result to the caller
    console.log("Hi!", args)
    if(!sesh) {
        console.log("making new session",sesh)
        sesh = new AwtsmoosGPTify();
    }
    
    var awts = await sesh.go({
        ...args,
        onstream(d) {
            port.postMessage({
                streaming: d,
                to: from,
                name: "gptify"
            })
        }
    });
    return awts;
  }
  "B\"H";

function defineIt() {
    "B\"H";

//B"H
/**
 * @fileOverview A Kabbalistically inspired wrapper for GPTify
 *
 * @name awtsmoos-gptify.js
 * @copyright OpenAI (2023)
 * @license MIT 
 *
 * @param {Object} config - The configuration object
 * @param {string} config.prompt - The initial prompt to feed the GPT model
 * @param {Function} config.onstream - Callback function executed every time a message comes from the server
 * @param {Function} config.ondone - Callback function executed when the server sends done message
 * @param {string} [config.action="next"] - The action to be taken, defaults to 'next'
 * @param {string} [config.messageContent=""] - The content of the message, defaults to empty string
 * @param {string} [config.conversationId=Math.random().toString(36).substring(2)] - The ID of the conversation, defaults to random string
 * @param {string} [config.parentMessageId=Math.random().toString(36).substring(2)] - The ID of the parent message, defaults to random string
 * @param {string} [config.model="gpt-4"] - The model to be used, defaults to 'gpt-4'
 * @param {number} [config.timezoneOffsetMin=240] - Timezone offset in minutes, defaults to 240
 * @param {boolean} [config.historyAndTrainingDisabled=false] - Whether to disable history and training, defaults to false
 * @param {string} [config.arkoseToken=""] - Arkose token, defaults to empty string
 * @param {string} [config.authorizationToken=""] - Authorization token, defaults to empty string
 * @returns {void}
 * 
 * @example
 * var a = new AwtsmoosGPTify();
 * await a.go({
    prompt:"B\"H\ntell me about the essence of reality from the perspective of the Atzmus in every thing, rhyming ntensely thorugh a metaphorical series of events time 5",
   
    onstream(a){
        console.log(a.message.content.parts[0])
    },ondone(s){
        console.log(s.message.content.parts[0])
    }
})
 */

/**
 * TODO implement something for max hour when status code is 429
 */

class AwtsmoosGPTify {
    _lastMessageId = null;
    _conversationId = null;
    sessionName = null;
    constructor() {

    }
    async go({
        prompt, 
        onstream, 
        ondone, 
        action = "next",
        parentMessageId = this._lastMessageId, 
        model, 
        conversationId = this._conversationId,
        timezoneOffsetMin = 240, 
        historyAndTrainingDisabled = false, 
        arkoseToken = "", 
        authorizationToken = "",
        more = {},
        print=true,
        customFetch=fetch,
        customTextEncoder=TextDecoder,
        customHeaders = {},
        arkoseServer = "http://localhost:8082"
    }) {
        var self = this;
        var headers = null;
        var nameURL = convoId => 
        `https://chatgpt.com/backend-api/conversation/gen_title/${convoId}`
        if(!parentMessageId && !conversationId) {
            parentMessageId = generateUUID();
        }

        if(!authorizationToken) {
            var token = await getAuthToken();
            if(token) {
                authorizationToken = token
            } else {
                console.log("problem getting token")
            }
        }

        
        
        if(print)
            console.log("par",parentMessageId)
        /**
         * @function generateMessageJson
         * @description - Generates the JSON structure to be sent to the server
         * @returns {Object} - The request options object
         */
        async function generateMessageJson() {

            var messageJson = {
                action: action,
                messages: [
                    {
                        id: generateUUID(),
                        author: {
                            role: "user"
                        },
                        content: {
                            content_type: "text",
                            parts: [prompt]
                        },
                        metadata: {}
                    }
                ],
                parent_message_id: parentMessageId,
                model: model || 'text-davinci-002-render',
                conversation_id: conversationId??undefined
                ,
                ...more
            };

            if(arkoseToken) {
                messageJson.arkoseToken
                =arkoseToken;
            
            } else {
                console.log("GETTING")
                if(model == "gpt-4") {
                    var tok = await getArkose(arkoseServer);
                    console.log("GOT",tok)
                    if(tok) {
                        messageJson.arkoseToken
                        =tok;
                    }
                }
            }
            
            headers = { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer ' + authorizationToken,
                ...customHeaders
            }
        
            var requestOptions = {
                method: 'POST',
                headers,
                body: JSON.stringify(messageJson)
            };
        
            return requestOptions;
        }

        // This is the URL to which we send our JSON data.
        // Like the tree of life in Kabbalah, it's the central point from which all creation flows.
        var URL = "https://chatgpt.com/backend-api/conversation";
        
        var json = await generateMessageJson()
        console.log("Sending: ",json)
        // Fetch API sends the request to the URL with our generated JSON data.
        // Like casting a spell in Kabbalah, we're asking the universe (or at least the server) to do something.
        var response = await customFetch(URL, json);
        // We're creating a reader and a decoder to read and decode the incoming stream of data.
        var reader = response.body.getReader();
        var decoder = new customTextEncoder("utf-8");
        // Buffer will hold the accumulated chunks of data as they come in.
        let buffer = '';
        var last;
        
        // processStream function is an infinite loop that processes incoming chunks of data.
        async function processStream() {
            for (;;) {
                // We read a chunk of data from the stream.
                var { done, value } = await reader.read();
                
                // If there's no more data (done is true), we break the loop.
                if (done) {
                    console.log('Stream complete');
                    
                    return last;
                }
                
                // We add the decoded chunk of data to the buffer.
                buffer += decoder.decode(value, {stream: true});
                console.log("GOT it?", buffer)
                if(buffer == "Internal Server Error") {
                    return response.headers
                }
                let lineEnd;
                
                // As long as there are line breaks in the buffer, we process the lines.
                while ((lineEnd = buffer.indexOf('\n')) !== -1) {
                    // We slice a line from the buffer.
                    var line = buffer.slice(0, lineEnd);
                    // We remove the processed line from the buffer.
                    buffer = buffer.slice(lineEnd + 1);
                    
                    // If the line starts with 'data: ', it's a message from the server.
                    if (line.startsWith('data: ')) {
                    var jsonStr = line.slice(6);
                    
                    // If the message contains '[DONE]', the server is done sending messages.
                    if(jsonStr.trim().includes("[DONE]")) {
                        if(print)
                            console.log("Done! Info:",last)
                        
                        // If ondone is a function, we call it with the last message.
                        if(typeof(ondone) == "function") {
                            ondone(last);
                            return last;
                        }
                    } else {
                        try {
                            var jsonData = JSON.parse(jsonStr);
                            
                            // If the message contains content, we process it.
                            if (jsonData && jsonData.message && jsonData.message.content) {
                            // If onstream is a function, we call it with the incoming message.
                            if(typeof(onstream) == "function") {
                                onstream(jsonData)
                            } else {
                                if(print)
                                    console.log(jsonData.message.content.parts[0]);
                            }

                            var messageID = jsonData.message.id
                            self._lastMessageId = messageID;
                            var convo = jsonData.conversation_id;
                            self._conversationId = convo;
                            //make title
                            try {
                                if(!self.sessionName) {
                                    var newTitleFetch = await customFetch(nameURL(convo), {
                                        headers,
                                        body: JSON.stringify({
                                            message_id: messageID
                                        }),
                                        method: "POST"
                                    });
                                    var newTitle = await newTitleFetch.text();
                                    self.sessionName = newTitle;
                                    console.log("New name!",self.sessionName);
                                }
                            } catch(e) {
                                console.log(e)
                            }
                            // We keep track of the last message.
                            last = jsonData;
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
            var res = await processStream();
            if(print)
                console.log(res, "finished");
                
            return res;
        }catch(e) {
            console.log(err => console.error('Stream error:', err));
        }


        

    }
}

async function getAuthToken() {
    var sesh = await fetch(
        "https://chatgpt.com/api/auth/session"
    );
    var j = await sesh.json();
    var token = j.accessToken;
    if(token) {
        return token;
    } else return null;//console.log("problem getting token")
}

async function getArkose(arkoseServer) {
    try {
        var r= await fetch(arkoseServer)
    } catch(e) {
        return null;
    }
    var tx = await r.text()
    return tx;
}


function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


    window.AwtsmoosGPTify = AwtsmoosGPTify;
}

try {
    defineIt();
} catch(e) {
    console.log(e)
}
