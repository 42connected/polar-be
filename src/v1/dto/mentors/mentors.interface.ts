import { Comments } from 'src/v1/entities/comments.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';

export interface ReturnMentorDetails {
  id: string;
  intraId: string;
  name: string;
  profileImage: string;
  availableTime: Date[][];
  introduction: string;
  isActive: boolean;
  markdownContent: string;
  createdAt: Date;
  updatedAt: Date;
  mentoringLogs: MentoringLogs[];
  comments: Comments[];
}

export interface EditMentorDetailsDto {
  availableTime: Date[][];
  introduction: string;
  isActive: boolean;
  markdownContent: string;
}

export interface ReturnEditMentorDetails {
  ok: boolean;
}
