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
 * 
 * AwtsmoosGPTify({
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

var _lastMessageId = null;
var _conversationId = null;

async function AwtsmoosGPTify({
    prompt, 
    onstream, 
    ondone, 
    action = "next",
    parentMessageId = _lastMessageId, 
    model, 
    conversationId = _conversationId,
    timezoneOffsetMin = 240, 
    historyAndTrainingDisabled = false, 
    arkoseToken = "", 
    authorizationToken = "",
    print=true
}) {
    if(!parentMessageId) {
        parentMessageId = generateUUID();
    }

    if(!authorizationToken) {
        var sesh = await fetch(
            "https://chatgpt.com/api/auth/session"
        );
        var j = await sesh.json();
        var token = j.accessToken;
        if(token) {
            authorizationToken = token
        } else console.log("problem getting token")
    }
    if(print)
        console.log("par",parentMessageId)
    /**
     * @function generateMessageJson
     * @description - Generates the JSON structure to be sent to the server
     * @returns {Object} - The request options object
     */
    function generateMessageJson() {

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
        };
    
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authorizationToken },
            body: JSON.stringify(messageJson)
        };
    
        return requestOptions;
    }

    // This is the URL to which we send our JSON data.
    // Like the tree of life in Kabbalah, it's the central point from which all creation flows.
    var URL = "https://chatgpt.com/backend-api/conversation";
    
    // Fetch API sends the request to the URL with our generated JSON data.
    // Like casting a spell in Kabbalah, we're asking the universe (or at least the server) to do something.
    var response = await fetch(URL, generateMessageJson());
    
    // We're creating a reader and a decoder to read and decode the incoming stream of data.
    var reader = response.body.getReader();
    var decoder = new TextDecoder("utf-8");
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
                        _lastMessageId = messageID;
                        var convo = jsonData.conversation_id;
                        _conversationId = convo;
                        
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


function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
