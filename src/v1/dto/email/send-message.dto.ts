import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReservationMessageDto {
  @IsEmail()
  @ApiProperty({
    description: 'mentorEmail',
    required: true,
  })
  mentorEmail: string;

  @IsString()
  @Length(0, 15)
  @ApiProperty({
    description: 'cadetSlackId',
    required: true,
  })
  cadetSlackId: string;

  @IsDate()
  @ApiProperty({
    description: 'reservationTime',
    required: true,
    type: Date,
  })
  reservationTime: Date;

  @IsNumber()
  @ApiProperty({
    description: 'mentoringTime',
    required: true,
    type: Number,
  })
  mentoringTime: number;

  @IsBoolean()
  @ApiProperty({
    description: 'isCommon',
    required: true,
    type: Boolean,
  })
  isCommon: boolean;
}

export class ApproveMessageDto {
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

  @IsDate()
  @ApiProperty({
    description: 'cadetEmail',
    required: true,
    type: Date,
  })
  reservationTime: Date;

  @IsNumber()
  @ApiProperty({
    description: 'mentoringTime',
    required: true,
    type: Number,
  })
  mentoringTime: number;
}

export class CancelMessageDto {
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
}
