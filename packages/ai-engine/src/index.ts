import { runAnalyzerAgent, AnalyzerOutput } from './agents/analyzer.agent';
import { runRemediatorAgent } from './agents/remediator.agent';

// Extract the base type using a type alias first
type FindingBase = AnalyzerOutput['findings'][number];

export interface AiFinding extends FindingBase {
  suggestedFix: string;
}

export async function runAiPipeline(codeDiff: string): Promise<AiFinding[]> {
  console.log('[AI Engine] Starting Analyzer Agent...');
  const analysis = await runAnalyzerAgent(codeDiff);
  
  if (analysis.findings.length === 0) {
    console.log('[AI Engine] No vulnerabilities found.');
    return [];
  }

  console.log(`[AI Engine] Found ${analysis.findings.length} vulnerabilities. Starting Remediator Agent...`);
  
  const findingsWithFixes: AiFinding[] = [];

  for (const finding of analysis.findings) {
    // In a real app, we'd extract the exact vulnerable code block here.
    // For this pipeline, we pass the whole diff as context for the remediator.
    const suggestedFix = await runRemediatorAgent(codeDiff, finding.explanation);
    
    findingsWithFixes.push({
      ...finding,
      suggestedFix,
    });
  }

  console.log('[AI Engine] Remediation complete.');
  return findingsWithFixes;
}

export * from './agents/analyzer.agent';