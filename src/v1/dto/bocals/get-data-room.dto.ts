import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from '../pagination.dto';

export class GetDataRoomDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Pagenation',
    required: true,
    type: PaginationDto,
  })
  pagenation: PaginationDto;

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
    description: '맨토 이름 or 인트라 조회',
    required: false,
    type: String,
  })
  mentorName: string;
}
