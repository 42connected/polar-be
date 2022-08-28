import { ApiProperty } from '@nestjs/swagger';
import { Reports } from 'src/v1/entities/reports.entity';

export class PaginationReportDto {
  @ApiProperty({
    description: '한 페이지에 보이는 레포트 배열',
    type: Reports,
    isArray: true,
  })
  reports: Reports[];

  @ApiProperty({
    description: '필터링된 레포트의 총 개수',
    type: Number,
  })
  total: number;
}
