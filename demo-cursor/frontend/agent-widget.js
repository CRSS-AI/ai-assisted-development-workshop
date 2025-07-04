// Agent Widget (Floating Chat) - CRSS Branded with Conversation Memory
(function() {
  // Lightweight markdown to HTML converter (basic)
  function markdownToHtml(md) {
    let html = md
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // italics
      .replace(/`([^`]+)`/g, '<code>$1</code>') // inline code
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>') // links
      .replace(/^\s*\n/gm, '<br>') // newlines
      .replace(/\n\s*\n/g, '<br><br>') // double newlines
      .replace(/^- (.*)$/gm, '<li>$1</li>'); // unordered list
    // Wrap <li> in <ul> if any
    if (/<li>/.test(html)) html = '<ul>' + html + '</ul>';
    return html;
  }

  // Inject styles
  const style = document.createElement('style');
  style.innerHTML = `
#agent-widget-btn {
  position: fixed; bottom: 30px; right: 30px; z-index: 9999;
  background: #F26B01; color: #fff; border-radius: 50%; width: 60px; height: 60px;
  display: flex; align-items: center; justify-content: center; font-size: 30px; cursor: pointer;
  box-shadow: 0 4px 12px rgba(30,64,127,0.15);
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: box-shadow 0.2s;
}
#agent-widget-btn:hover {
  box-shadow: 0 8px 24px rgba(242,107,1,0.18);
}
#agent-widget-chat {
  display: none; position: fixed; bottom: 100px; right: 30px; z-index: 9999;
  width: 340px; max-width: 95vw; height: 420px; max-height: 80vh;
  background: #fff; flex-direction: column; overflow: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
  border-radius: 18px; box-shadow: 0 8px 32px rgba(30,64,127,0.18);
  border: 1px solid #e9ecef;
  transition: box-shadow 0.2s;
}
@media (max-width: 500px) {
  #agent-widget-chat {
    width: 98vw; right: 1vw; left: 1vw; bottom: 80px; height: 70vh; max-height: 90vh;
    border-radius: 12px;
  }
}
#agent-widget-chat-header {
  background: #1E407F; color: #fff; font-weight: bold; font-size: 16px;
  display: flex; justify-content: space-between; align-items: center;
  height: 56px;
  line-height: 56px;
  padding: 0 16px;
}
#agent-widget-chat-header .close-btn {
  background: none; border: none; color: #fff; font-size: 22px; cursor: pointer;
  padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  align-self: center;
  margin-left: 8px;
}
#agent-widget-chat-messages {
  flex: 1; overflow-y: auto; padding: 14px 12px; background: #f8f9fa;
}
.message {
  margin-bottom: 10px; padding: 9px 13px; border-radius: 16px; max-width: 80%;
  word-wrap: break-word; line-height: 1.4; font-size: 14px;
}
.message.user {
  background: #1E407F; color: #fff; margin-left: auto; border-bottom-right-radius: 4px;
}
.message.agent {
  background: #F26B01; color: #fff; margin-right: auto; border-bottom-left-radius: 4px;
}
.message.agent .content {
  line-height: 1.5;
}
.message.agent .content strong { font-weight: 600; }
.message.agent .content em { font-style: italic; }
.message.agent .content code { 
  background: rgba(255,255,255,0.2); padding: 2px 4px; border-radius: 3px; font-family: monospace;
}
.message.agent .content a { color: #fff; text-decoration: underline; }
.message.agent .content ul { margin: 8px 0; padding-left: 20px; }
.message.agent .content li { margin: 4px 0; }
#agent-widget-chat-input {
  padding: 12px; background: #fff; border-top: 1px solid #e9ecef;
  display: flex; gap: 8px; align-items: center;
}
#agent-widget-chat-input input {
  flex: 1; padding: 9px 13px; border: 2px solid #e9ecef; border-radius: 20px;
  font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif;
  outline: none; transition: border-color 0.2s;
}
#agent-widget-chat-input input:focus {
  border-color: #1E407F;
}
#agent-widget-chat-input button {
  background: #F26B01; color: #fff; border: none; border-radius: 50%; width: 38px; height: 38px;
  cursor: pointer; font-size: 16px; font-weight: bold; display: flex; align-items: center; justify-content: center;
  transition: background-color 0.2s;
}
#agent-widget-chat-input button:hover {
  background: #d55a00;
}
#agent-widget-chat-input button:disabled {
  background: #ccc; cursor: not-allowed;
}
.typing-indicator {
  display: none; padding: 9px 13px; background: #F26B01; color: #fff; border-radius: 16px;
  margin-right: auto; border-bottom-left-radius: 4px; max-width: 80%; font-size: 14px;
}
.typing-indicator span {
  display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #fff;
  margin: 0 1.5px; animation: typing 1.4s infinite ease-in-out;
}
.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
@keyframes typing {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}
`;

  document.head.appendChild(style);

  // Create widget HTML
  const widgetHTML = `
    <div id="agent-widget-btn" title="Chat with CRSS Assistant">💬</div>
    <div id="agent-widget-chat">
      <div id="agent-widget-chat-header">
        <span>CRSS Assistant</span>
        <button class="close-btn" title="Close chat">×</button>
      </div>
      <div id="agent-widget-chat-messages">
        <!-- Messages will be appended here -->
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div id="agent-widget-chat-input">
        <input type="text" placeholder="Type your message..." maxlength="500">
        <button title="Send message">→</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  // Get elements
  const btn = document.getElementById('agent-widget-btn');
  const chat = document.getElementById('agent-widget-chat');
  const closeBtn = document.querySelector('.close-btn');
  const messagesContainer = document.getElementById('agent-widget-chat-messages');
  const input = document.querySelector('#agent-widget-chat-input input');
  const sendBtn = document.querySelector('#agent-widget-chat-input button');
  const typingIndicator = document.querySelector('.typing-indicator');

  // Conversation state
  let conversationId = null;
  let isTyping = false;

  // Show/hide typing indicator
  function showTyping() {
    isTyping = true;
    typingIndicator.style.display = 'block';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function hideTyping() {
    isTyping = false;
    typingIndicator.style.display = 'none';
  }

  // Add message to chat
  function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    if (type === 'agent') {
      messageDiv.innerHTML = `<div class="content">${markdownToHtml(content)}</div>`;
    } else {
      messageDiv.textContent = content;
    }
    // Insert before typing indicator so typing stays at the bottom
    messagesContainer.insertBefore(messageDiv, typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Send message to backend
  async function sendMessage(message) {
    try {
      showTyping();
      
      const response = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversation_id: conversationId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store conversation ID for future messages
      if (data.conversation_id) {
        conversationId = data.conversation_id;
      }
      
      hideTyping();
      addMessage(data.reply, 'agent');
      
    } catch (error) {
      console.error('Error sending message:', error);
      hideTyping();
      addMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', 'agent');
    }
  }

  // Handle send button click
  function handleSend() {
    const message = input.value.trim();
    if (message && !isTyping) {
      addMessage(message, 'user');
      input.value = '';
      sendMessage(message);
    }
  }

  // Event listeners
  btn.addEventListener('click', () => {
    btn.style.display = 'none';
    chat.style.display = 'flex';
    input.focus();
  });

  closeBtn.addEventListener('click', () => {
    chat.style.display = 'none';
    btn.style.display = 'flex';
  });

  sendBtn.addEventListener('click', handleSend);

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  });

  // Close chat when clicking outside (optional)
  document.addEventListener('click', (e) => {
    if (chat.style.display === 'flex' && 
        !chat.contains(e.target) && 
        !btn.contains(e.target)) {
      chat.style.display = 'none';
      btn.style.display = 'flex';
    }
  });

  // Welcome message when chat is first opened
  let hasShownWelcome = false;
  btn.addEventListener('click', () => {
    if (!hasShownWelcome) {
      setTimeout(() => {
        addMessage('Ask a question to start chatting with CRSS Assistant.', 'agent');
        hasShownWelcome = true;
      }, 500);
    }
  });

})(); 