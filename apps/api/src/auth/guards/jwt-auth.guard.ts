import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = { id: payload.sub, email: payload.email }; // Attach to request
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

// Helper function to extract token (useful for frontend fetching later)
export const getTokenFromRequest = (req: Request): string | undefined => req.cookies?.token;