import { Module } from '@nestjs/common';
import { ScansProcessor } from './scans.processor';
import { ScansService } from './scans.service';
import { ScansController } from './scans.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ScansController],
  providers: [ScansProcessor, ScansService],
  exports: [ScansService],
})
export class ScansModule {}