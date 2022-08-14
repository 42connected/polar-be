import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsString,
  Length,
} from 'class-validator';

export class ApproveMessageDto {
  @IsEmail()
  @ApiProperty({
    description: 'mentorEmail',
    required: true,
  })
  mentorEmail: string;

  @IsString()
  @Length(0, 15)
  @ApiProperty({
    description: 'mentorSlackId',
    required: true,
  })
  mentorSlackId: string;

  @IsEmail()
  @ApiProperty({
    description: 'cadetEmail',
    required: true,
  })
  cadetEmail: string;

  @IsString()
  @Length(0, 15)
  @ApiProperty({
    description: 'cadetSlackId',
    required: true,
  })
  cadetSlackId: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  @ApiProperty({
    description: 'meetingAt',
    required: true,
    type: [Date],
  })
  meetingAt: Date[];
}
