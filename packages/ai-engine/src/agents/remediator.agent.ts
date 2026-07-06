import { ChatGroq } from '@langchain/groq';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

export async function runRemediatorAgent(
  vulnerableCode: string,
  explanation: string,
): Promise<string> {
  const model = new ChatGroq({
    modelName: 'llama-3.1-8b-instant',
    temperature: 0.2,
    apiKey: process.env.GROQ_API_KEY,
  });

  const systemPrompt = `You are an expert Security Remediator Agent. 
  You are given a piece of vulnerable code and an explanation of the vulnerability.
  Your job is to rewrite the code to fix the vulnerability while maintaining its original functionality.
  Only return the fixed code snippet. Do not include markdown formatting or explanations.`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(`Vulnerability Explanation: ${explanation}\n\nVulnerable Code:\n${vulnerableCode}`),
  ]);

  return response.content as string;
}