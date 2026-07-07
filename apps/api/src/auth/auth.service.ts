import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { encrypt } from '../common/crypto.util';

interface GitHubUserResponse {
  id: number;
  email: string | null;
  name: string | null;
  avatar_url: string;
}

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

    async authenticateWithGithub(code: string) {
    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new UnauthorizedException('Failed to fetch GitHub token');
    }

    const tokenData = (await tokenResponse.json()) as GitHubTokenResponse;
    if (!tokenData.access_token) {
      throw new UnauthorizedException('Invalid GitHub code');
    }

    // 2. Fetch user profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    });

    if (!userResponse.ok) {
      throw new UnauthorizedException('Failed to fetch GitHub user');
    }

    const githubUser = (await userResponse.json()) as GitHubUserResponse;

    // 2.5. FIX: If email is null, fetch it from the /user/emails endpoint
    let userEmail = githubUser.email;
    if (!userEmail) {
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: 'application/json',
        },
      });
      
      if (emailsResponse.ok) {
        const emails = await emailsResponse.json() as Array<{ email: string; primary: boolean; verified: boolean }>;
        const primaryEmail = emails.find(e => e.primary && e.verified)?.email;
        if (primaryEmail) {
          userEmail = primaryEmail;
        }
      }
    }

    // 3. Upsert user in database
    const user = await this.prisma.user.upsert({
      where: { githubId: githubUser.id },
      update: {
        email: userEmail || `user${githubUser.id}@devcomply.local`,
        name: githubUser.name,
        avatarUrl: githubUser.avatar_url,
        encryptedGithubToken: encrypt(tokenData.access_token), // <-- ADD THIS
      },
      create: {
        githubId: githubUser.id,
        email: userEmail || `user${githubUser.id}@devcomply.local`,
        name: githubUser.name,
        avatarUrl: githubUser.avatar_url,
        encryptedGithubToken: encrypt(tokenData.access_token), // <-- ADD THIS
      },
    });

    // 4. Generate JWT
    const payload = { sub: user.id, email: user.email };
    const jwtToken = await this.jwtService.signAsync(payload);

    return { jwtToken, user };
  }
}