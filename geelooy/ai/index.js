//B"H
import AIServiceHandler from "./aiService.js"
// DOM Interaction Class
class DOMHandler {
  constructor(aiHandler) {
    this.aiHandler = aiHandler;
    this.chatBox = document.getElementById("chat-box");
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
  }

  addMessageDiv(message) {
    const div = document.createElement("div");
    div.textContent = message?.message?.content?.parts?.[0];
    this.chatBox.appendChild(div);
  }

  async sendMessage() {
    const userMessage = this.messageInput.value;
    if (!userMessage) return;

    const service = await this.aiHandler.getActiveService();
    const response = await service.promptFunction(userMessage, this.chatBox);
    console.log(`Response: ${response}`);
  }
}

// Initialization
(async () => {
  const aiHandler = new AIServiceHandler();
  

  const domHandler = new DOMHandler(aiHandler);

  // Prompt user for AI service
  const serviceChoice = prompt("Which AI service would you like to use? (chatgpt/gemini)");
  aiHandler.switchService(serviceChoice);
})();
