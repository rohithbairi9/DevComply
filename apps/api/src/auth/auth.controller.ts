import { Controller, Post, Body, Res, HttpStatus, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GithubAuthDto } from './dto/github-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('github')
  async githubLogin(@Body() dto: GithubAuthDto, @Res({ passthrough: true }) res: Response) {
    if (!dto.code) throw new BadRequestException('Code is required');

    const { jwtToken, user } = await this.authService.authenticateWithGithub(dto.code);

    // Set HttpOnly cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Must be true for cross-origin
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Must be 'none' for cross-origin
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return { message: 'Authentication successful', user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Logged out successfully' };
  }
}