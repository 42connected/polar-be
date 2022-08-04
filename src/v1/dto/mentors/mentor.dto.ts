import { CommentDto } from '../comments/comment.dto';
import { MentorKeywordDto } from '../mentor-keywords/mentor-keyword.dto';
import { MentoringLogDto } from '../mentoring-logs/mentoring-logs.dto';
import { ReportDto } from '../reports/report.dto';

export interface MentorDto {
  id: string;
  intraId: string;
  name: string | null;
  profileImage: string | null;
  availableTime: Date[][];
  introduction: string | null;
  isActive: boolean;
  markdownContent: string | null;
  createdAt: Date;
  updatedAt: Date;
  mentorKeyowrds: MentorKeywordDto[];
  comments: CommentDto[];
  reports: ReportDto[];
  mentoringLogs: MentoringLogDto[];
}
