export enum REPORT_STATUS {
  UNABLE = '작성불가',
  ABLE = '작성가능',
  WRITING = '작성중',
  DONE = '작성완료',
  FIXING = '수정기간',
  ERROR = 'ERROR',
}

export class ReportStatus {
  private rs: REPORT_STATUS;
  constructor(reportStatus: string) {
    switch (reportStatus) {
      case '작성불가':
        this.rs = REPORT_STATUS.UNABLE;
        break;
      case '작성가능':
        this.rs = REPORT_STATUS.ABLE;
        break;
      case '작성중':
        this.rs = REPORT_STATUS.WRITING;
        break;
      case '수정기간':
        this.rs = REPORT_STATUS.FIXING;
        break;
      case '작성완료':
        this.rs = REPORT_STATUS.DONE;
        break;
      default:
        this.rs = REPORT_STATUS.ERROR;
    }
  }

  verify(): boolean {
    if (
      this.rs === REPORT_STATUS.UNABLE ||
      this.rs === REPORT_STATUS.DONE ||
      this.rs === REPORT_STATUS.ERROR
    ) {
      return false;
    }
    return true;
  }
}
