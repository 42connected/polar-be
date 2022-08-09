import { CommentsInterface } from '../comments/comments.interface';
import { MentoringLogInterface } from '../mentoring-log/mentoring-log.interface';
import { ReportsInterface } from '../reports/reports.interface';

export interface MentorsInterface {
  intraId: string;
  name: string;
  profileImage: string;
  availableTime: string;
  introduction: string;
  isActive: boolean;
  markdownContent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
