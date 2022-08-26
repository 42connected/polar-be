import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '멘토링 제목/주제',
    required: true,
    type: String,
  })
  topic: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '멘토링 신청 내용',
    required: true,
    type: String,
  })
  content: string;

  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({
    description: '멘토링 신청 시간',
    required: true,
    type: Date,
    isArray: true,
    example: ['2022-08-23T06:45:16.593Z', '2022-08-23T06:45:16.593Z'],
  })
  requestTime1: Date[];

  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: '멘토링 신청 시간(옵션)',
    required: false,
    type: Date,
    isArray: true,
    example: ['2022-08-23T06:45:16.593Z', '2022-08-23T06:45:16.593Z'],
  })
  requestTime2: Date[];

  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: '멘토링 신청 시간(옵션)',
    required: false,
    type: Date,
    isArray: true,
    example: ['2022-08-23T06:45:16.593Z', '2022-08-23T06:45:16.593Z'],
  })
  requestTime3: Date[];
}
