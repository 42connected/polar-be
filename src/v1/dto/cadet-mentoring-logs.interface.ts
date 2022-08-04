export interface CadetMentoringLogs {
  id: string;
  mentor: {
    intra: string;
    name: string;
  };
  createdAt: Date;
  status: string;
  content: string;
  meta: {
    isCommon: boolean;
    topic: string;
    requestTime: Date[];
    meetingAt: Date;
    rejectMessage: string;
  };
}
