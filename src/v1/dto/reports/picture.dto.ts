import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PictureDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '삭제할 서명',
    type: String,
  })
  signature?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: '삭제할 증빙 사진 인덱스',
    type: String,
  })
  image?: number;
}
