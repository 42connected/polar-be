import { IsBoolean, IsDate, IsNumber, IsString, Length } from 'class-validator';

export class ReservationMessageDto {
  @IsString()
  @Length(0, 15)
  mentorSlackId: string;

  @IsString()
  @Length(0, 15)
  cadetSlackId: string;

  @IsDate()
  reservationTime: Date;

  @IsNumber()
  mentoringTime: number;

  @IsBoolean()
  isCommon: boolean;
}

export class ApproveMessageDto {
  @IsString()
  @Length(0, 15)
  mentorSlackId: string;

  @IsString()
  @Length(0, 15)
  cadetSlackId: string;

  @IsDate()
  reservationTime: Date;

  @IsNumber()
  mentoringTime: number;
}

export class CancelMessageDto {
  @IsString()
  @Length(0, 15)
  mentorSlackId: string;

  @IsString()
  @Length(0, 15)
  cadetSlackId: string;
}
