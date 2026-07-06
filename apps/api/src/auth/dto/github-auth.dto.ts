import { IsString, IsNotEmpty } from 'class-validator';

export class GithubAuthDto {
  @IsString()
  @IsNotEmpty()
  code !: string;
}