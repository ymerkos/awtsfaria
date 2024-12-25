//B"H
import {
    AwtsmoosPrompt
} from "/scripts/awtsmoos/api/utils.js";
import AwtsmoosGPTify from "./AwtsmoosGPTify.js";

import IndexedDBHandler from "./IndexedDBHandler.js";
// AI Communication Class

class AIServiceHandler {
  geminiChatCache = null
  async init() {
      await this.dbHandler.init();
      
      this.instance = new AwtsmoosGPTify();
      
  }

  async saveConversation(conversationId=null) {
        if(!conversationId) 
            conversationId = crypto.randomUUID();  // Generate a unique ID for the new conversation
        const conversationData = {
            conversationId,
            id:conversationId,
            title: "Awtsmoos Gemini Chat at "+new Date(),
            contents: this.geminiChatCache.contents,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString() 
        };

        await this.dbHandler.write('conversations', conversationId, conversationData);
        return conversationId;  // Return the ID of the new conversation
    }
    
    async updateConversation(conversationId) {
      const existingConversation = await this.dbHandler.read('conversations', conversationId);
  
      if (existingConversation) {
          existingConversation.contents = this.geminiChatCache.contents;  // Update contents
          existingConversation.updatedAt = new Date().toISOString();  // Update the updatedAt timestamp
          await this.dbHandler.write('conversations', conversationId, existingConversation);  // Save updated conversation
      } else {
          throw new Error('Conversation not found!');
      }
  }

    async getConversation(conversationId) {
        const conversation = await this.dbHandler.read('conversations', conversationId);
        this.geminiChatCache = conversation;
        return conversation;
    }

    async loadConversation(conversationId) {
      var convo = await getConversation(conversationId);
      
    }

    

    // Retrieve a paginated list of conversations, ordered by updatedAt (descending)
    async getConversations(pageSize = 10, offset = 0) {
        var items = await this.dbHandler.getAllData("conversations") || [];
        if(!Array.isArray(items)) {
            console.log("What is this",items);
            items = []
        }
        items = items.map(s=>Object.values(s)).flat()
        return {items};
    }
  conversationLimit = 26;

  conversationOffset = 0;
  constructor() {
    this.dbHandler = new IndexedDBHandler('AIAppDB');
    

    this.activeAIService = 'gemini';
    var self = this;
    this.services = {
      chatgpt: {
        name: 'ChatGPT',
        async getAwtsmoosAudio(...args) {
          return self?.instance?.getAwtsmoosAudio(...args)
        },
        async getConversationsFnc() {
          return self.instance.getConversations({ limit: this.conversationLimit, offset: this.conversationOffset })
        },
        async getConversation(conversationId) {
          var convo = await self.instance.getConversation(conversationId);
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
          ondone = null,
          conversationId = null
        }={}) => self.instance.go({
          prompt: userMessage,
          conversationId,
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
        async getAwtsmoosAudio(...args) {
          return null
        },
        async getConversationsFnc(pageSize = 26, offset = 0) {
          return await self.getConversations(pageSize, offset)
        },
        async getConversation(conversationId) {
            var convo = await self.getConversation(conversationId);
            var cont = convo?.contents;
            if(!cont) return []
            return cont.map(q => ({
                message: {
                    author: {
                        role: q.role
                    },
                    content: {
                        parts: q?.parts?.map(q=>q.text)
                    }
                }
            }))
        },
        promptFunction: async (userMessage, {
          onstream = null,
          ondone = null,
          remember = false
        }={}) => {
          var key = await self.dbHandler.read("api-keys", "gemini")
          
          window.geminiApiKey = key;
          if (!window.geminiApiKey) {
            window.geminiApiKey = await AwtsmoosPrompt.go({headerTxt: "What's your <a href='https://aistudio.google.com/apikey'>Gemini API key</a>?"});
            await this.dbHandler.write('api-keys', "gemini", window.geminiApiKey);
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
            if(remember)
              this.geminiChatCache.contents.push({role:"user",parts:[{text:userMessage}]})
          }
          var amount = ""
          
          const resp = await getGeminiResponse({contents:this.geminiChatCache.contents}, window.geminiApiKey, {
           
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
                  onstream?.(amount);
                }
              //  console.log("doing",amount,ar)
              } catch (e) {
              //  return `Error: ${e.message}`;
              }                  
            
              }
          })
          ondone?.(amount)
          if(remember) {
            self.geminiChatCache.contents.push({role:"model", parts: [{text:amount}]})
            self.geminiChatCache.contents = trimChatMessage(self.geminiChatCache.contents, 1000);
          } else {
             self.geminiChatCache = null;
          }
          var id = self.geminiChatCache.id;
          try {
            id = await self.saveConversation(id);
          } catch(e) {
              console.log(e)
          }
          return {
            awtsmoos: {
              otherEvents: [
                {
                  conversationId: id
                }
              ]
            },
            content: {parts:[{amount}]}
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
