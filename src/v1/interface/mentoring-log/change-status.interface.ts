import { MentoringLogStatus } from 'src/v1/mentoring-logs/service/mentoring-logs.service';

export interface ChangeStatus {
  userId: string;
  mentoringLogId: string;
  status: MentoringLogStatus;
  meetingAt?: Date[];
  rejectMessage?: string;
}
