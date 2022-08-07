import { IsOptional, IsString } from 'class-validator';

export class UpdateCadetDto {
  @IsString()
  @IsOptional()
  resumeUrl: string;
}
