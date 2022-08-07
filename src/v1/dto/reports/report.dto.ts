import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

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
  @Min(1)
  @Max(5)
  feedback1: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  feedback2: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
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
}
