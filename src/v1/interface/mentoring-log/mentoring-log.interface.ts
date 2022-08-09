import { ReportsInterface } from "../reports/reports.interface";

export interface MentoringLogInterface {
    mentors: string;
    cadets: string;
    meetingAt: Date;
    topic: string;
    content: string;
    status: string;
    rejectMessage?: string;
    reportStatus: string;
    requestTime1: Date[];
    requestTime2?: Date[];
    requestTime3?: Date[];
    reports: ReportsInterface[];
}