import { CadetsInterface } from '../cadets/cadets.interface';
import { CommentsInterface } from '../comments/comments.interface';
import { MentorKeywordsInterface } from '../mentor-keywords/mentor-keywords.interface';
import { MentoringLogsInterface } from '../mentoring-log/mentoring-log.interface';
import { MentorsInterface } from '../mentors/mentors.interface';

export interface ReportsInterface {
  mentors: MentorsInterface;
  cadets: CadetsInterface;
  place: string;
  topic: string;
  content: string;
  imageUrl: string[];
  feedbackMessage: string;
  feedback1: number;
  feedback2: number;
  feedback3: number;
  mentoringLogs: MentoringLogsInterface;
}
