import { ApiProperty } from '@nestjs/swagger';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';

export class ReportDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  mentors: Mentors;

  @ApiProperty()
  cadets: Cadets;

  @ApiProperty()
  place: string;

  @ApiProperty()
  topic: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
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

  @ApiProperty()
  status: string;

  @ApiProperty()
  mentoringLogs: MentoringLogs;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
