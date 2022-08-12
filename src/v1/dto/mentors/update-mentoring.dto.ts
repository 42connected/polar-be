import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateMentoringDto {
  @IsUUID()
  id: string;

  @IsString()
  @ApiProperty({
    description: 'status',
    required: true,
  })
  status: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'rejectMessage',
    required: false,
  })
  rejectMessage: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  @ApiPropertyOptional({
    description: ' meetingAt',
    required: false,
    type: [Date],
  })
  meetingAt: Date[];
}
