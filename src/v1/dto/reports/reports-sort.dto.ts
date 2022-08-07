import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReportsSortDto {
  @IsString()
  @IsOptional()
  mentorName: string;

  @IsNumber()
  month: number;

  @IsBoolean()
  isUp: boolean;
}
