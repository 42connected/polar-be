export interface MentorMentoringLogs {
  id: string;
  createdAt: Date;
  meetingAt: Date;
  cadet: {
    name: string;
    intraId: string;
    resumeUrl: string;
  };
  topic: string;
  status: string;
  meta: {
    requestTime: Date[][2];
    isCommon: boolean;
    rejectMessage: string;
    content: string;
  };
}
