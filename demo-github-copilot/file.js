import { AzureChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Debug: Check if environment variables are loaded
console.log("Environment variables loaded:");
console.log("API Key exists:", !!process.env.AZURE_OPENAI_API_KEY);
console.log("Instance Name:", process.env.AZURE_OPENAI_API_INSTANCE_NAME);
console.log("Deployment Name:", process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME);
console.log("API Version:", process.env.AZURE_OPENAI_API_VERSION);

const llm = new AzureChatOpenAI({
  model: "gpt-4.1-mini",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME, // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION, // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
});

const aiMsg = await llm.invoke([
  [
    "system",
    "You are a helpful assistant that translates English to French. Translate the user sentence.",
  ],
  ["human", "I love programming."],
]);

console.log("Translation:", aiMsg.content);