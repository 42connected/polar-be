import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class ReportsSortDto {
  @IsString()
  mentorName: string;

  @IsNumber()
  month: number;

  @IsBoolean()
  isUp: boolean;
}
