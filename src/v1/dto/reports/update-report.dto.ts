import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  @ApiPropertyOptional({
    description: '멘토링 진행 장소',
    required: false,
  })
  place: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '멘토링 제목/주제',
    required: false,
  })
  topic: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '멘토링 신청 내용',
    required: false,
  })
  content: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '멘토가 카뎃에게 쓰는 피드백',
    required: false,
  })
  feedbackMessage: string;

  @IsNumber()
  @Transform(value => Number(value))
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
  @Transform(value => Number(value))
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
  @Transform(value => Number(value))
  @IsOptional()
  @Min(1)
  @Max(5)
  @ApiPropertyOptional({
    description: 'feedback3',
    required: false,
    type: Number,
  })
  feedback3: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: '레포트가 작성 완료인지',
    required: false,
    type: Boolean,
  })
  isDone: boolean;
}
