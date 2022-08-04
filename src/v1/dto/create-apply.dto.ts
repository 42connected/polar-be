import { Cadets } from '../entities/cadets.entity';
import { Mentors } from '../entities/mentors.entity';
import { Reports } from '../entities/reports.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateApplyDto {
  @IsString()
  topic: string;

  @IsString()
  content: string;

  requestTime1: Date;
  requestTime2: Date;
  requestTime3: Date;
}
