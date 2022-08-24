import { ApiProperty } from '@nestjs/swagger';
import { MentoringLogsDto } from 'src/v1/dto/mentors/mentoring-logs.dto';

export class MentoringInfoDto {
  @ApiProperty({
    type: MentoringLogsDto,
    isArray: true,
  })
  logs: MentoringLogsDto[];

  @ApiProperty({
    type: Number,
    example: 10,
  })
  total: number;
}
