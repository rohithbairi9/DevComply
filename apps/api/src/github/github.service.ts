import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GithubService {
  // Fetches the user's repositories from GitHub API
  async getUserRepositories(githubAccessToken: string) {
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        Authorization: `Bearer ${githubAccessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      throw new UnauthorizedException('Failed to fetch repositories from GitHub');
    }

    const repos = await response.json();
    // Map to a simpler format for our frontend
    return repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner.login,
    }));
  }
}