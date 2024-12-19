//B"H


import IndexedDBHandler from "./IndexedDBHandler.js";
// AI Communication Class
class AIServiceHandler {
  async init() {
      await this.dbHandler.init();
      if(window.AwtsmoosGPTify) {
        window.instance = new AwtsmoosGPTify();
      }
  }
  conversationLimit = 26;

  conversationOffset = 0;
  constructor() {
    this.dbHandler = new IndexedDBHandler('AIAppDB');
    
    this.activeAIService = 'chatgpt';
    this.services = {
      chatgpt: {
        name: 'ChatGPT',
        async getConversationsFnc() {
          return instance.functionCall("getConversations", [
            { limit: this.conversationLimit, offset: this.conversationOffset },
          ]);
        },
        async getConversation(conversationId) {
          return await instance.functionCall("getConversation", [conversationId]);
        },
        promptFunction: async (userMessage, {
          onstream = null,
          ondone = null
        }={}) => instance.go({
          prompt: userMessage,
          ondone: (d) => {
            var res = d?.content?.parts?.[0] || d?.message?.content?.parts?.[0];
            if (res && d?.message?.author?.role == "assistant")
              ondone(res);
          },
          onstream: (d) => {
            var res = d?.content?.parts?.[0] || d?.message?.content?.parts?.[0];
            if (res) onstream(res)
          },
        }),
      },
      gemini: {
        name: 'Gemini',
        promptFunction: async (userMessage, {
          onstream = null,
          ondone = null
        }={}) => {
          if (!window.geminiApiKey) {
            window.geminiApiKey = prompt("What's your Gemini API key?");
            await this.dbHandler.write('keys', { id: 'gemini', key: window.geminiApiKey });
          }
          var amount = ""
          const resp = await getGeminiResponse(userMessage, window.geminiApiKey, {
            onstream(resp) {
            try {
              const ar = JSON.parse(resp);
              for(var parsedResp of ar) {
                var res = parsedResp?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
                amount += res;
                onstream?.(res);
              }
            } catch (e) {
            //  return `Error: ${e.message}`;
            }                  
          
          return amount;
            }
        })
          
        }
      }
    };
  }

  switchService(newService) {
    if (this.services[newService]) {
      this.activeAIService = newService;
      console.log(`Switched to ${this.services[newService].name}`);
    } else {
      console.log('Service not found!');
    }
  }

  async getActiveService() {
    return this.services[this.activeAIService];
  }
}


async function getGeminiResponse(prompt, apiKey, onstream) {
 
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key='+apiKey; // Gemini API endpoint

  // Prepare the request headers
  const headers = {
    'Content-Type': 'application/json'
  };

  // Prepare the request body
  const requestBody = {
    contents: [
        {
            parts: [
                {
                    text: prompt
                }
            ]
        }
    ]
  };

  try {
    // Send the request to the Gemini API with fetch
    const response = await fetch(`${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Read the response stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    // Loop to read the chunks of data as they come
    while (true) {
      const { done, value } = await reader.read();

      if (done) break; // Exit the loop when the stream ends

      // Decode the chunk and append to the result
      result += decoder.decode(value, { stream: true });

      // Log the partial response (you can update your UI here)
      console.log(result);
      onstream?.(result)
    }

    // Once streaming is done, return the full response
    return result;

  } catch (error) {
    console.error('Error fetching from Gemini API:', error);
  }
}

export default AIServiceHandler;
