//B"H
import AIServiceHandler from "./aiService.js"
import {markdownToHtml} from "/heichelos/post/parsing.js";
console.log(`B"H
Welcome to the part`)
// DOM Interaction Class
class DOMHandler {
  constructor(aiHandler) {
    this.aiHandler = aiHandler;
    this.chatBox = document.getElementById("chat-box");
    this.newChat = document.getElementById("new-chat");
    this.messageInput = document.getElementById("message-input");
    this.sendButton = document.getElementById("send-button");
    this.sidebar = document.getElementById("sidebar");
    this.toggleSidebarButton = document.getElementById("toggle-sidebar");
    this.conversationList = document.getElementById("conversation-items");
    this.refreshButton = document.getElementById("refresh-conversations");
    this.conversationOffset = 0;
    this.conversationLimit = 26;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.toggleSidebarButton.addEventListener("click", () => {
      this.sidebar.classList.toggle("hidden");
    });

    this.refreshButton.addEventListener("click", () => this.refreshConversations());

    this.conversationList.addEventListener("scroll", async () => {
      if (
        this.conversationList.scrollTop + this.conversationList.clientHeight >=
        this.conversationList.scrollHeight
      ) {
        await this.fetchConversations();
      }
    });

    this.sendButton.addEventListener("click", () => this.sendMessage());
    if(this.newChat) {
      this.newChat.onclick = async () => {
        
        this.chatBox.innerHTML ="";
        var selectedService = this.serviceSelect.value;
        updateSearchParams({
          awtsmoosAi: selectedService
        });
        window?.aiHandler?.newConversation();
      }
    }
  }

  async refreshConversations() {
    this.conversationOffset = 0;
    this.conversationList.innerHTML = "";
    await this.fetchConversations();
  }

  async fetchConversations() {
    const service = await this.aiHandler.getActiveService();
    const response = service.getConversationsFnc
      ? await service.getConversationsFnc()
      : null;
    if (!response) return;

    const { items } = response;
    items.forEach((conversation) => {
      const listItem = document.createElement("li");
      listItem.textContent = conversation.title;
      listItem.dataset.id = conversation.id;
      listItem.addEventListener("click", () => this.loadConversation(conversation.id));
      this.conversationList.appendChild(listItem);
    });

    this.conversationOffset += this.conversationLimit;
  }

  async loadConversation(conversationId) {
    console.log(`Loading conversation: ${conversationId}`);
    // Fetch messages for this conversation...
    var selectedService = this.serviceSelect.value;
    
    updateSearchParams({
      awtsmoosConversation: conversationId,
      awtsmoosAi: selectedService
    })
    var conv = getConvo();
    window.curConverstaionId = conv;
    await this.renderMessages(conversationId);
  }

  async renderMessages(conversationId) {
    this.chatBox.innerHTML = "";
    const messages = await this.traceConversation(conversationId);
    messages.forEach(this.addMessageDiv.bind(this));
    this.chatBox.scrollTop = this.chatBox.scrollHeight;
  }

  async traceConversation(conversationId) {
    const service = await this.aiHandler.getActiveService();
    const convo = service.getConversation
      ? await service.getConversation(conversationId)
      : null;
    if (!convo) return [];

    return convo;
  }

  addMessageDiv(m) {
    var message = m?.message;
    var msgHolder = document.createElement("div")
    const messageDiv = document.createElement("div");
    
    msgHolder.appendChild(messageDiv);
    var role = message.author.role === "user" ? "user" : "assistant";
    messageDiv.classList.add("message", role);
    msgHolder.classList.add(role == "user" ? "end-flow" : "start-flow");
    messageDiv.textContent = message?.content?.parts?.[0];
    this.chatBox.appendChild(msgHolder);
    if(role == "assistant") {
      messageDiv.innerHTML = markdownToHtml(messageDiv.textContent);
      var audio = document.createElement("div")
      audio.classList.add("audio")
      audio.textContent = "Play / Download"
      msgHolder.appendChild(audio);
      audio.onclick = async () => {
        audio.textContent = "Downloading..."
        const service = await this?.aiHandler?.getActiveService();
        var s = new URLSearchParams(location.search);
        var convo = s.get("awtsmoosConversation")
        if(!convo) {
          audio.textContent = "Couldn't find conversation. Try again?"
          return;
        }
        window.curConversationId = convo;
        var res = await service?.getAwtsmoosAudio({
          conversation_id: window?.curConversationId,
          message_id: m?.message?.id
        })
        audio.textContent = "Got. Again?"
        console.log("Got",res)
      }
    }
    return messageDiv;
  }

