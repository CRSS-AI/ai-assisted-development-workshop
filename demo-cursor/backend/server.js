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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_API_DEPLOYMENT_NAME = process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME;
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION;
const AZURE_OPENAI_API_BASE_PATH = process.env.AZURE_OPENAI_API_BASE_PATH;
const AZURE_OPENAI_API_INSTANCE_NAME = process.env.AZURE_OPENAI_API_INSTANCE_NAME;

const app = express();
app.use(cors());
app.use(express.json());

const scrapedPath = path.join(__dirname, 'tools', 'data', 'scraped_data.json');
let scrapedContent = '';
try {
  const scraped = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
  scrapedContent = (scraped.clean_text || []).join(' ');
} catch (err) {
  console.error('Failed to load scraped data:', err);
}

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

Respond only as the CRSS assistant, don't answer questions about other topics, say that you are a purchase advisor for CRSS and kindly say that you only answer CRSS related questions.
`;

const conversations = new Map();

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

app.post('/api/ask', async (req, res) => {
  try {
    const { message, conversation_id } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Missing message in request body' });
    }
    const convId = conversation_id || uuidv4();
    const conversation = getOrCreateConversation(convId);
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
    const messageHistory = [
      new SystemMessage(systemPromptString),
      ...conversation.messages.map(msg =>
        msg.type === 'human'
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
      new HumanMessage(message)
    ];
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using Azure OpenAI with deployment: ${AZURE_OPENAI_API_DEPLOYMENT_NAME}`);
}); 