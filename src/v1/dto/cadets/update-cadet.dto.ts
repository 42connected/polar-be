import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCadetDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '이력서 링크',
    required: false,
    example: 'https://asdf',
  })
  resumeUrl: string;
}
