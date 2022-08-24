export interface ApproveMessage {
  mentorEmail: string;
  mentorSlackId: string;
  cadetEmail: string;
  cadetSlackId: string;
  topic: string;
  meetingAt: Date[];
}
