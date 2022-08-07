import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  place: string;

  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  feedbackMessage: string;

  @IsNumber()
  @IsNotEmpty()
  feedback1: number;

  @IsNumber()
  @IsNotEmpty()
  feedback2: number;

  @IsNumber()
  @IsNotEmpty()
  feedback3: number;
}

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
  feedback1: number;

  @IsNumber()
  @IsOptional()
  feedback2: number;

  @IsNumber()
  @IsOptional()
  feedback3: number;
}
