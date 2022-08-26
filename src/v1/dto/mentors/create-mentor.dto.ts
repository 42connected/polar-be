import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMentorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'intraId',
    required: true,
  })
  intraId: string;

  @IsString()
  @ApiPropertyOptional({
    description: 'profileImage',
    required: false,
  })
  profileImage: string;
}
