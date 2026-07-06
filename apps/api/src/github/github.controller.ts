import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { GithubService } from './github.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('github')
@UseGuards(JwtAuthGuard)
export class GithubController {
  constructor(private githubService: GithubService) {}

  @Get('repos')
  async getRepos(@Req() req: any) {
    // NOTE: For simplicity in this module, we require the user to provide their GitHub token 
    // via a header for now. In a production app, we would store the encrypted token in the DB 
    // during the OAuth flow and retrieve it here.
    const githubToken = req.headers['x-github-token'];
    if (!githubToken) {
      return { error: 'GitHub token missing from request headers' };
    }
    return this.githubService.getUserRepositories(githubToken);
  }
}