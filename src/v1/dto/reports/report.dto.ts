import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  topic: string;

  @IsString()
  content: string;

  @IsString()
  feedbackMessage: string;

  @IsNumber()
  feedback1: number;

  @IsNumber()
  feedback2: number;

  @IsNumber()
  feedback3: number;
}

export class UpdateReportDto {
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
  feedback1: number;

  @IsNumber()
  feedback2: number;

  @IsNumber()
  feedback3: number;
}
