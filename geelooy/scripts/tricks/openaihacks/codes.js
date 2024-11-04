//B"H
async function AwtsmoosGPTify({
    prompt = 'B"H' 
        + "\nHi! Tell me about the Atzmut, but spell it Awtsmoos",
    parent_message_id,
    conversation_id,
    callback = null,
    downloadAudio = false
}) {

    var session  =await getSession()

    var token = session.accessToken;
    var convo = await getConversation(conversation_id, token)
    if(!parent_message_id) parent_message_id = convo?.current_node;

    async function awtsmoosifyTokens() {
        g=await import("https://cdn.oaistatic.com/assets/i5bamk05qmvsi6c3.js")
        z = await g.bk() //chat requirements

        r =  await g.bi(z.turnstile.bx) //turnstyle token
        arkose = await g.bl.getEnforcementToken(z)
        p = await g.bm.getEnforcementToken(z) //p token

        //A = fo(e.chatReq, l ?? e.arkoseToken, e.turnstileToken, e.proofToken, null)

        return g.fX(z,arkose, r, p, null)
    }
    t = {
        "action": "next",
        "messages": [
            {
                "id": generateUID(),
                "author": {
                    "role": "user"
                },
                "content": {
                    "content_type": "text",
                    "parts": [
                        prompt
                    ]
                },
                "metadata": {
                    "serialization_metadata": {
                        "custom_symbol_offsets": []
                    }
                },
                "create_time": performance.now()
            }
        ],
        conversation_id,
        parent_message_id,
        "model": "auto",
        "timezone_offset_min": 300,
        "timezone": "America/New_York",
        "suggestions": [],
        "history_and_training_disabled": false,
        "conversation_mode": {
            "kind": "primary_assistant",
            "plugin_ids": null
        },
        "force_paragen": false,
        "force_paragen_model_slug": "",
        "force_rate_limit": false,
        "reset_rate_limits": false,
        "system_hints": [],
        "force_use_sse": true,
        "supported_encodings": [
            "v1"
        ],
        "conversation_origin": null,
        "client_contextual_info": {
            "is_dark_mode": false,
            "time_since_loaded": 121,
            "page_height": 625,
            "page_width": 406,
            "pixel_ratio": 1,
            "screen_height": 768,
            "screen_width": 1366
        },
        "paragen_stream_type_override": null,
        "paragen_cot_summary_display_override": "allow",
        "supports_buffering": true
    }


    function generateUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    await sendIt(await awtsmoosifyTokens(), t)

    
    async function sendIt(headers, body) {
        var g = await fetch("https://chatgpt.com/backend-api/conversation", {
          "headers": {
            "accept": "text/event-stream",
            "accept-language": "en-US,en;q=0.9",
            "authorization": "Bearer " + token,
            "content-type": "application/json",
            
            ...(headers)
          },
          body: JSON.stringify(t),
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        });
        await logStream(g)

        if(downloadAudio) {
            console.log("Generating audio maybe...")
            getAwtsmoosAudio({
               
                conversation_id
                
            })
        }
        
    }

    async function logStream(response) {
       var hasCallback = typeof(callback) == "function"
       var myCallback =  hasCallback ? callback : () => {};
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
                        myCallback?.({data:jsonData, event: curEvent})
                    } catch (e) {
                        if(!hasCallback)
                            console.warn('Data is not valid JSON:', data);
                        myCallback({dataNoJSON: data,  event: curEvent, error:e})
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



async function getSession() {
    return (await (await fetch("https://chatgpt.com/api/auth/session")).json())
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
