import { Prisma } from '@prisma/client';

// Re-exporting specific types for strict usage across frontend and backend
export type UserWithMemberships = Prisma.UserGetPayload<{
  include: {
    memberships: {
      include: {
        organization: true;
      };
    };
  };
}>;

export type OrganizationWithRepos = Prisma.OrganizationGetPayload<{
  include: {
    repositories: true;
  };
}>;

export type ScanWithFindings = Prisma.ScanGetPayload<{
  include: {
    findings: true;
  };
}>;