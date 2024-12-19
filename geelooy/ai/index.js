//B"H

let activeAIService = 'chatgpt'; // 'chatgpt' or 'gemini'

const services = {
  chatgpt: {
    name: 'ChatGPT',
    async getConversationsFnc () {
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
        var res = d?.content?.parts?.[0];
        if (!res) res = d?.message?.content?.parts?.[0];
        if(res && d?.message?.author?.role == "assistant")
          ai.textContent = res;
     
      },
      onstream: (d) => {
        var res = d?.content?.parts?.[0];
        if (!res) res = d?.message?.content?.parts?.[0];
        if(res)
            ai.textContent = res
        
      
      },
    }),
  },
  gemini: {
    name: 'Gemini',
    promptFunction: async (userMessage, ai) => {
      if(!window.geminiApiKey) {
         window.geminiApiKey = prompt("What's your gemini API key?")
        
      }
      
      // Implement Gemini-specific logic here
      // Replace this with actual Gemini API logic
      var resp = await getGeminiResponse(userMessage, geminiApiKey)
      console.log(`Gemini is processing: ${userMessage}`);
      try {
        resp = JSON.parse(resp)
        var text = resp?.candidates?.[0]?.content?.parts?.[0]?.text
        return Promise.resolve(text);
      } catch(e) {
        return Promise.resolve(e.stack);
      }
      return Promise.resolve(resp); // Replace with real Gemini API call
    },
  },
};

async function getGeminiResponse(prompt, apiKey) {
 
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key='+apiKey; // Gemini API endpoint

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
    }

    // Once streaming is done, return the full response
    return result;

  } catch (error) {
    console.error('Error fetching from Gemini API:', error);
  }
}



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

function switchService(newService) {
  if (services[newService]) {
    activeAIService = newService;
    console.log(`Switched to ${services[newService].name}`);
  } else {
    console.log('Service not found!');
  }
}

// Fetch Conversations
async function fetchConversations() {
  var response = null;
  var serv = services[activeAIService]
  /*
    requires title and id
  */
  if(serv?.getConversationsFnc) {
    response = await serv?.getConversationsFnc()
  }

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
  var serv = services[activeAIService];
  var convo = null;
  if(serv?.getConversation) {
    convo = await serv?.getConversation?.(conversationId);
  }
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
  return msgs.filter(q=>
    ["user","assistant"].includes(q?.message?.author?.role) &&
    q?.message?.content?.parts?.[0]
  ).reverse();
}
// Render Messages
async function renderMessages(conversationId) {
  window.curConversationId = conversationId;
  chatBox.innerHTML = "";
  var messages = await traceConversation(conversationId);
 
  messages.forEach(addMessageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}
function addMessageDiv(m) {
  var message = m?.message;
  var msgHolder = document.createElement("div")
  const messageDiv = document.createElement("div");
  msgHolder.appendChild(messageDiv);
  var role = message.author.role === "user" ? "user" : "assistant";
  messageDiv.classList.add("message", role);
  messageDiv.textContent = message?.content?.parts?.[0];
  chatBox.appendChild(msgHolder);
  if(role == "assistant") {
    var audio = document.createElement("div")
    audio.classList.add("audio")
    audio.textContent = "Play / Download"
    msgHolder.appendChild(audio);
    audio.onclick = async () => {
      audio.textContent = "Downloading..."
    
      var res = await instance.functionCall("getAwtsmoosAudio", [{
        conversation_id: window?.curConversationId,
        message_id: m?.message?.id
      }]) 
      audio.textContent = "Got. Again?"
      console.log("Got",res)
    }
  }
  return messageDiv;
}

async function sendMessageToAi(prompt) {
  var userMessage = prompt;
   messageInput.value = prompt.trim();
  // Simulate adding user message
  if (instance?.conversation?.mapping) {
    const userMessageId = `id_${Date.now()}`;
    instance.conversation.mapping[userMessageId] = {
      id: userMessageId,
      message: userMessage,
      role: "user",
      parent: instance.conversation.current_node,
      children: [],
    };

    const parentMessage = instance.conversation.mapping[instance.conversation.current_node];
    parentMessage.children.push(userMessageId);
    if (instance.conversation)
      instance.conversation.current_node = userMessageId;
  }

  messageInput.value = "";

  addMessageDiv({
    message: {
      author: {
        role: "user"
      },
      content: {
        parts: [userMessage]
      }
    }
  });

  var ai = addMessageDiv({
    message: {
      author: {
        role: "assistant"
      },
      content: {
        parts: [""]
      }
    }
  });
  var currentService = services[activeAIService];

  // Call the active AI service's prompt function
  const response = await currentService.promptFunction(userMessage, ai);

  if (response) {
   // ai.textContent = response;
  }
  return response;
}
// Add Message Sending Logic
sendButton.addEventListener("click", async () => {
  const userMessage = messageInput.value.trim();
  if (!userMessage) return;
  await sendMessageToAi(userMessage);
  
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
