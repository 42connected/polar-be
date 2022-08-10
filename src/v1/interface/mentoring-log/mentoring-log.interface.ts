import { CadetsInterface } from '../cadets/cadets.interface';
import { MentorsInterface } from '../mentors/mentors.interface';
import { ReportsInterface } from '../reports/reports.interface';

export interface MentoringLogsInterface {
  mentors?: string;
  cadets?: string;
  meetingAt?: Date;
  topic: string;
  content: string;
  status: string;
  rejectMessage?: string;
  reportStatus?: string;
  requestTime1: Date[];
  requestTime2?: Date[];
  requestTime3?: Date[];
  reports?: string;
}
