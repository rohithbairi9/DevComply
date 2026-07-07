import { Controller, Post, Get, Res, Req, Query, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github/callback')
  async githubCallback(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!code) throw new BadRequestException('Code is required');

    const { jwtToken } = await this.authService.authenticateWithGithub(code);

    // Set HttpOnly cookie on the Backend domain (Render)
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Must be true
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Must be 'none' in production
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // Redirect back to the Vercel Frontend Dashboard
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/dashboard`);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Logged out successfully' };
  }
}