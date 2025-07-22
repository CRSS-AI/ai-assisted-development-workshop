import { AzureOpenAI } from "openai";

export async function extractTodoListFromText(text: string): Promise<string[]> {
  const client = new AzureOpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: `https://${process.env.AZURE_OPENAI_API_INSTANCE_NAME}.openai.azure.com/`,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  });

  const messages = [
    {
      role: "system" as const,
      content: "You are a helpful assistant that extracts todo items from text. Return a JSON array of strings containing the todo items. Only return the JSON array, nothing else. For example: [\"Buy groceries\", \"Call dentist\", \"Finish report\"]",
    },
    {
      role: "user" as const,
      content: text,
    },
  ];

  try {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME!,
      messages: messages,
      temperature: 0,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from AI response");
    }
    
    return JSON.parse(content);
  } catch (e) {
    console.error("Error parsing AI response:", e);
    // Return a fallback result
    return [
      "Unable to extract todos from the provided text",
      "Please try uploading a different file",
    ];
  }
}
