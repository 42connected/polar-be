import { CadetDto } from '../cadets/cadet.dto';
import { MentoringLogDto } from '../mentoring-logs/mentoring-logs.dto';
import { MentorDto } from '../mentors/mentor.dto';

export interface ReportDto {
  id: string;
  mentors: MentorDto;
  cadets: CadetDto;
  topic: string | null;
  content: string | null;
  imageUrl: string[] | null;
  feedbackMessage: string | null;
  feedback1: number;
  feedback2: number;
  feedback3: number;
  mentoringLogs: MentoringLogDto;
}
