import { CommentsInterface } from '../comments/comments.interface';
import { MentorKeywordsInterface } from '../mentor-keywords/mentor-keywords.interface';
import { ReportsInterface } from '../reports/reports.interface';

export interface CadetsInterface {
  id?: string;
  intraId: string;
  name: string;
  profileImage?: string;
  isCommon: boolean;
  email: string;
  resumeUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
