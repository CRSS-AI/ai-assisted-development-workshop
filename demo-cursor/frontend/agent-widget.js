// Agent Widget (Floating Chat) - CRSS Branded
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
  /* border: 2px solid #1E407F; */
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: box-shadow 0.2s;
}
#agent-widget-btn:hover {
  box-shadow: 0 8px 24px rgba(242,107,1,0.18);
}
#agent-widget-chat {
  display: none; position: fixed; bottom: 30px; right: 30px; z-index: 9999;
  width: 370px; height: 500px; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(30,64,127,0.18);
  flex-direction: column; overflow: hidden; flex: 1 1 auto;
  font-family: 'Plus Jakarta Sans', sans-serif;
  border: 1.5px solid #1E407F;
}
#agent-widget-chat-header {
  background: #1E407F; color: #fff; padding: 18px 18px 12px 18px; font-weight: bold; display: flex; align-items: center; gap: 12px;
  font-size: 18px; border-bottom: 2px solid #F26B01;
}
#agent-widget-chat-messages {
  flex: 1; padding: 18px; overflow-y: auto; font-size: 15px; background: #F8F9FB;
  display: flex; flex-direction: column; gap: 10px;
}
.agent-msg {
  background: #F26B01; color: #fff; align-self: flex-start; border-radius: 16px 16px 16px 4px; padding: 10px 16px; max-width: 80%; box-shadow: 0 2px 8px rgba(242,107,1,0.08);
  font-size: 15px;
  word-break: break-word;
}
.user-msg {
  background: #1E407F; color: #fff; align-self: flex-end; border-radius: 16px 16px 4px 16px; padding: 10px 16px; max-width: 80%; box-shadow: 0 2px 8px rgba(30,64,127,0.08);
  font-size: 15px;
  word-break: break-word;
}
#agent-widget-chat-input {
  display: flex; border-top: 1px solid #eee; background: #fff; padding: 10px 12px;
  gap: 8px;
}
#agent-widget-chat-input input {
  flex: 1; border: 1.5px solid #1E407F; border-radius: 12px; padding: 10px; font-size: 15px; font-family: 'Plus Jakarta Sans', sans-serif;
  outline: none;
}
#agent-widget-chat-input button {
  background: #F26B01; color: #fff; border: none; padding: 0 22px; border-radius: 12px; font-size: 15px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: bold; cursor: pointer; transition: background 0.2s;
}
#agent-widget-chat-input button:hover {
  background: #d95a00;
}
  `;
  document.head.appendChild(style);

  // Inject widget HTML
  const btn = document.createElement('div');
  btn.id = 'agent-widget-btn';
  btn.title = 'Ask our agent!';
  btn.innerText = '💬';
  document.body.appendChild(btn);

  const chat = document.createElement('div');
  chat.id = 'agent-widget-chat';
  chat.innerHTML = `
    <div id="agent-widget-chat-header">
      <div>
        <div style="font-size:16px;font-weight:700;">CRSS Assistant</div>
        <div style="font-size:13px;font-weight:400;opacity:0.85;">Hi! How can I help you today?</div>
      </div>
    </div>
    <div id="agent-widget-chat-messages"></div>
    <form id="agent-widget-chat-input" autocomplete="off">
      <input type="text" id="agent-widget-input" placeholder="Type your question about CRSS..." autocomplete="off" />
      <button type="submit">Send</button>
    </form>
  `;
  document.body.appendChild(chat);

  const messages = chat.querySelector('#agent-widget-chat-messages');
  const form = chat.querySelector('#agent-widget-chat-input');
  const input = chat.querySelector('#agent-widget-input');

  btn.onclick = () => {
    btn.style.display = 'none';
    chat.style.display = 'flex';
    chat.style.flexDirection = 'column';
  };

  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = sender === 'user' ? 'user-msg' : 'agent-msg';
    if (sender === 'agent') {
      msg.innerHTML = markdownToHtml(text);
    } else {
      msg.innerText = text;
    }
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    const userMsg = input.value.trim();
    if (!userMsg) return;
    addMessage(userMsg, 'user');
    input.value = '';

    // Call your backend (adjust the URL if needed)
    try {
      const res = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: userMsg})
      });
      const data = await res.json();
      if (data.reply) {
        addMessage(data.reply, 'agent');
      } else {
        addMessage('Sorry, there was an error.', 'agent');
      }
    } catch (err) {
      addMessage('Connection error.', 'agent');
    }
  };
})(); 