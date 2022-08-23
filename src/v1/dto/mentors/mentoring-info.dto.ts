import { ApiProperty } from '@nestjs/swagger';
import { MentoringLogsDto } from 'src/v1/dto/mentors/mentoring-logs.dto';

export class MentoringInfoDto {
  @ApiProperty({
    example: 'nakkim',
  })
  intraId: string;

  @ApiProperty({
    type: MentoringLogsDto,
    isArray: true,
  })
  mentoringLogs: MentoringLogsDto[];
}
