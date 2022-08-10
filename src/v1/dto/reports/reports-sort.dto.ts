import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ReportsSortDto {
  @IsString()
  @IsOptional()
  mentorName: string;

  @IsNumber()
  @IsOptional()
  @Max(12)
  @Min(1)
  month: number;

  @IsBoolean()
  isAscending: boolean;
}
