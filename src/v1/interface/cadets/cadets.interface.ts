import { CommentsInterface } from "../comments/comments.interface";
import { MentorKeywordsInterface } from "../mentor-keywords/mentor-keywords.interface";
import { ReportsInterface } from "../reports/reports.interface";

export interface CadetsInterface {
  intraId: string;
  name: string;
  profileImage?: string;
  isCommon?: boolean;
  createdAt: Date;
  updatedAt: Date;
  comments?: CommentsInterface[];
  mentoringLogs?: MentorKeywordsInterface[];
  reports?: ReportsInterface[];
}
