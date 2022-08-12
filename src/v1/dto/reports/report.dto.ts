import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateReportDto {
  @IsString()
  @IsOptional()
  place: string;

  @IsString()
  @IsOptional()
  topic: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  feedbackMessage: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  feedback1: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  feedback2: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  feedback3: number;

  @IsBoolean()
  @IsOptional()
  isDone: boolean;
}
