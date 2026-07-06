import { Controller, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get('me')
  async getMe(@CurrentUser() user: { id: string }) {
    // Fetch full user profile from DB, exclude sensitive data if any
    const userProfile = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
      },
    });

    if (!userProfile) {
      throw new UnauthorizedException('User not found');
    }

    return userProfile;
  }
}