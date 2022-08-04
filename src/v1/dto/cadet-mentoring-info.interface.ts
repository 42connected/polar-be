import { CadetMentoringLogs } from './cadet-mentoring-logs.interface';

export interface CadetMentoringInfo {
  username: string | null; // null 삭제 예정
  mentorings: CadetMentoringLogs[];
}