  async sendMessage() {
    const userMessage = this.messageInput.value;
    if (!userMessage) return;
    this.messageInput.value = "";

    var user = this.addMessageDiv({
      message: {
        author: {
          role: "user"
        },
        content: {
          parts: [userMessage]
        }
      }
    });

    var ai = this.addMessageDiv({
      message: {
        author: {
          role: "assistant"
        },
        content: {
          parts: [""]
        }
      }
    });
    const service = await this.aiHandler.getActiveService();
    var convo = getConvo();
  window.curConversationId = convo;
    var self = this;
    const response = await service.promptFunction(userMessage, {
      conversationId:convo,
      remember:true,
      onstream(d) {
        ai.innerHTML = markdownToHtml(d);
        scrollDown(self.chatBox)
      },
      ondone(d) {
        ai.innerHTML = markdownToHtml(d);
        scrollDown(self.chatBox);
      }
      
    });
   
    var oth = response?.awtsmoos?.otherEvents
    var conversationIdNode = oth?.find(w=>w.conversation_id);
    var conversationId = conversationIdNode?.conversation_id
    window.mostRecentResponse = response;
    console.log(response, conversationId, conversationIdNode, oth);
    
    if(conversationId) {
        var selectedService = this.serviceSelect.value;
        updateSearchParams({
          awtsmoosConversation: conversationId,
          awtsmoosAi: selectedService
        });
    }
    return response?.content?.parts[0]
  }
}

function scrollDown(d) {
  if(!d) return
  d.scrollTop = d.scrollHeight;
}

    //B"H
function updateSearchParams(params) {
  const newParams = new URLSearchParams(params);
  const baseUrl = window.location.href.split('?')[0]; // Remove existing params
  const newUrl = baseUrl + (newParams.toString() ? `?${newParams.toString()}` : ''); //Add new params

  window.history.pushState({}, '', newUrl);
}


// Initialization


document.addEventListener('DOMContentLoaded', (async () => {
  const aiHandler = new AIServiceHandler();
  console.log("DId some stuff")
  await aiHandler.init();
  console.log("initted")
  window.aiHandler = aiHandler;
  const domHandler = new DOMHandler(aiHandler);
  var serviceSelect = document.getElementById('ai-service-select');
    domHandler.serviceSelect = serviceSelect;
    var sr = new URLSearchParams(location.search);
    var val = sr.get("awtsmoosAi");
    if(val) {
      serviceSelect.value = val;
      aiHandler.switchService(val)
    }
    serviceSelect.addEventListener('change', async (e) => {
      var selectedServiceVal = e.target.value;
      aiHandler.switchService(selectedServiceVal);
      domHandler.chatBox.innerHTML = "";
     
      updateSearchParams({
        awtsmoosAi: selectedServiceVal
      });
      domHandler.refreshConversations();
    });
  window.sendMessageToAi = async (prompt) => {
     domHandler.messageInput.value = prompt;
     return await domHandler.sendMessage()
  }

  console.log("Starting up")
  
  setTimeout(async () => {
    var search = new URLSearchParams(location.search);
    var convo = search.get("awtsmoosConversation");
    if(convo) {
      console.log("Conversation",convo);
      
      await domHandler.loadConversation(convo);
    }
    console.log("Trying")
    await domHandler.refreshConversations();
  },1000)
}));
console.log("Nice")

function getConvo() {
  var search = new URLSearchParams(location.search);
  var convo = search.get("awtsmoosConversation");
  return convo;
}
