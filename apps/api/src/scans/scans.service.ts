import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindingSeverity } from '@devcomply/db'; // <-- Add this line
import { decrypt } from '../common/crypto.util';

interface FileChange {
  filename: string;
  addedLines: { lineNumber: number; content: string }[];
}

// Interface for the AI findings coming from our pipeline
interface AiFinding {
  vulnerabilityType: string;
  severity: FindingSeverity; // <-- Changed from string
  explanation: string;
  lineNumber: number;
  suggestedFix: string;
}

@Injectable()
export class ScansService {
  private readonly logger = new Logger(ScansService.name);

  constructor(private prisma: PrismaService) {}

  async fetchAndSaveDiff(repoFullName: string, prNumber: number, commitSha: string) {
    this.logger.log(`Fetching diff for ${repoFullName} PR #${prNumber}`);

    // 1. Find the repository and the organization admin's token
    const repository = await this.prisma.repository.findFirst({
      where: { fullName: repoFullName, deletedAt: null },
      include: {
        organization: {
          include: {
            memberships: {
              where: { role: 'ADMIN' },
              include: { user: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!repository || repository.organization.memberships.length === 0) {
      throw new Error(`No admin user found for repository ${repoFullName}`);
    }

    const adminUser = repository.organization.memberships[0].user;
    if (!adminUser.encryptedGithubToken) {
      throw new Error(`Admin user has not connected a GitHub token`);
    }

    // 2. Decrypt the token
    const githubToken = decrypt(adminUser.encryptedGithubToken);

    // 3. Fetch the PR data using the user's token
    const response = await fetch(`https://api.github.com/repos/${repoFullName}/pulls/${prNumber}`, {
      headers: {
        Accept: 'application/vnd.github.v3.diff',
        Authorization: `Bearer ${githubToken}`, // <-- USE DECRYPTED TOKEN
      },
    });

    if (!response.ok) {
      this.logger.error(`Failed to fetch diff: ${response.statusText}`);
      throw new Error('Failed to fetch PR diff');
    }

    const diffText = await response.text();
    const fileChanges = this.parseDiff(diffText);

    this.logger.log(`Successfully parsed ${fileChanges.length} changed files.`);
    return fileChanges;
  }

  private parseDiff(diff: string): FileChange[] {
    const files: FileChange[] = [];
    let currentFile: FileChange | null = null;
    let currentLine = 0;

    const lines = diff.split('\n');
    for (const line of lines) {
      if (line.startsWith('diff --git')) {
        if (currentFile) files.push(currentFile);
        const match = line.match(/b\/(.+)$/);
        currentFile = { filename: match ? match[1] : 'unknown', addedLines: [] };
        currentLine = 0;
      } else if (line.startsWith('@@')) {
        const match = line.match(/\+(\d+)/);
        currentLine = match ? parseInt(match[1], 10) : 0;
      } else if (line.startsWith('+') && !line.startsWith('+++') && currentFile) {
        currentFile.addedLines.push({
          lineNumber: currentLine,
          content: line.substring(1),
        });
        currentLine++;
      } else if (line.startsWith(' ') && currentFile) {
        currentLine++;
      }
    }
    if (currentFile) files.push(currentFile);
    return files;
  }

  // --- NEW METHODS FOR MODULE 9 ---

  async createScanRecord(repoFullName: string, prNumber: number, commitSha: string) {
    const repository = await this.prisma.repository.findFirst({
      where: { fullName: repoFullName, deletedAt: null },
    });

    if (!repository) {
      throw new Error(`Repository ${repoFullName} not found in database`);
    }

    return this.prisma.scan.create({
      data: {
        repositoryId: repository.id,
        prNumber,
        commitSha,
        status: 'ANALYZING',
        triggeredBy: 'github-webhook',
      },
    });
  }

  async saveFindingsAndComment(scanId: string, repoFullName: string, prNumber: number, findings: AiFinding[]) {
    // 1. Save all findings to the database
    if (findings.length > 0) {
      await this.prisma.finding.createMany({
        data: findings.map(f => ({
          scanId,
          filePath: 'unknown', // In a production app, we'd map this from the diff
          lineNumber: f.lineNumber,
          severity: f.severity,
          vulnerabilityType: f.vulnerabilityType,
          aiExplanation: f.explanation,
          suggestedFix: f.suggestedFix,
          status: 'OPEN',
        })),
      });
    }

    // 2. Post a summary comment to the GitHub PR
    const commentBody = findings.length === 0
      ? `✅ **DevComply Scan Complete**\n\nNo vulnerabilities found. Great job!`
      : `⚠️ **DevComply Scan Complete**\n\nFound **${findings.length}** potential vulnerabilities:\n\n${
          findings.map((f, i) => `${i + 1}. **[${f.severity}] ${f.vulnerabilityType}** (Line ${f.lineNumber})\n   - ${f.explanation}\n   - **Suggested Fix:**\n   \`\`\`\n   ${f.suggestedFix}\n   \`\`\``).join('\n\n')
        }`;

    await this.postPrComment(repoFullName, prNumber, commentBody);

    // 3. Update scan status to COMPLETED
    await this.prisma.scan.update({
      where: { id: scanId },
      data: { status: 'COMPLETED' },
    });
  }

  private async postPrComment(repoFullName: string, prNumber: number, body: string) {
    this.logger.log(`Posting comment to PR #${prNumber} on ${repoFullName}`);
    
    // Look up the admin token for this repo
    const repository = await this.prisma.repository.findFirst({
      where: { fullName: repoFullName },
      include: {
        organization: {
          include: {
            memberships: { where: { role: 'ADMIN' }, include: { user: true }, take: 1 },
          },
        },
      },
    });

    const adminUser = repository?.organization.memberships[0]?.user;
    if (!adminUser?.encryptedGithubToken) {
      this.logger.error('Failed to post PR comment: No admin token found');
      return;
    }

    const githubToken = decrypt(adminUser.encryptedGithubToken);

    const response = await fetch(`https://api.github.com/repos/${repoFullName}/issues/${prNumber}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ body }),
    });

    if (!response.ok) {
      this.logger.error(`Failed to post PR comment: ${response.statusText}`);
    }
  }

    // --- METHODS FOR FRONTEND DASHBOARD ---

  async getScansForOrg(orgId: string) {
    return this.prisma.scan.findMany({
      where: { repository: { organizationId: orgId } },
      include: { 
        repository: true,
        _count: { select: { findings: true } } 
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 scans
    });
  }

  async getScanDetails(scanId: string) {
    return this.prisma.scan.findUnique({
      where: { id: scanId },
      include: {
        repository: true,
        findings: true,
      },
    });
  }
}