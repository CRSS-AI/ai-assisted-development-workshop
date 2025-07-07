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
      `You are an expert task extraction assistant. Analyze the provided document and extract actionable todo items.

      Rules:
      - Only extract clear, actionable tasks
      - Ignore general descriptions or context
      - Each task should be specific and measurable
      - Return only a JSON array of strings
      - If no actionable tasks are found, return an empty array []
      - Tasks should start with action verbs (e.g., "Create", "Review", "Update")

      Example output: ["Create user authentication system", "Review code documentation", "Update database schema"]`
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
