import { Reports } from 'src/v1/entities/reports.entity';

export interface ReportHistory {
  time: Date;
  report: Reports;
  meetingAt: Date[];
  meetingStart: Date;
}
