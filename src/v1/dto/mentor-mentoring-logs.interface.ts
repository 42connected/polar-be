export interface MentorMentoringLogs {
  id: string;
  createdAt: Date;
  meetingAt: Date;
  cadet: {
    name: string;
    intra: string;
  };
  topic: string;
  status: string;
  reportStatus: string;
  meta: {
    requestTime: Date[];
    isCommon: boolean;
    rejectMessage: string;
    content: string;
  };
}
