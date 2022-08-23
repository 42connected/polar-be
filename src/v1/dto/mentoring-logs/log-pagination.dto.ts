import { ApiProperty } from '@nestjs/swagger';
import { SimpleLogDto } from './simple-log.dto';

export class LogPaginationDto {
  @ApiProperty({
    type: SimpleLogDto,
    isArray: true,
  })
  logs: SimpleLogDto[];

  @ApiProperty({
    type: Number,
    example: 10,
  })
  total: number;
}
