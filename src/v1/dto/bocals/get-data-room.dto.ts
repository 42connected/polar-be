import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaginationDto } from '../pagination.dto';

export class GetDataRoomDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  take: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
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
  @IsNumber()
  @ApiProperty({
    description: '월별 조회',
    required: false,
    type: Number,
  })
  month: number;

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
}
