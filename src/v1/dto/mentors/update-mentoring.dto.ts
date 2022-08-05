import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateMentoringDto {
  @IsUUID()
  id: string;

  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  rejectMessage: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  meetingAt: Date;
}
