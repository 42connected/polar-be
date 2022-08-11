import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class ReservationMessageDto {
  @IsEmail()
  mentorEmail: string;

  @IsString()
  @Length(0, 15)
  cadetSlackId: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  reservationTime1: Date[];

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  reservationTime2: Date[];

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  reservationTime3: Date[];

  @IsNumber()
  mentoringTime: number;

  @IsBoolean()
  isCommon: boolean;
}

export class ApproveMessageDto {
  @IsString()
  @Length(0, 15)
  mentorSlackId: string;

  @IsEmail()
  cadetEmail: string;

  @IsDate()
  reservationTime: Date;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  meetingAt: Date[];

  @IsNumber()
  mentoringTime: number;
}

export class CancelMessageDto {
  @IsString()
  @Length(0, 15)
  mentorSlackId: string;

  @IsEmail()
  cadetEmail: string;

  @IsString()
  @IsOptional()
  rejectMessage: string;
}
