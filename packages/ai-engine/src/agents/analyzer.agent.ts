import { ChatGroq } from '@langchain/groq';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { z } from 'zod';

// Define the expected output schema for a single finding
const FindingSchema = z.object({
  vulnerabilityType: z.string().describe('e.g., SQL_INJECTION, XSS, HARDCODED_SECRET'),
  severity: z.preprocess(
    (val) => (typeof val === 'string' ? val.toUpperCase() : val),
    z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'])
  ),
  explanation: z.string().describe('Why this code is vulnerable'),
  lineNumber: z.number().describe('The line number of the vulnerability'),
});

const AnalyzerOutputSchema = z.object({
  findings: z.array(FindingSchema),
});

export type AnalyzerOutput = z.infer<typeof AnalyzerOutputSchema>;

export async function runAnalyzerAgent(codeDiff: string): Promise<AnalyzerOutput> {
  const model = new ChatGroq({
    modelName: 'llama-3.1-8b-instant', // Fast, free Groq model
    temperature: 0.1,
    apiKey: process.env.GROQ_API_KEY,
  });

  const systemPrompt = `You are an expert DevSecOps Analyzer Agent. 
  Analyze the following Git diff for security vulnerabilities and compliance issues (OWASP Top 10).
  Only report actual vulnerabilities. If the code is safe, return an empty findings array.
  You must respond in valid JSON matching this schema: { "findings": [{ "vulnerabilityType": "", "severity": "", "explanation": "", "lineNumber": 0 }] }`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(codeDiff),
  ]);

  try {
    const content = response.content as string;
    const jsonStr = content.replace(/```json\n|\n```/g, '').trim();
    return AnalyzerOutputSchema.parse(JSON.parse(jsonStr));
  } catch (error) {
    console.error('Analyzer Agent failed to parse output:', error);
    return { findings: [] };
  }
}