import { CadetsInterface } from '../cadets/cadets.interface';
import { MentoringLogsInterface } from '../mentoring-log/mentoring-log.interface';
import { MentorsInterface } from '../mentors/mentors.interface';

export interface ReportsInterface {
  id?: string;
  mentors: MentorsInterface;
  cadets: CadetsInterface;
  place?: string;
  topic?: string;
  content?: string;
  imageUrl?: string[];
  feedbackMessage?: string;
  money?: number;
  status: string;
  feedback1?: number;
  feedback2?: number;
  feedback3?: number;
  mentoringLogs: MentoringLogsInterface;
  createdAt?: Date;
  updatedAt?: Date;
}
