import { ApiProperty } from '@nestjs/swagger';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';

export class ReportDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    description: '멘토 정보',
    example: { name: '김나경' },
  })
  mentors: { name: string };

  @ApiProperty({
    description: '카뎃 정보',
    example: { name: '김나경', isCommon: true },
  })
  cadets: { name: string; isCommon: boolean };

  @ApiProperty()
  place: string;

  @ApiProperty()
  topic: string;

  @ApiProperty()
  content: string;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  imageUrl: string[];

  @ApiProperty()
  signatureUrl: string;

  @ApiProperty()
  feedbackMessage: string;

  @ApiProperty()
  feedback1: number;

  @ApiProperty()
  feedback2: number;

  @ApiProperty()
  feedback3: number;

  @ApiProperty()
  money: number;

  @ApiProperty({
    description: '레포트 상태',
    example: '작성중',
  })
  status: string;

  @ApiProperty({
    type: MentoringLogs,
  })
  mentoringLogs: MentoringLogs;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
