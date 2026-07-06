import { Controller, Get, Param, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ScansService } from './scans.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('scans')
@UseGuards(JwtAuthGuard)
export class ScansController {
  constructor(
    private scansService: ScansService,
    private prisma: PrismaService,
  ) {}

  @Get()
  async getMyScans(@CurrentUser() user: { id: string }) {
    const userRecord = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { memberships: true },
    });
    if (!userRecord || userRecord.memberships.length === 0) {
      return []; // Return empty if no org
    }
    const orgId = userRecord.memberships[0].organizationId;
    return this.scansService.getScansForOrg(orgId);
  }

  @Get(':id')
  async getScanDetails(@Param('id') scanId: string) {
    return this.scansService.getScanDetails(scanId);
  }
}