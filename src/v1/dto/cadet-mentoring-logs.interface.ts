export interface CadetMentoringLogs {
  id: string;
  mentor: {
    intraId: string;
    name: string;
  };
  createdAt: Date;
  status: string;
  topic: string;
  meta: {
    isCommon: boolean;
    content: string;
    requestTime: Date[][];
    meetingAt: Date[];
    rejectMessage: string;
  };
}
