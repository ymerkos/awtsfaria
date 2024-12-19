//B"H

export default AIServiceHandler;
// AI Communication Class
class AIServiceHandler {
  constructor() {
    this.activeAIService = 'chatgpt';
    this.services = {
      chatgpt: {
        name: 'ChatGPT',
        async getConversationsFnc() {
          return instance.functionCall("getConversations", [
            { limit: conversationLimit, offset: conversationOffset },
          ]);
        },
        async getConversation(conversationId) {
          return await instance.functionCall("getConversation", [conversationId]);
        },
        promptFunction: async (userMessage, ai) => instance.go({
          prompt: userMessage,
          ondone: (d) => {
            var res = d?.content?.parts?.[0] || d?.message?.content?.parts?.[0];
            if (res && d?.message?.author?.role == "assistant")
              ai.textContent = res;
          },
          onstream: (d) => {
            var res = d?.content?.parts?.[0] || d?.message?.content?.parts?.[0];
            if (res) ai.textContent = res;
          },
        }),
      },
      gemini: {
        name: 'Gemini',
        promptFunction: async (userMessage, ai) => {
          if (!window.geminiApiKey) {
            window.geminiApiKey = prompt("What's your Gemini API key?");
            await dbHandler.write('keys', { id: 'gemini', key: window.geminiApiKey });
          }
          const resp = await getGeminiResponse(userMessage, window.geminiApiKey);
          try {
            const parsedResp = JSON.parse(resp);
            return parsedResp?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
          } catch (e) {
            return `Error: ${e.message}`;
          }
        },
      },
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
