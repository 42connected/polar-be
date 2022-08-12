import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
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
  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  reservationTime2?: Date[];

  @IsArray()
  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  reservationTime3?: Date[];

  @IsBoolean()
  isCommon: boolean;
}

export class ApproveMessageDto {
  @IsString()
  @Length(0, 15)
  mentorSlackId: string;

  @IsEmail()
  cadetEmail: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  meetingAt: Date[];
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
