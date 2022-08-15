import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCadetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'intraId', required: true })
  intraId: string;

  @IsString()
  @ApiPropertyOptional({ description: 'profileImage', required: false })
  profileImage: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'isCommon',
    required: true,
    type: Boolean,
  })
  isCommon: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'email', required: true })
  email: string;
}
