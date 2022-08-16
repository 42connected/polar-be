import {
  MethodNotAllowedException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateReportDto } from 'src/v1/dto/reports/report.dto';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Reports } from 'src/v1/entities/reports.entity';
import { Repository } from 'typeorm';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let reportRepo: Repository<Reports>;
  let mentoringRepo: Repository<MentoringLogs>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Reports),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            findAndCount: jest.fn(() => [[report], 1]),
          },
        },
        {
          provide: getRepositoryToken(MentoringLogs),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    reportRepo = module.get<Repository<Reports>>('ReportsRepository');
    mentoringRepo = module.get<Repository<MentoringLogs>>(
      'MentoringLogsRepository',
    );

    const cadet: Cadets = new Cadets();
    const mentor: Mentors = new Mentors();
    const mentoringLogs: MentoringLogs = new MentoringLogs();

    const report: Reports = new Reports();
    report.mentoringLogs = mentoringLogs;
    report.mentors = mentor;
    report.cadets = cadet;
    report.id = 'idididididididididididididid';
    report.topic = '맛있는 점심';
    report.content = '최고의 학생이였답니다';
    report.updatedAt = new Date();
    report.createdAt = new Date();
    report.imageUrl = [];
    report.feedbackMessage = '피드백';
    report.feedback1 = 5;
    report.feedback2 = 4;
    report.feedback2 = 3;
    report.place = '개포';
    report.signatureUrl = '';
    jest
      .spyOn(service, 'findReportById')
      .mockImplementation(async () => report);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getReport', async () => {
    expect(
      await service.getReport('idididididididididididididiid'),
    ).toBeDefined();
  });

  it('getReportPagination', async () => {
    expect(
      await service.getReportPagination({ take: 5, page: 1 }),
    ).toBeDefined();
  });

  describe('createReport', () => {
    it('멘토링 로그를 가지고 있는 경우', async () => {
      const ml: MentoringLogs = new MentoringLogs();
      ml.reports = new Reports();
      jest
        .spyOn(service, 'findMentoringLogById')
        .mockImplementationOnce(async () => ml);
      await expect(service.createReport('mentoringLogId')).rejects.toThrowError(
        MethodNotAllowedException,
      );
    });

    it('멘토링 상태가 작성 가능이 아닌 경우', async () => {
      const ml: MentoringLogs = new MentoringLogs();
      ml.reportStatus = '작성불가';
      jest
        .spyOn(service, 'findMentoringLogById')
        .mockImplementationOnce(async () => ml);
      await expect(service.createReport('mentoringLogId')).rejects.toThrowError(
        MethodNotAllowedException,
      );
    });

    it('일반적인 경우', async () => {
      const ml: MentoringLogs = new MentoringLogs();
      ml.reportStatus = '작성가능';
      jest
        .spyOn(service, 'findMentoringLogById')
        .mockImplementationOnce(async () => ml);
      expect(await service.createReport('mentoringLogId')).toEqual('ok');
    });
  });

  describe('updateReport', () => {
    it('레포트 상태: 작성불가', async () => {
      const rp: Reports = new Reports();
      const ml: MentoringLogs = new MentoringLogs();
      ml.reportStatus = '작성불가';
      rp.mentoringLogs = ml;
      jest
        .spyOn(service, 'findReportWithMentoringLogsById')
        .mockImplementationOnce(async () => rp);

      const dto: UpdateReportDto = new UpdateReportDto();

      await expect(
        service.updateReport('reportid', 'mentorIntraIOd', [], 'sign', dto),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('레포트 상태: 작성완료', async () => {
      const rp: Reports = new Reports();
      const ml: MentoringLogs = new MentoringLogs();
      ml.reportStatus = '작성완료';
      rp.mentoringLogs = ml;
      jest
        .spyOn(service, 'findReportWithMentoringLogsById')
        .mockImplementationOnce(async () => rp);

      const dto: UpdateReportDto = new UpdateReportDto();

      await expect(
        service.updateReport('reportid', 'mentorIntraIOd', [], 'sign', dto),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('레포트 상태: ??', async () => {
      const rp: Reports = new Reports();
      const ml: MentoringLogs = new MentoringLogs();
      ml.reportStatus = '??';
      rp.mentoringLogs = ml;
      jest
        .spyOn(service, 'findReportWithMentoringLogsById')
        .mockImplementationOnce(async () => rp);

      const dto: UpdateReportDto = new UpdateReportDto();

      await expect(
        service.updateReport('reportid', 'mentorIntraIOd', [], 'sign', dto),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('레포트 상태: 작성가능, 동일하지 않은 유저', async () => {
      const rp: Reports = new Reports();
      const mt: Mentors = new Mentors();
      const ml: MentoringLogs = new MentoringLogs();
      ml.reportStatus = '작성가능';
      mt.intraId = 'm-engeng';
      rp.mentoringLogs = ml;
      rp.mentors = mt;
      jest
        .spyOn(service, 'findReportWithMentoringLogsById')
        .mockImplementationOnce(async () => rp);

      const dto: UpdateReportDto = new UpdateReportDto();
      const jwtMentorIntraId = 'QQQQQQQQQQQQQQQQQQQQQQ';

      await expect(
        service.updateReport('reportid', jwtMentorIntraId, [], 'sign', dto),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('레포트 상태: 작성가능, 동일한 유저', async () => {
      const rp: Reports = new Reports();
      const mt: Mentors = new Mentors();
      const ml: MentoringLogs = new MentoringLogs();
      ml.reportStatus = '작성가능';
      mt.intraId = 'm-engeng';
      rp.mentoringLogs = ml;
      rp.mentors = mt;
      jest
        .spyOn(service, 'findReportWithMentoringLogsById')
        .mockImplementationOnce(async () => rp);

      const dto: UpdateReportDto = new UpdateReportDto();
      const jwtMentorIntraId = 'm-engeng';

      expect(
        await service.updateReport(
          'reportid',
          jwtMentorIntraId,
          [],
          'sign',
          dto,
        ),
      ).toEqual('ok');
    });

    it('reportDone', async () => {
      const cadet: Cadets = new Cadets();
      const mentor: Mentors = new Mentors();
      const mentoringLogs: MentoringLogs = new MentoringLogs();

      const report: Reports = new Reports();
      report.mentoringLogs = mentoringLogs;
      report.mentors = mentor;
      report.cadets = cadet;
      report.id = 'idididididididididididididid';
      report.topic = '맛있는 점심';
      report.content = '최고의 학생이였답니다';
      report.updatedAt = new Date();
      report.createdAt = new Date();
      report.imageUrl = ['asd'];
      report.feedbackMessage = '피드백';
      report.feedback1 = 5;
      report.feedback2 = 4;
      report.feedback3 = 3;
      report.place = '개포';
      report.signatureUrl = 'asd';
      jest
        .spyOn(service, 'findReportWithMentoringLogsById')
        .mockImplementation(async () => report);

      jest.spyOn(service, 'calcMoney').mockImplementationOnce(() => 100000);
      expect(await service.reportDone('reportid')).toEqual(true);
    });
  });
});
