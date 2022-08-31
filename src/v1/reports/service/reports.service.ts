import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { ReportDto } from 'src/v1/dto/reports/report.dto';
import { UpdateReportDto } from 'src/v1/dto/reports/update-report.dto';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Reports } from 'src/v1/entities/reports.entity';
import { MentoringLogStatus } from 'src/v1/mentoring-logs/service/mentoring-logs.service';
import { Repository } from 'typeorm';
import { ReportStatus } from '../ReportStatus';

export const MONEY_PER_HOUR = 100000;

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reports)
    private readonly reportsRepository: Repository<Reports>,
    @InjectRepository(MentoringLogs)
    private readonly mentoringLogsRepository: Repository<MentoringLogs>,
  ) {}

  async findReportWithMentoringLogsById(reportId: string): Promise<Reports> {
    let report: Reports;
    try {
      report = await this.reportsRepository.findOne({
        where: { id: reportId },
        relations: {
          mentoringLogs: true,
          cadets: true,
          mentors: true,
        },
        select: {
          cadets: { intraId: true },
          mentors: { intraId: true },
        },
      });
    } catch {
      throw new ConflictException('레포트를 찾는중 오류가 발생하였습니다');
    }
    if (!report) {
      throw new NotFoundException(`해당 레포트를 찾을 수 없습니다`);
    }
    return report;
  }

  async findReportById(reportId: string): Promise<ReportDto> {
    let report: Reports;
    try {
      report = await this.reportsRepository.findOne({
        where: { id: reportId },
        relations: {
          cadets: true,
          mentors: true,
          mentoringLogs: true,
        },
        select: {
          cadets: { name: true, isCommon: true },
          mentors: { name: true },
        },
      });
    } catch {
      throw new ConflictException('레포트를 찾는중 오류가 발생하였습니다');
    }
    if (!report) {
      throw new NotFoundException(`해당 레포트를 찾을 수 없습니다`);
    }
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ID,
      secretAccessKey: process.env.AWS_S3_SECRET,
      signatureVersion: 'v4',
      region: 'ap-northeast-2',
    });
    if (report.imageUrl) {
      report.imageUrl = report.imageUrl.map(key => {
        return s3.getSignedUrl('getObject', {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Expires: 60 * 60,
        });
      });
    }
    if (report.signatureUrl) {
      report.signatureUrl = s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: report.signatureUrl,
        Expires: 60 * 60,
      });
    }
    return report;
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
   * File path in Object to array
   */
  getImagesPath(files) {
    const filePaths: string[] = [];
    if (files?.image) {
      files.image.map(img => {
        filePaths.push(img.key);
      });
      return filePaths;
    } else {
      return undefined;
    }
  }

  getSignaturePath(files) {
    if (files?.signature) {
      return files.signature[0]?.key;
    } else {
      return undefined;
    }
  }

  async isEnteredReport(report: Reports): Promise<boolean> {
    if (
      !report.cadets ||
      !report.mentors ||
      !report?.imageUrl?.length ||
      !report.signatureUrl ||
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

  async calculateTotalHour(
    mentorId: string,
    start: Date,
    end: Date,
  ): Promise<number> {
    let finishedMentorings: MentoringLogs[];
    const finishedMentoringsInDay: MentoringLogs[] = [];
    const finishedMentoringsInMonth: MentoringLogs[] = [];

    let result: number = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60),
    );

    try {
      finishedMentorings = await this.mentoringLogsRepository.find({
        select: { meetingAt: true },
        where: { status: MentoringLogStatus.Done, mentors: { id: mentorId } },
        relations: { mentors: true },
      });
    } catch {
      throw new ConflictException('멘토링 시간을 찾는 중 오류가 발생했습니다.');
    }

    finishedMentorings.map(mentoring => {
      if (mentoring.meetingAt[0].getMonth() === start.getMonth())
        finishedMentoringsInMonth.push(mentoring);
    });

    finishedMentoringsInMonth.map(mentoring => {
      if (mentoring.meetingAt[0].getDate() === start.getDate())
        finishedMentoringsInDay.push(mentoring);
    });

    let mentoringTimePerDay = 0;
    finishedMentoringsInDay.forEach(mentoring => {
      mentoringTimePerDay += Math.floor(
        (mentoring.meetingAt[1].getTime() - mentoring.meetingAt[0].getTime()) /
          (1000 * 60 * 60),
      );
    });
    if (mentoringTimePerDay >= 4) return 0;
    else if (mentoringTimePerDay + result >= 4)
      result = 4 - mentoringTimePerDay;

    let mentoringTimePerMonth = 0;
    finishedMentoringsInMonth.forEach(mentoring => {
      mentoringTimePerMonth += Math.floor(
        (mentoring.meetingAt[1].getTime() - mentoring.meetingAt[0].getTime()) /
          (1000 * 60 * 60),
      );
    });
    if (mentoringTimePerMonth >= 10) return 0;
    else if (mentoringTimePerMonth + result >= 10)
      result = 10 - mentoringTimePerDay;

    return result;
  }

  /*
   * @Get
   */
  async getReport(reportId: string): Promise<ReportDto> {
    return await this.findReportById(reportId);
  }

  /*
   * @Post
   */
  async createReport(mentoringLogId: string): Promise<string> {
    const mentoringLog = await this.findMentoringLogById(mentoringLogId);
    if (mentoringLog.reports) {
      throw new MethodNotAllowedException(
        '해당 멘토링 로그는 이미 레포트를 가지고 있습니다',
      );
    }
    if (mentoringLog.status !== '완료') {
      throw new MethodNotAllowedException(
        '해당 멘토링 로그는 레포트를 생성할 수 없습니다',
      );
    }
    const report: Reports = this.reportsRepository.create({
      cadets: mentoringLog.cadets,
      mentors: mentoringLog.mentors,
      mentoringLogs: mentoringLog,
      money: 0,
    });
    report.status = '작성중';
    mentoringLog.reports = report;
    try {
      await this.mentoringLogsRepository.save(mentoringLog);
      await this.reportsRepository.save(report);
    } catch (e) {
      throw new ConflictException(
        `${e} 저장중 예기치 못한 에러가 발생하였습니다'`,
      );
    }
    return report.id;
  }

  deleteCurrentImages(report: Reports): void {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ID,
      secretAccessKey: process.env.AWS_S3_SECRET,
      signatureVersion: 'v4',
      region: 'ap-northeast-2',
    });
    if (report.imageUrl) {
      report.imageUrl.forEach(key => {
        s3.deleteObject(
          {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
          },
          (err, data) => {
            if (err) {
              console.log(err);
            }
          },
        );
      });
    }
    if (report.signatureUrl) {
      s3.deleteObject(
        {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: report.signatureUrl,
        },
        (err, data) => {
          if (err) {
            console.log(err);
          }
        },
      );
    }
  }

  /*
   * @Patch
   */
  async updateReport(
    report: Reports,
    mentorIntraId: string,
    filePaths: string[],
    signature: string,
    body: UpdateReportDto,
  ): Promise<boolean> {
    const rs: ReportStatus = new ReportStatus(report.status);
    if (!rs.verify()) {
      throw new BadRequestException('해당 레포트를 수정할 수 없는 상태입니다');
    }
    if (report.mentors.intraId !== mentorIntraId) {
      throw new ForbiddenException(
        `해당 레포트를 수정할 수 있는 권한이 없습니다`,
      );
    }
    try {
      this.reportsRepository.save({
        id: report.id,
        imageUrl: filePaths || null,
        signatureUrl: signature || null,
        place: body.place,
        topic: body.topic,
        content: body.content,
        feedbackMessage: body.feedbackMessage,
        feedback1: body.feedback1 ? +body.feedback1 : report.feedback1,
        feedback2: body.feedback2 ? +body.feedback2 : report.feedback2,
        feedback3: body.feedback3 ? +body.feedback3 : report.feedback3,
      });
    } catch {
      throw new ConflictException(`예기치 못한 에러가 발생했습니다`);
    }
    if (body.isDone) {
      await this.reportDone(report.id);
    }
    return true;
  }

  async reportDone(reportId: string): Promise<void> {
    const report = await this.findReportWithMentoringLogsById(reportId);
    if (!(await this.isEnteredReport(report))) {
      throw new BadRequestException('입력이 완료되지 못해 제출할 수 없습니다');
    }
    let money: number;
    try {
      money =
        (await this.calculateTotalHour(
          report.mentors.id,
          report.mentoringLogs.meetingAt[0],
          report.mentoringLogs.meetingAt[1],
        )) * MONEY_PER_HOUR;
    } catch (error) {
      throw new ConflictException(error);
    }
    report.money = money;
    report.status = '작성완료';
    try {
      await this.reportsRepository.save(report);
    } catch (e) {
      throw new ConflictException(
        `${e} 저장중 예기치 못한 에러가 발생하였습니다'`,
      );
    }
  }
}
