export interface CreateBoardsInterface  {
    intraId: string;
    name: string;
    profileImage: string;
    isCommon: boolean;
    resumeUrl: string;
    createdAt: Date;
    updatedAt: Date;
    mentoringLogs: [];
    comments: [];
    reports: [];
}