import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule to use JwtAuthGuard

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UsersController],
})
export class UsersModule {}