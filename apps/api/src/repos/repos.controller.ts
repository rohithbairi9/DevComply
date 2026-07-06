import { Controller, Get, Post, Body, UseGuards, Req, UnauthorizedException, Headers, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as crypto from 'crypto';
import { ReposService } from './repos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { ScanJobData } from '../scans/dto/scan-job.dto';

@Controller('repos')
export class ReposController {
  constructor(
    private reposService: ReposService,
    private prisma: PrismaService,
    @InjectQueue('scans') private scansQueue: Queue,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyRepos(@CurrentUser() user: { id: string }) {
    const userRecord = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { memberships: true },
    });
    if (!userRecord || userRecord.memberships.length === 0) {
      return [];
    }
    const orgId = userRecord.memberships[0].organizationId;
    return this.reposService.getUserRepos(orgId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('connect')
  async connectRepo(
    @CurrentUser() user: { id: string },
    @Body() body: { githubRepoId: number; name: string; fullName: string },
  ) {
    const userRecord = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { memberships: true },
    });
    if (!userRecord) {
      throw new UnauthorizedException('User not found');
    }

    let orgId = userRecord.memberships[0]?.organizationId;
    if (!orgId) {
      const newOrg = await this.prisma.organization.create({
        data: {
          name: `${userRecord.name || userRecord.email}'s Workspace`,
          githubOrgId: userRecord.githubId,
          githubOrgLogin: userRecord.email.split('@')[0],
          encryptedGithubToken: 'placeholder',
          memberships: {
            create: { userId: userRecord.id, role: 'ADMIN' }
          }
        }
      });
      orgId = newOrg.id;
    }

    return this.reposService.connectRepo(
      user.id,
      orgId,
      body.githubRepoId,
      body.name,
      body.fullName,
    );
  }

  // Public endpoint for GitHub Webhooks
  @Post('webhook')
  async handleWebhook(@Req() req: any) {
    const event = req.headers['x-github-event'];
    const signature = req.headers['x-hub-signature-256'] as string;
    const rawBody = req.rawBody as Buffer;

    // 1. Verify Webhook Signature (Zero-Trust Security)
    if (!signature || !rawBody) {
      throw new UnauthorizedException('Missing signature or body');
    }

    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      throw new BadRequestException('Webhook secret is not configured on the server');
    }

    const expectedSignature = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

    // Use timingSafeEqual to prevent timing attacks
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    
    if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    // 2. Process the verified payload
    const payload = req.body;

    if (event === 'pull_request' && (payload.action === 'opened' || payload.action === 'synchronize')) {
      const jobData: ScanJobData = {
        repoFullName: payload.repository.full_name,
        prNumber: payload.number,
        commitSha: payload.pull_request.head.sha,
        installationId: payload.installation?.id || 0,
      };

      // Push job to the queue instead of processing synchronously
      await this.scansQueue.add('scan-pr', jobData);
      console.log(`✅ Verified & Enqueued scan for PR #${jobData.prNumber} on ${jobData.repoFullName}`);
    }

    return { message: 'Webhook received and verified' };
  }
}