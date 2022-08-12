import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'place', required: true })
  place: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'topic', required: true })
  topic: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'content', required: true })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'feedbackMessage', required: true })
  feedbackMessage: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @ApiProperty({
    description: 'feedback1',
    required: true,
    type: Number,
  })
  feedback1: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @ApiProperty({
    description: 'feedback2',
    required: true,
    type: Number,
  })
  feedback2: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @ApiProperty({
    description: 'feedback3',
    required: true,
    type: Number,
  })
  feedback3: number;
}

export class UpdateReportDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'place',
    required: false,
  })
  place: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'topic',
    required: false,
  })
  topic: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'content',
    required: false,
  })
  content: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'feedbackMessage',
    required: false,
  })
  feedbackMessage: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  @ApiPropertyOptional({
    description: 'feedback1',
    required: false,
    type: Number,
  })
  feedback1: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  @ApiPropertyOptional({
    description: 'feedback2',
    required: false,
    type: Number,
  })
  feedback2: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  @ApiPropertyOptional({
    description: 'feedback3',
    required: false,
    type: Number,
  })
  feedback3: number;
}
