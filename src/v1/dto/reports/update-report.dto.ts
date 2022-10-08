import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class UpdateReportDto {
  @IsString()
  @IsOptional()
  @Length(0, 500)
  @ApiPropertyOptional({
    description: '신청 카뎃 제외 멘토링 참여 카뎃 이름(들)',
    required: false,
  })
  extraCadets: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  @ApiPropertyOptional({
    description: '멘토링 진행 장소',
    required: false,
  })
  place: string;

  @IsString()
  @IsOptional()
  @Length(0, 150)
  @ApiPropertyOptional({
    description: '멘토링 제목/주제',
    required: false,
  })
  topic: string;

  @IsString()
  @IsOptional()
  @Length(0, 5000)
  @ApiPropertyOptional({
    description: '멘토링 신청 내용',
    required: false,
  })
  content: string;

  @IsString()
  @IsOptional()
  @Length(0, 3000)
  @ApiPropertyOptional({
    description: '멘토가 카뎃에게 쓰는 피드백',
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

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: '레포트가 작성 완료인지',
    required: false,
    type: Boolean,
  })
  isDone: boolean;

  @Type(() => Date)
  @IsOptional()
  @ApiPropertyOptional({
    description: '멘토링 진행 시간',
    required: false,
    type: Date,
    isArray: true,
    example: ['2022-08-23T06:45:16.593Z', '2022-08-23T06:45:16.593Z'],
  })
  meetingAt: Date[];
}
