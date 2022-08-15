import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class ApproveMentoringDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'mentoring logs uuid',
    required: true,
    type: String,
  })
  mentoringLogId: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  @ApiPropertyOptional({
    description: ' meetingAt',
    required: true,
    type: [Date],
  })
  meetingAt: Date[];
}
