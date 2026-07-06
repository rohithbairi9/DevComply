import { Module } from '@nestjs/common';
import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ScansModule } from '../scans/scans.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    ScansModule,
    BullModule.registerQueue({ name: 'scans' }),
  ],
  controllers: [ReposController],
  providers: [ReposService],
})
export class ReposModule {}