//B"H


import IndexedDBHandler from "./IndexedDBHandler.js";
// AI Communication Class
class AIServiceHandler {
  geminiChatCache = null
  async init() {
      await this.dbHandler.init();
      if(window.AwtsmoosGPTify) {
        window.instance = new AwtsmoosGPTify();
      }
  }

  async saveConversation() {
        const conversationId = crypto.randomUUID();  // Generate a unique ID for the new conversation
        const conversationData = {
            conversationId,
            contents: this.geminiChatCache.contents,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString() 
        };

        await this.dbHandler.write('conversations', conversationData);
        return conversationId;  // Return the ID of the new conversation
    }
    
    async updateConversation(conversationId) {
      const existingConversation = await this.dbHandler.read('conversations', conversationId);
  
      if (existingConversation) {
          existingConversation.contents = this.geminiChatCache.contents;  // Update contents
          existingConversation.updatedAt = new Date().toISOString();  // Update the updatedAt timestamp
          await this.dbHandler.write('conversations', existingConversation);  // Save updated conversation
      } else {
          throw new Error('Conversation not found!');
      }
  }

    async getConversation(conversationId) {
        const conversation = await this.dbHandler.read('conversations', conversationId);
        return conversation;
    }

    async loadConversation(conversationId) {
      var convo = await getConversation(conversationId);
      this.geminiChatCache = convo;
    }

    // Retrieve a paginated list of conversations, ordered by updatedAt (descending)
    async getConversations(pageSize = 10, offset = 0) {
        return new Promise((resolve, reject) => {
            const tx = this.dbHandler.db.transaction('conversations', 'readonly');
            const store = tx.objectStore('conversations');
            const conversations = [];
    
            const request = store.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
    
                if (cursor) {
                    conversations.push(cursor.value);
                    cursor.continue();
                } else {
                    // Sort by updatedAt in descending order, then apply pagination
                    conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    const paginatedConversations = conversations.slice(offset, offset + pageSize);
                    resolve(paginatedConversations);
                }
            };
    
            request.onerror = (err) => {
                reject(err.target.error);
            };
        });
    }
  conversationLimit = 26;

  conversationOffset = 0;
  constructor() {
    this.dbHandler = new IndexedDBHandler('AIAppDB');
    

    this.activeAIService = 'chatgpt';
    var self = this;
    this.services = {
      chatgpt: {
        name: 'ChatGPT',
        async getConversationsFnc() {
          return instance.functionCall("getConversations", [
            { limit: this.conversationLimit, offset: this.conversationOffset },
          ]);
        },
        async getConversation(conversationId) {
          var convo = await instance.functionCall("getConversation", [conversationId]);
          const { mapping, current_node } = convo;
          const msgs = [];
          let cur = mapping[current_node];
          while (cur) {
            msgs.push(cur);
            cur = mapping[cur.parent];
          }
          return msgs
            .filter((q) =>
              ["user", "assistant"].includes(q?.message?.author?.role) &&
              q?.message?.content?.parts?.[0]
            )
            .reverse();
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
        async getConversationsFnc(pageSize = 26, offset = 0) {
          return await getConversations(pageSize, offset)
        },
        async getConversation(conversationId) {
          var convo = await getConversation(conversationId);
          return convo;
        },
        promptFunction: async (userMessage, {
          onstream = null,
          ondone = null
        }={}) => {
          var {key} = await self.dbHandler.read("keys", "gemini")
          window.geminiApiKey = key;
          if (!window.geminiApiKey) {
            window.geminiApiKey = prompt("What's your Gemini API key?");
            await this.dbHandler.write('keys', { id: 'gemini', key: window.geminiApiKey });
          }
          if(!self.geminiChatCache) self.geminiChatCache = {
              contents: [
                  {
                      "role": "user",
                      parts: [
                          {
                              text: userMessage
                          }
                      ]
                  }
              ]
            };
          else {
            this.geminiChatCache.contents.push({role:"user",parts:[{text:userMessage}]})
          }
          var amount = ""
          
          const resp = await getGeminiResponse(this.geminiChatCache, window.geminiApiKey, {
           
              onstream(resp) {
              try {
                
                resp = resp.trim();
                if(resp[resp.length-1] !="]") {
                   resp+="]" 
                }
                const ar = JSON.parse(resp);
                amount = ""
                for(var parsedResp of ar) {
                  var res = parsedResp?.candidates?.[0]?.content?.parts?.[0]?.text || "";
                  amount += res;
                  onstream?.(res);
                }
              //  console.log("doing",amount,ar)
              } catch (e) {
              //  return `Error: ${e.message}`;
              }                  
            
              }
          })
          ondone?.(amount)
          self.geminiChatCache.contents.push({role:"model", parts: [{text:amount}]})
          //self.geminiChatCache.contents = trimChatMessage(self.geminiChatCache.contents, 950000);
          var id = null;
          try {
            id = await this.saveConversation();
          } catch(e) {}
          return {
            awtsmoos: {
              otherEvents: [
                {
                  conversationId: id
                }
              ]
            },
            content: [{parts:[{text:amount}]}]
          };
          
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


async function getGeminiResponse(chat, apiKey, {
  onstream = {}
}={}) {
 
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key='+apiKey; // Gemini API endpoint

  // Prepare the request headers
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Prepare the request body
  const requestBody = chat

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

      onstream?.(result)
    }

    // Once streaming is done, return the full response
    return result;

  } catch (error) {
    console.error('Error fetching from Gemini API:', error);
  }
}

function trimChatMessage(contents, threshold) {
  // Validate inputs
  if (!contents || !Array.isArray(contents) || contents.length === 0) {
    throw new Error("Invalid 'contents' parameter.  Must be a non-empty array.");
  }
  if (typeof threshold !== 'number' || threshold <= 0) {
    throw new Error("Invalid 'threshold' parameter. Must be a positive number.");
  }


  let totalTextLength = 0;
  for (const element of contents) {
    if (element.parts && Array.isArray(element.parts)) {
      for (const part of element.parts) {
        if (part.text && typeof part.text === 'string') {
          totalTextLength += part.text.length;
        } else {
          console.warn("Part element does not contain a 'text' string:", part);
        }
      }
    } else {
      console.warn("Unexpected element structure in contents:", element);
    }
  }

  while (totalTextLength > threshold) {
    if (contents.length === 0) {
      break; //Avoid error if trimming removes everything.
    }
    contents.shift(); // Remove the first element

    totalTextLength = 0;
    for (const element of contents) {
      if (element.role === 'user' && element.parts && Array.isArray(element.parts)) {
        for (const part of element.parts) {
          if (part.text && typeof part.text === 'string') {
            totalTextLength += part.text.length;
          }
        }
      }
    }
  }

  return contents;
}



export default AIServiceHandler;
