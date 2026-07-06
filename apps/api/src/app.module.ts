import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GithubModule } from './github/github.module';
import { ReposModule } from './repos/repos.module';
import { ScansModule } from './scans/scans.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    // Connect BullMQ to Redis globally
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      },
    }),
    PrismaModule, 
    AuthModule, 
    UsersModule, 
    GithubModule, 
    ReposModule, 
    ScansModule
  ],
})
export class AppModule {}