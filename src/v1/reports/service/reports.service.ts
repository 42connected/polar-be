import {
  ConflictException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateReportDto,
  UpdateReportDto,
} from 'src/v1/dto/reports/report.dto';
import { ReportsSortDto } from 'src/v1/dto/reports/reports-sort.dto';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Reports } from 'src/v1/entities/reports.entity';
import { DataSource, Repository } from 'typeorm';
@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reports)
    private readonly reportsRepository: Repository<Reports>,
    @InjectRepository(MentoringLogs)
    private readonly mentoringLogsRepository: Repository<MentoringLogs>,
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

  async findReportById(reportId: string): Promise<Reports> {
    try {
      const report = await this.reportsRepository.findOne({
        where: { id: reportId },
        relations: {
          cadets: true,
          mentors: true,
        },
        select: {
          cadets: { name: true },
          mentors: { name: true },
        },
      });
      if (!report) {
        throw new NotFoundException(`해당 레포트를 찾을 수 없습니다`);
      }
      return report;
    } catch {
      throw new ConflictException('레포트를 찾는중 오류가 발생하였습니다');
    }
  }

  async findMentoringLogById(mentoringLogId: string): Promise<MentoringLogs> {
    try {
      const mentoringLog = await this.mentoringLogsRepository.findOne({
        where: { id: mentoringLogId },
        relations: {
          cadets: true,
          mentors: true,
        },
      });
      if (!mentoringLog) {
        throw new NotFoundException(`해당 멘토링 로그를 찾을 수 없습니다`);
      }
      return mentoringLog;
    } catch {
      throw new ConflictException('멘토링 로그를 찾는중 오류가 발생하였습니다');
    }
  }

  isWrongFeedback(feedback: number): boolean {
    if (feedback < 1 || feedback > 5) {
      return true;
    }
    return false;
  }

  /*
   * @Get
   */
  async getReport(reportId: string): Promise<Reports> {
    const report = await this.findReportById(reportId);
    return report;
  }

  /*
   * @Post
   */
  async createReport(
    mentoringLogId: string,
    filePaths: string[],
    body: CreateReportDto,
  ) {
    const mentoringLog = await this.findMentoringLogById(mentoringLogId);
    if (mentoringLog.reports) {
      throw new MethodNotAllowedException(
        '해당 멘토링 로그는 이미 레포트를 가지고 있습니다',
      );
    }
    const newReport: Reports = this.reportsRepository.create({
      mentors: mentoringLog.mentors,
      cadets: mentoringLog.cadets,
      mentoringLogs: mentoringLog,
      imageUrl: filePaths,
      place: body.place,
      topic: body.topic,
      content: body.content,
      feedbackMessage: body.feedbackMessage,
      feedback1: +body.feedback1,
      feedback2: +body.feedback2,
      feedback3: +body.feedback3,
    });
    try {
      await this.reportsRepository.save(newReport);
      return 'ok';
    } catch {
      throw new ConflictException('저장중 예기치 못한 에러가 발생하였습니다');
    }
  }

  /*
   * @Patch
   */
  async updateReport(
    reportId: string,
    mentorIntraId: string,
    filePaths: string[],
    body: UpdateReportDto,
  ) {
    const report = await this.findReportById(reportId);
    if (report.mentors?.intraId !== mentorIntraId) {
      throw new UnauthorizedException(
        `해당 레포트를 수정할 수 있는 권한이 없습니다`,
      );
    }
    report.imageUrl = filePaths;
    report.place = body.place;
    report.topic = body.topic;
    report.content = body.content;
    report.feedbackMessage = body.feedbackMessage;
    report.feedback1 = body.feedback1 ? +body.feedback1 : report.feedback1;
    report.feedback2 = body.feedback2 ? +body.feedback2 : report.feedback2;
    report.feedback3 = body.feedback3 ? +body.feedback3 : report.feedback3;
    try {
      await this.reportsRepository.save(report);
      return 'ok';
    } catch {
      throw new ConflictException('수정중 예기치 못한 에러가 발생하였습니다');
    }
  }

  async getAllReport() {
    const reports = await this.reportsRepository.find({
      relations: {
        cadets: true,
        mentors: true,
        mentoringLogs: true,
      },
      select: {
        mentors: {
          name: true,
        },
        cadets: {
          name: true,
        },
        mentoringLogs: {
          // place: true,
          meetingAt: true,
        },
      },
    });

    const room = [];
    reports?.forEach(data => {
      room.push({
        mentor: { name: data.mentors.name },
        cadet: { name: data.cadets.name },
        mentoringLogs: {
          id: data.mentoringLogs.id,
          // place: data.mentoringLogs.place,
          meetingAt: data.mentoringLogs.meetingAt,
        },
      });
    });

    return { reports: room };
  }

  async sortReport(reportsSortDto: ReportsSortDto) {
    const reports = await this.reportsRepository.find({
      relations: {
        cadets: true,
        mentors: true,
        mentoringLogs: true,
      },
      order: {
        mentoringLogs: {
          meetingAt: reportsSortDto.isUp ? 'ASC' : 'DESC',
        },
      },
      select: {
        mentors: {
          name: true,
        },
        cadets: {
          name: true,
        },
        mentoringLogs: {
          content: true,
          meetingAt: true,
          // place: true,
        },
      },
    });
    console.log(reportsSortDto.month);
    reportsSortDto.month--;
    const room = [];
    reports.forEach(data => {
      if (data.mentoringLogs.meetingAt.getMonth() === reportsSortDto.month) {
        room.push({
          mentor: { name: data.mentors.name },
          cadet: { name: data.cadets.name },
          mentoringLogs: {
            id: data.mentoringLogs.id,
            place: data.mentoringLogs.content,
            meetingAt: data.mentoringLogs.meetingAt,
            // place: data.mentoringLogs.place,
          },
        });
      }
    });
    reportsSortDto.mentorName
      ? room.filter(data => data.mentor.name === reportsSortDto.mentorName)
      : room;
    return { reports: room };
  }
}
