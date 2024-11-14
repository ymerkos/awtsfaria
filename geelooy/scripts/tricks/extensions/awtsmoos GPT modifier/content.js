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
    //B"H
class AwtsmoosGPTify {
    _lastMessageId = null;
    _conversationId = null;
    sessionName = null;
    
    constructor({
        parentMessageId = null,
        conversationId = null
    } = {}) {
        this._conversationId = conversationId;
        this._lastMessageId = parentMessageId;
        this.getAwtsmoosAudio = getAwtsmoosAudio;
    }
    
    async go({
        prompt,
        onstream,
        ondone,
        action = "next",
        parentMessageId = this._lastMessageId,
        model ="auto",
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
        }) {
        var self = this;
        var headers = null;

        if(!authorizationToken) {
                var token = await getAuthToken();
                if(token) {
                    authorizationToken = token
                } else {
                    console.log("problem getting token")
                }
        }
        var awtsmoosToikens = await awtsmoosifyTokens();
        var nameURL = convoId =>
        `https://chatgpt.com/backend-api/conversation/gen_title/${convoId}`
	if(!parentMessageId) {
		var co=await getConversation(
			conversationId,
			authorizationToken

		)
		parentMessageId=co?.currentNode;

	}
        if(!parentMessageId && !conversationId) {
            parentMessageId = generateUUID();
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

            

            headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authorizationToken,
                ...customHeaders,
		        ...(awtsmoosToikens)
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
       var res =  await logStream(response, async (c)=>{
		console.log(c)

	});

	if(typeof(ondone) == "function") {
                            ondone(res);
                            
	}
	return res;

    /*
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

        var messageID = jsonData.message.id
        self._lastMessageId = messageID;
        var convo = jsonData.conversation_id;
        self._conversationId = convo;
    */
	



    }
}

async function logStream(response, callback) {
   var hasCallback = typeof(callback) == "function";
   var myCallback =  hasCallback ? callback : () => {};
    var result = []
    // Check if the response is okay
    if (!response.ok) {
        console.error('Network response was not ok:', response.statusText);
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = '';
    var curEvent = null;
    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            console.log('Stream finished');
            break;
        }

        // Decode the current chunk and add to the buffer
        buffer += decoder.decode(value, { stream: true });

        // Split buffer into lines
        const lines = buffer.split('\n');

        // Process each line
        for (let line of lines) {
            line = line.trim(); // Remove whitespace

            // Check if the line starts with "event:" or "data:"
            if (line.startsWith('event:')) {
                const event = line.substring(6).trim(); // Extract event type
                curEvent = event;

            } else if (line.startsWith('data:')) {
                const data = line.substring(5).trim(); // Extract data


                // Attempt to parse the data as JSON
                try {
                    const jsonData = JSON.parse(data);
                    if(!hasCallback)
                        console.log('Parsed JSON Data:', jsonData);
        var k={data:jsonData, event: curEvent}
        result. push(k)
                    myCallback?.(k)
                } catch (e) {
                    if(!hasCallback)
                        console.warn('Data is not valid JSON:', data);
        var k=({dataNoJSON: data,  event: curEvent, error:e})
        result.push(k);
                    myCallback?.(k)
                }
            }
        }

        // Clear the buffer if the last line was complete
        if (lines[lines.length - 1].trim() === '') {
            buffer = '';
        } else {
            // Retain incomplete line for next iteration
            buffer = lines[lines.length - 1];
        }
    }
}



async function getAwtsmoosAudio({
    message_id, 
    conversation_id,
    voice = "orbit",
    format = "aac"
}) {
    var session = (await (await fetch("https://chatgpt.com/api/auth/session")).json())
    var token = session.accessToken;
    var convo = await getConversation(conversation_id, token)
    if(!message_id) message_id = convo?.current_node;
    var blob = await (
        await fetch("https://chatgpt.com/backend-api/synthesize?message_id="
            + message_id  
            + "&conversation_id=" + 
              conversation_id
            + "&voice=" + voice
            + "&format=" + format, {
            headers: {
                authorization: "Bearer " + token
            }
        })
    ).blob()
    var a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "BH_awtsmoosAudio_" + Date.now() + "." + format;
    a.click()
}
	
async function getConversation(conversation_id, token) {
    return (await (await fetch("https://chatgpt.com/backend-api/conversation/" + conversation_id, {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "authorization": "Bearer "+token,

      },
      "method": "GET"
    })).json())
}
async function awtsmoosifyTokens() {
        g=await import("https://cdn.oaistatic.com/assets/i5bamk05qmvsi6c3.js")
        z = await g.bk() //chat requirements

        r =  await g.bi(z.turnstile.bx) //turnstyle token
        arkose = await g.bl.getEnforcementToken(z)
        p = await g.bm.getEnforcementToken(z) //p token

        //A = fo(e.chatReq, l ?? e.arkoseToken, e.turnstileToken, e.proofToken, null)

        return g.fX(z,arkose, r, p, null)
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
