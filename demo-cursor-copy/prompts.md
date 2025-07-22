# Server.js Build Prompt


Create a Node.js Express server with ES6 modules. Check existing package.json for LangChain/LangGraph versions as they update frequently. Import: express, cors, dotenv, fs, path, uuid (v4), AzureChatOpenAI from @langchain/openai, HumanMessage/AIMessage/SystemMessage from @langchain/core/messages, StateGraph/END from @langchain/langgraph. Setup: Express app with CORS, express.json() middleware, dotenv config. Load scraped content from ./tools/data/scraped_data.json, extract clean_text array and join with spaces, handle errors gracefully. Create system prompt: "You are a concise and helpful purchase advisor for Costa Rica Software Services (CRSS). Your role is to clearly explain our services and assist potential clients with brief, professional answers. CRSS Knowledge Base: ${scrapedContent}. Guidelines: Keep responses short unless user asks for more detail, answer directly, skip fluff, if not covered in knowledge base suggest contacting CRSS directly, always be professional and accurate. Respond only as CRSS assistant, don't answer other topics, say you're a purchase advisor for CRSS and only answer CRSS related questions." Use Map for in-memory conversations with id, messages array, created_at, updated_at. Implement getOrCreateConversation(conversationId) function. Create POST /api/ask endpoint: extract message and conversation_id from body, validate message exists (400 error if missing), generate UUID if no conversation_id, get/create conversation from memory. Configure AzureChatOpenAI with all env vars, openAIApiType: "azure", temperature: 0.7, maxTokens: 1024, stream: true. Build message history: SystemMessage with system prompt, previous conversation messages (map human/ai types), new HumanMessage. Set streaming headers: Content-Type: text/plain; charset=utf-8, Transfer-Encoding: chunked, Cache-Control: no-cache, Connection: keep-alive. Flush headers, stream response token by token, accumulate full AI reply, handle streaming errors with try/catch. After response: add both human and AI messages to conversation.messages with timestamps, update conversation.updated_at, store in conversations Map. Wrap entire endpoint in try/catch, handle streaming and general errors, return 500 for unhandled errors if headers not sent, always end response properly. Listen on PORT env var or default 5000, log running port and deployment name. Use fileURLToPath and path.dirname for __dirname equivalent, handle all file operations with error catching, use proper ES6 import syntax throughout.


# Agent Widget prompt

Create a agent-widget.js file for the frontend based on the existing backend.
The goal is to build a floating chat interface with the following behavior:
Display a chat button in the bottom-right corner of the screen.
When the button is clicked:
Open the chat window.
Hide the floating chat button.
Show an initial message: "Ask a question to start chatting."
Enable a close button inside the chat window to hide it and bring back the floating button.
Support streaming messages from the backend.
Render Markdown-formatted responses in the chat view.