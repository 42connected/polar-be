import {
  BadRequestException,
  ConflictException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateReportDto } from 'src/v1/dto/reports/report.dto';
import { Reports } from 'src/v1/entities/reports.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { ReportsRepository } from '../repository/reports.repository';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(MentoringLogs)
    private readonly mentoringLogsRepository: Repository<MentoringLogs>,
    @InjectRepository(ReportsRepository)
    private readonly reportsRepository: ReportsRepository,
  ) {}

  /*
   * File path in Object to array
   */
  getFilePaths(files) {
    const filePaths: string[] = [];
    if (files?.image) {
      files.image.map(img => {
        filePaths.push(img.path);
      });
      return filePaths;
    } else {
      return undefined;
    }
  }

  async isAllInputedReport(report: Reports): Promise<boolean> {
    if (
      !report.cadets ||
      !report.mentors ||
      report.imageUrl.length === 0 ||
      !report.mentoringLogs ||
      !report.topic ||
      !report.place ||
      !report.content ||
      !report.feedback1 ||
      !report.feedback2 ||
      !report.feedback3
    ) {
      return false;
    }
    return true;
  }

  calcMoney(report: Reports): number {
    const meetingAt: Date[] = report.mentoringLogs.meetingAt;
    const time =
      meetingAt[1].getHours() * 60 +
      meetingAt[1].getMinutes() -
      (meetingAt[0].getHours() * 60 + meetingAt[0].getMinutes());
    const hour = time / 60;
    const money = hour * 100000;
    return money;
  }
  async findMentoringLogById(mentoringLogId: string): Promise<MentoringLogs> {
    let mentoringLog: MentoringLogs;
    try {
      mentoringLog = await this.mentoringLogsRepository.findOne({
        where: { id: mentoringLogId },
        relations: {
          cadets: true,
          mentors: true,
        },
      });
    } catch {
      throw new ConflictException('멘토링 로그를 찾는중 오류가 발생하였습니다');
    }
    if (!mentoringLog) {
      throw new NotFoundException(`해당 멘토링 로그를 찾을 수 없습니다`);
    }
    return mentoringLog;
  }

  /*
   * @Get
   */
  async getReport(reportId: string): Promise<Reports> {
    return await this.reportsRepository.findById(reportId);
  }

  /*
   * @Post
   */
  async createReport(mentoringLogId: string) {
    const mentoringLog = await this.findMentoringLogById(mentoringLogId);
    if (mentoringLog.reports) {
      throw new MethodNotAllowedException(
        '해당 멘토링 로그는 이미 레포트를 가지고 있습니다',
      );
    }
    if (mentoringLog.reportStatus !== '작성가능') {
      throw new MethodNotAllowedException(
        '해당 멘토링 로그는 레포트를 생성할 수 없습니다',
      );
    }
    if (mentoringLog.reports) {
      throw new MethodNotAllowedException(
        '해당 멘토링 로그는 이미 레포트를 가지고 있습니다',
      );
    }
    const report: Reports = this.reportsRepository.create();
    mentoringLog.reportStatus = '작성중';
    try {
      await this.reportsRepository.save(report);
      await this.mentoringLogsRepository.save(mentoringLog);
      return 'ok';
    } catch (e) {
      throw new ConflictException(
        `${e} 저장중 예기치 못한 에러가 발생하였습니다'`,
      );
    }
  }

  /*
   * @Patch
   */
  async updateReport(
    reportId: string,
    mentorIntraId: string,
    filePaths: string[],
    signature: string,
    body: UpdateReportDto,
  ) {
    const report = await this.reportsRepository.findWithMentoringLogsById(
      reportId,
    );
    const rs: ReportStatus = new ReportStatus(
      report.mentoringLogs.reportStatus,
    );
    if (!rs.verify()) {
      throw new UnauthorizedException(
        '해당 레포트를 수정할 수 없는 상태입니다',
      );
    }
    if (report.mentors?.intraId !== mentorIntraId) {
      throw new UnauthorizedException(
        `해당 레포트를 수정할 수 있는 권한이 없습니다`,
      );
    }
    report.imageUrl = filePaths;
    report.signatureUrl = signature;
    report.place = body.place;
    report.topic = body.topic;
    report.content = body.content;
    report.feedbackMessage = body.feedbackMessage;
    report.feedback1 = body.feedback1 ? +body.feedback1 : report.feedback1;
    report.feedback2 = body.feedback2 ? +body.feedback2 : report.feedback2;
    report.feedback3 = body.feedback3 ? +body.feedback3 : report.feedback3;
    try {
      this.reportsRepository.save(report);
    } catch {
      throw new ConflictException(`예기치 못한 에러가 발생했습니다`);
    }
    if (body.isDone) {
      this.reportDone(reportId);
    }
  }

  async reportDone(reportId: string) {
    const report = await this.reportsRepository.findWithMentoringLogsById(
      reportId,
    );
    if (!this.isAllInputedReport(report)) {
      throw new BadRequestException('입력이 완료되지 못해 제출할 수 없습니다');
    }
    const money = this.calcMoney(report);
    report.mentoringLogs.money = money;
    report.mentoringLogs.reportStatus = '작성완료';
    try {
      await this.mentoringLogsRepository.save(report.mentoringLogs);
    } catch (e) {
      throw new ConflictException(
        `${e} 저장중 예기치 못한 에러가 발생하였습니다'`,
      );
    }
  }
}
