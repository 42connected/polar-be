import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { REPORT_STATUS } from 'src/v1/reports/ReportStatus';

export class GetDataRoomDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({
    description: '페이지당 데이터 수',
    default: 1,
    required: true,
    type: Number,
  })
  take: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({
    description: '페이지 번호',
    default: 1,
    required: true,
    type: Number,
  })
  page: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: '오름차순 정렬',
    required: false,
    type: Boolean,
  })
  isAscending: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '날짜별 조회',
    required: false,
    type: String,
    example: '2022-06',
  })
  date: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '맨토 이름 조회',
    required: false,
    type: String,
  })
  mentorName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '맨토 인트라 조회',
    required: false,
    type: String,
  })
  mentorIntra: string;

  @IsOptional()
  @IsEnum(REPORT_STATUS)
  @IsString()
  @ApiProperty({
    description: '보고서 상태 조회',
    required: false,
    enum: REPORT_STATUS,
  })
  status: REPORT_STATUS;
}
