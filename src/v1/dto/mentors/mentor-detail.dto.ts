import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AvailableTimeDto } from '../available-time.dto';

export class UpdateMentorDatailDto {
  @IsNotEmpty()
  @Type(() => AvailableTimeDto)
  @ApiProperty({
    description: 'availableTime',
    required: true,
    type: [[AvailableTimeDto]],
  })
  availableTime: AvailableTimeDto[][];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'introduction',
    required: false,
  })
  introduction: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    description: 'email',
    required: false,
  })
  email: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'isActive',
    required: false,
    type: Boolean,
  })
  isActive: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'markdownContent',
    required: false,
  })
  markdownContent: string;
}
