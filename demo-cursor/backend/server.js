import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

import { AzureChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { StateGraph, END } from '@langchain/langgraph';


// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_API_DEPLOYMENT_NAME = process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME;
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION;
const AZURE_OPENAI_API_BASE_PATH = process.env.AZURE_OPENAI_API_BASE_PATH;
const AZURE_OPENAI_API_INSTANCE_NAME = process.env.AZURE_OPENAI_API_INSTANCE_NAME;

console.log('AZURE_OPENAI_API_KEY:', AZURE_OPENAI_API_KEY ? 'OK' : 'MISSING');
console.log('AZURE_OPENAI_API_DEPLOYMENT_NAME:', AZURE_OPENAI_API_DEPLOYMENT_NAME);
console.log('AZURE_OPENAI_API_VERSION:', AZURE_OPENAI_API_VERSION);
console.log('AZURE_OPENAI_API_BASE_PATH:', AZURE_OPENAI_API_BASE_PATH);
console.log('AZURE_OPENAI_API_INSTANCE_NAME:', AZURE_OPENAI_API_INSTANCE_NAME);

const app = express();
app.use(cors());
app.use(express.json());

// Load scraped data once at startup
const scrapedPath = path.join(__dirname, 'tools', 'data', 'scraped_data.json');
let scrapedContent = '';
try {
  const scraped = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
  scrapedContent = (scraped.clean_text || []).join(' ');
} catch (err) {
  console.error('Failed to load scraped data:', err);
}

// Initialize Azure OpenAI model
const model = new AzureChatOpenAI({
  azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
  azureOpenAIApiDeploymentName: AZURE_OPENAI_API_DEPLOYMENT_NAME,
  azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
  azureOpenAIApiBasePath: AZURE_OPENAI_API_BASE_PATH,
  azureOpenAIApiInstanceName: AZURE_OPENAI_API_INSTANCE_NAME,
  openAIApiType: "azure",
  temperature: 0.7,
  maxTokens: 1024,
});

// System prompt as a string
const systemPromptString = `
You are a concise and helpful purchase advisor for Costa Rica Software Services (CRSS). 
Your role is to clearly explain our services and assist potential clients with brief, professional answers.

CRSS Knowledge Base:
${scrapedContent}

Guidelines:
- Keep responses short unless the user asks for more detail.
- Answer directly. Skip fluff or overly long explanations.
- If a question isn't covered in the knowledge base, suggest contacting CRSS directly.
- Always be professional, helpful, and accurate.

Respond only as the CRSS assistant.
`;

// Define the state schema for our conversation graph
const stateSchema = {
  messages: {
    value: (x, y) => x.concat(y),
    default: () => [],
  },
  current_user_message: {
    value: (x, y) => y,
    default: () => null,
  },
  conversation_id: {
    value: (x, y) => x,
    default: () => null,
  },
};

// Create the conversation graph
const createConversationGraph = () => {
  const workflow = new StateGraph({
    channels: stateSchema,
  });

  // Add the main conversation node
  workflow.addNode('conversation', async (state) => {
    const { messages, current_user_message, conversation_id } = state;
    // Build message history: system prompt once, then all previous messages, then current user message
    const messageHistory = [
      new SystemMessage(systemPromptString),
      ...messages.map(msg =>
        msg.type === 'human'
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
      new HumanMessage(current_user_message)
    ];

    // Get response from the model
    const response = await model.invoke(messageHistory);

    // Add the new messages to the conversation
    const newMessages = [
      ...messages,
      { type: 'human', content: current_user_message, timestamp: new Date().toISOString() },
      { type: 'ai', content: response.content, timestamp: new Date().toISOString() }
    ];

    return {
      messages: newMessages,
      conversation_id,
    };
  });

  // Set the entry point
  workflow.setEntryPoint('conversation');
  
  // Set the end point
  workflow.addEdge('conversation', END);

  return workflow.compile();
};

// In-memory storage for conversations (in production, use a database)
const conversations = new Map();

// Helper function to get or create conversation
const getOrCreateConversation = (conversationId) => {
  if (!conversations.has(conversationId)) {
    conversations.set(conversationId, {
      id: conversationId,
      messages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  return conversations.get(conversationId);
};

// API Routes
app.post('/api/ask', async (req, res) => {
  try {
    const { message, conversation_id } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Missing message in request body' });
    }

    // Generate conversation ID if not provided
    const convId = conversation_id || uuidv4();
    
    // Get or create conversation
    const conversation = getOrCreateConversation(convId);
    
    // --- STREAMING SETUP ---
    // Crea un modelo con streaming habilitado
    const streamingModel = new AzureChatOpenAI({
      azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
      azureOpenAIApiDeploymentName: AZURE_OPENAI_API_DEPLOYMENT_NAME,
      azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
      azureOpenAIApiBasePath: AZURE_OPENAI_API_BASE_PATH,
      azureOpenAIApiInstanceName: AZURE_OPENAI_API_INSTANCE_NAME,
      openAIApiType: "azure",
      temperature: 0.7,
      maxTokens: 1024,
      stream: true,
    });

    // Construye el historial de mensajes igual que antes
    const messageHistory = [
      new SystemMessage(systemPromptString),
      ...conversation.messages.map(msg =>
        msg.type === 'human'
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
      new HumanMessage(message)
    ];

    // Configura headers para streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let aiReply = '';
    try {
      for await (const chunk of await streamingModel.stream(messageHistory)) {
        const token = chunk?.content || '';
        aiReply += token;
        res.write(token);
      }
    } catch (streamErr) {
      console.error('Streaming error:', streamErr);
      res.write('\n[Error en el stream de respuesta]');
    }

    // Guarda la conversación como antes
    conversation.messages.push(
      { type: 'human', content: message, timestamp: new Date().toISOString() },
      { type: 'ai', content: aiReply, timestamp: new Date().toISOString() }
    );
    conversation.updated_at = new Date().toISOString();
    conversations.set(convId, conversation);

    res.end();

  } catch (error) {
    console.error('Error in /api/ask:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    } else {
      res.end();
    }
  }
});

// Get conversation history
app.get('/api/conversation/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = conversations.get(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json({
      conversation_id: conversation.id,
      messages: conversation.messages,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
    });
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all conversations (for admin purposes)
app.get('/api/conversations', (req, res) => {
  try {
    const conversationList = Array.from(conversations.values()).map(conv => ({
      id: conv.id,
      message_count: conv.messages.length,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
    }));
    
    res.json({ conversations: conversationList });
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a conversation
app.delete('/api/conversation/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const deleted = conversations.delete(conversationId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using Azure OpenAI with deployment: ${AZURE_OPENAI_API_DEPLOYMENT_NAME}`);
}); 