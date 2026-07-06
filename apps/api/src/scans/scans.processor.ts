import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ScanJobData } from './dto/scan-job.dto';
import { ScansService } from './scans.service';
import { runAiPipeline } from '@devcomply/ai-engine';

@Processor('scans')
export class ScansProcessor extends WorkerHost {
  private readonly logger = new Logger(ScansProcessor.name);

  constructor(private readonly scansService: ScansService) {
    super();
  }

  async process(job: Job<ScanJobData, any, string>): Promise<any> {
    this.logger.log(`Processing scan job #${job.id} for PR #${job.data.prNumber} on ${job.data.repoFullName}`);

    try {
      // 1. Create Scan Record in DB (Status: ANALYZING)
      const scanRecord = await this.scansService.createScanRecord(
        job.data.repoFullName,
        job.data.prNumber,
        job.data.commitSha,
      );

      // 2. Fetch and parse diff
      const fileChanges = await this.scansService.fetchAndSaveDiff(
        job.data.repoFullName,
        job.data.prNumber,
        job.data.commitSha,
      );

      if (fileChanges.length === 0) {
        this.logger.log(`No code changes found. Skipping AI scan.`);
        return {};
      }

      // 3. Format the diff for the AI
      const codeDiff = fileChanges
        .map(file => {
          return `File: ${file.filename}\n` + file.addedLines.map(line => `${line.lineNumber}: ${line.content}`).join('\n');
        })
        .join('\n\n');

      // 4. Run the AI Pipeline
      this.logger.log('Starting AI Multi-Agent Pipeline...');
      const findings = await runAiPipeline(codeDiff);

      // 5. Save Findings to DB and Post PR Comment
      await this.scansService.saveFindingsAndComment(
        scanRecord.id,
        job.data.repoFullName,
        job.data.prNumber,
        findings,
      );

      if (findings.length > 0) {
        this.logger.log(`AI found ${findings.length} vulnerabilities. Posted to GitHub.`);
      } else {
        this.logger.log('AI scan complete. No vulnerabilities found. Posted to GitHub.');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Scan failed: ${errorMessage}`);
      throw error; 
    }

    return {};
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    this.logger.error(`Job #${job.id} failed: ${job.failedReason}`);
  }
}