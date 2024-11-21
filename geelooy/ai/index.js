//B"H

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const sidebar = document.getElementById("sidebar");
const toggleSidebarButton = document.getElementById("toggle-sidebar");
const conversationList = document.getElementById("conversation-items");
const refreshButton = document.getElementById("refresh-conversations");

let conversationOffset = 0;
const conversationLimit = 26;

// Toggle Sidebar
toggleSidebarButton.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

// Load Messages for Selected Conversation
async function loadConversation(conversationId) {
  console.log(`Loading conversation: ${conversationId}`);
  // Fetch messages for this conversation...
  await renderMessages(conversationId); // Call to re-render messages
}

// Refresh Conversations List
async function refreshConversations() {
  conversationOffset = 0;
  conversationList.innerHTML = "";
  await fetchConversations();
}

// Fetch Conversations
async function fetchConversations() {
  const response = await instance.functionCall("getConversations", [
    { limit: conversationLimit, offset: conversationOffset },
  ]);

  const { items } = response;
  items.forEach((conversation) => {
    const listItem = document.createElement("li");
    listItem.textContent = conversation.title;
    listItem.dataset.id = conversation.id;

    listItem.addEventListener("click", () => {
      loadConversation(conversation.id);
    });

    conversationList.appendChild(listItem);
  });

  conversationOffset += conversationLimit;
}

// Handle Scroll to Load More Conversations
conversationList.addEventListener("scroll", async () => {
  if (
    conversationList.scrollTop + conversationList.clientHeight >=
    conversationList.scrollHeight
  ) {
    await fetchConversations();
  }
});

// Refresh Button Handler
refreshButton.addEventListener("click", refreshConversations);


async function traceConversation(conversationId) {
  var convo = await instance.functionCall("getConversation", [conversationId]);
  if(!convo) return alert("Couldn't find " + conversationId);
  var node = convo?.current_node;
  if(!node) return alert("no node");
  var map = convo?.mapping;
  if(!map) return alert("no map")
  var cur = map[node];
  var msgs = [];
  msgs.push(cur);
  while(cur) {
    node = cur.parent
    cur = map[node]
    if(cur) msgs.push(cur)
  }
  return msgs;
}
// Render Messages
async function renderMessages(conversationId) {
  chatBox.innerHTML = "";
  var messages = await traceConversation(conversationId);
  messages = messages.filter(q=>
    ["user","assistant"].includes(q?.message?.author?.role) &&
    q?.message?.content?.parts[0]
  ).reverse()
  messages.forEach((m) => {
    var message = m?.message;
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", message.author.role === "user" ? "user" : "assistant");
    messageDiv.textContent = message?.content?.parts?.[0];
    chatBox.appendChild(messageDiv);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

// Add Message Sending Logic
sendButton.addEventListener("click", async () => {
  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  // Simulate adding user message
  const userMessageId = `id_${Date.now()}`;
  if(instance.conversation.mapping) {
    instance.conversation.mapping[userMessageId] = {
      id: userMessageId,
      message: userMessage,
      role: "user",
      parent: instance.conversation.current_node,
      children: [],
    };

  const parentMessage = instance.conversation.mapping[instance.conversation.current_node];
  parentMessage.children.push(userMessageId);
  if(instance.conversation)
    instance.conversation.current_node = userMessageId;

  }
  messageInput.value = "";
  

  // Simulate assistant response
  const response = await instance.go({ prompt: userMessage });
  await renderMessages(conversationId);
});

async function start() {
  var g = window?.AwtsmoosGPTify;
  if(!g) {
    alert("Can't find it")
  }
  window.instance = new AwtsmoosGPTify();
  // Initial Fetch
  await fetchConversations();
}

onload = async () =>
  (async () => await start())();
