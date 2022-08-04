import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Reports } from 'src/v1/entities/reports.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reports)
    private readonly reportsRepository: Repository<Reports>,
    @InjectRepository(Mentors)
    private readonly mentorsRepository: Repository<Mentors>,
    @InjectRepository(Cadets)
    private readonly cadetsRepository: Repository<Cadets>,
    @InjectRepository(MentoringLogs)
    private readonly mentoringLogsRepository: Repository<MentoringLogs>,
  ) {}

  async getReport(reportId: string) {
    const report = await this.reportsRepository.findOne({
      where: { id: reportId },
      relations: {
        cadets: true,
        mentors: true,
      },
    });
    if (!report) {
      throw new NotFoundException(`해당 레포트를 찾을 수 없습니다`);
    }
    return report;
  }

  async postReport(intraId: string, req: any) {
    const authorMentor = await this.mentorsRepository.findOneBy({
      intraId: intraId,
    });
    if (!authorMentor) {
      throw new NotFoundException(`해당 멘토를 찾을 수 없습니다`);
    }
    const cadet = await this.cadetsRepository.findOneBy({
      intraId: req.cadetIntraId,
    });
    if (!cadet) {
      throw new NotFoundException(`해당 카뎃를 찾을 수 없습니다`);
    }
    const mentoringLog = await this.mentoringLogsRepository.findOneBy({
      id: req.mentoringLogId,
    });
    if (!mentoringLog) {
      throw new NotFoundException(`해당 멘토링 로그를 찾을 수 없습니다`);
    }
    const newReport = this.reportsRepository.create({
      mentors: authorMentor,
      cadets: cadet,
      mentoringLogs: mentoringLog,
      topic: req.topic,
      content: req.content,
      feedbackMessage: req.feedbackMessage,
      feedback1: +req.feedback1,
      feedback2: +req.feedback2,
      feedback3: +req.feedback3,
    });
    const ret = await this.reportsRepository.save(newReport);
    return ret;
  }

  async putReport(intraId: string, reportId: string, req: any) {
    const report = await this.reportsRepository.findOneBy({ id: reportId });
    if (report.mentors.intraId !== intraId) {
      throw new UnauthorizedException('해당 레포트에 대한 권한이 없습니다');
    }
    report.topic = req.topic ? req.topic : report.topic;
    report.content = req.content ? req.content : report.content;
    report.feedbackMessage = req.feedbackMessage
      ? req.feedbackMessage
      : report.feedbackMessage;
    report.feedback1 = req.feedback1 ? req.feedback1 : report.feedback1;
    report.feedback2 = req.feedback2 ? req.feedback2 : report.feedback2;
    report.feedback3 = req.feedback3 ? req.feedback3 : report.feedback3;
    const ret = await this.reportsRepository.save(report);
    return ret;
  }
}
