export interface ApproveMessage {
  mentorEmail: string;
  mentorSlackId: string;
  cadetEmail: string;
  cadetSlackId: string;
  meetingAt: Date[];
}
