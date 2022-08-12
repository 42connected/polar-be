import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCadetDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'resumeUrl',
    required: false,
  })
  resumeUrl: string;
}
