import { CommentDto } from '../comments/comment.dto';
import { MentoringLogDto } from '../mentoring-logs/mentoring-logs.dto';
import { ReportDto } from '../reports/report.dto';

export interface CadetDto {
  id: string;
  intraId: string;
  name: string | null;
  profileImage: string | null;
  isCommon: boolean;
  createdAt: Date;
  updatedAt: Date;
  comments: CommentDto[];
  mentoringLogs: MentoringLogDto[];
  reports: ReportDto[];
}
