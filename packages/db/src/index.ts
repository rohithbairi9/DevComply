/**
 * Prisma Client Singleton
 * 
 * Why this exists:
 * In development environments (especially with Next.js Fast Refresh), 
 * instantiating PrismaClient on every hot-reload quickly exhausts 
 * PostgreSQL connection pools. We store the instance on the global object
 * to persist across hot reloads.
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export * from '@prisma/client';