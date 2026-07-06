import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReposService {
  constructor(private prisma: PrismaService) {}

  async connectRepo(userId: string, orgId: string, githubRepoId: number, name: string, fullName: string) {
    // Use upsert so we don't crash if the user clicks "Connect" twice
    return this.prisma.repository.upsert({
      where: { githubRepoId },
      update: {
        name,
        fullName,
        isActive: true,
        deletedAt: null, // Restore if it was soft-deleted
      },
      create: {
        organizationId: orgId,
        githubRepoId,
        name,
        fullName,
        isActive: true,
      },
    });
  }

  async getUserRepos(orgId: string) {
    return this.prisma.repository.findMany({
      where: { organizationId: orgId, deletedAt: null },
    });
  }
}