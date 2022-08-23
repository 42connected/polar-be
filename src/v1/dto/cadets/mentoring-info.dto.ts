import { ApiProperty } from '@nestjs/swagger';
import { MentoringLogDto } from './mentoring-log.dto';

export class MentoringInfoDto {
  @ApiProperty({
    description: '유저의 본명',
    example: '김나경',
  })
  username: string;

  @ApiProperty({
    description: '멘토링 로그 정보의 배열',
    type: MentoringLogDto,
    isArray: true,
  })
  mentorings: MentoringLogDto[];
}
