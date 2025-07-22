import { AzureChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

const llm = new AzureChatOpenAI({
  model: "gpt-4.1-mini",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
});

export async function extractTodoListFromText(text) {
  const prompt = [
    [
      "system",
      "You are a helpful assistant that reads a document and returns a JSON array of to-do tasks that summarize the instructions in the document. Only return the JSON array, nothing else. Each task should be a string. If there are no tasks, return an empty array. Example: ['Task 1', 'Task 2'].",
    ],
    ["human", text],
  ];
  const aiMsg = await llm.invoke(prompt);
  try {
    return JSON.parse(aiMsg.content);
  } catch (e) {
    // fallback: try to extract JSON from text
    const match = aiMsg.content.match(/\[.*\]/s);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse to-do list JSON");
  }
}
