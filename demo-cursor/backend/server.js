const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT;
const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME;

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

const SYSTEM_PROMPT = `You are a helpful purchase advisor for Costa Rica Software Services. Knowledge base: ${scrapedContent}`;

app.post('/api/ask', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Missing message in request body' });
    }
    const url = `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview`;
    const headers = {
      'Content-Type': 'application/json',
      'api-key': AZURE_OPENAI_KEY
    };
    const payload = {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      max_tokens: 1024
    };
    const response = await axios.post(url, payload, { headers, timeout: 30000 });
    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    if (err.response) {
      res.status(500).json({ error: 'OpenAI API error', details: err.response.data });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 