import { CadetDto } from '../cadets/cadet.dto';
import { MentorDto } from '../mentors/mentor.dto';
import { ReportDto } from '../reports/report.dto';

export interface MentoringLogDto {
  id: string;
  mentors: MentorDto;
  cadets: CadetDto;
  meetingAt: Date;
  topic: string;
  content: string;
  status: string;
  rejectMessage: string;
  reportStatus: string;
  requestTime1: Date;
  requestTime2: Date;
  requestTime3: Date;
  reports: ReportDto;
}
