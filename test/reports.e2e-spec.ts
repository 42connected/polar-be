import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import 'dotenv/config';
import { ReportsModule } from 'src/v1/reports/reports.module';
import { JwtStrategy } from 'src/v1/strategies/jwt.strategy';
import { JwtGuard } from 'src/v1/guards/jwt.guard';
import { BullQueueModule } from 'src/bull-queue/bull-queue.module';
import { AuthModule } from 'src/v1/auth/auth.module';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Repository } from 'typeorm';
import { UpdateReportDto } from 'src/v1/dto/reports/report.dto';
import { Reports } from 'src/v1/entities/reports.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Cadets } from 'src/v1/entities/cadets.entity';

describe('MentorsController (e2e)', () => {
  let app: INestApplication;
  let logsRepo: Repository<MentoringLogs>;
  let reportsRepo: Repository<Reports>;
  let mentorsRepo: Repository<Mentors>;
  let cadetsRepo: Repository<Cadets>;
  const mentorIntraId = 'm-dada';

  const createMentoringLog = async (
    mentorIntraId: string,
    cadetIntraId: string,
  ): Promise<MentoringLogs> => {
    const mentors = await mentorsRepo.findOneBy({
      intraId: mentorIntraId,
    });
    const cadets = await cadetsRepo.findOneBy({ intraId: cadetIntraId });
    const mentoringLogsData: Partial<MentoringLogs> = {
      mentors,
      cadets,
      topic: '레포트테스트용',
      content: 'test',
      status: '완료',
      requestTime1: [
        new Date('2022-08-18T10:00:00Z'),
        new Date('2022-08-18T11:30:00Z'),
      ],
      meetingAt: [
        new Date('2022-08-18T10:00:00Z'),
        new Date('2022-08-18T11:30:00Z'),
      ],
    };
    const log = logsRepo.create(mentoringLogsData);
    await logsRepo.save(log);
    return log;
  };

  const createReport = async (logId): Promise<Reports> => {
    const log = await logsRepo.findOne({
      where: { id: logId },
      relations: {
        mentors: true,
        cadets: true,
      },
    });
    const data: Partial<Reports> = {
      cadets: log.cadets,
      mentors: log.mentors,
      status: '작성중',
      topic: '레포트테스트용',
      mentoringLogs: log,
    };
    const report = await reportsRepo.create(data);
    await reportsRepo.save(report);
    return report;
  };

  const getReport = async (): Promise<Reports> => {
    const log = await logsRepo.findOneBy({ topic: '레포트테스트용' });
    const report = await reportsRepo.findOneBy({
      mentoringLogs: { id: log.id },
    });
    return report;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        BullQueueModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: parseInt(process.env.POSTGRES_PORT, 10),
          username: process.env.POSTGRES_USERNAME,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DATABASE,
          entities: [__dirname + '/../src/v1/entities/*.entity.ts'],
          logging: false,
          synchronize: false,
          namingStrategy: new SnakeNamingStrategy(),
        }),
        JwtModule.registerAsync({
          useFactory: () => {
            return {
              secret: process.env.JWT_SECRET,
              signOptions: { expiresIn: process.env.JWT_EXPIRE },
            };
          },
        }),
        ReportsModule,
        AuthModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideGuard(JwtGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { intraId: mentorIntraId, role: 'mentor' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    logsRepo = moduleFixture.get<Repository<MentoringLogs>>(
      'MentoringLogsRepository',
    );
    reportsRepo = moduleFixture.get<Repository<Reports>>('ReportsRepository');
    mentorsRepo = moduleFixture.get<Repository<Mentors>>('MentorsRepository');
    cadetsRepo = moduleFixture.get<Repository<Cadets>>('CadetsRepository');
    await app.init();
    await createMentoringLog('m-dada', 'nakkim');
  });

  beforeEach(async () => {
    const log = await logsRepo.findOneBy({ topic: '레포트테스트용' });
    if (!log.reports) {
      await createReport(log.id);
    }
  });

  afterEach(async () => {
    const report = await getReport();
    if (report) {
      await reportsRepo.remove(report);
    }
  });

  it('GET /:reportId', async () => {
    const report = await getReport();
    return request(app.getHttpServer()).get(`/${report.id}`).expect(200);
  });

  it('POST /:mentoringLogId', async () => {
    const log = await logsRepo.findOneBy({ topic: '레포트테스트용' });
    const report = await reportsRepo.findOneBy({
      mentoringLogs: { id: log.id },
    });
    if (report) {
      await reportsRepo.remove(report);
    }
    const body: Partial<UpdateReportDto> = {
      place: '강남역',
      content: 'test test test test test test test test test',
      feedbackMessage: '잘하자',
      feedback1: 1,
      feedback2: 2,
      feedback3: 3,
    };
    return request(app.getHttpServer())
      .post(`/${log.id}`)
      .send(body)
      .expect(201);
  });

  it('PATCH /:reportId', async () => {
    const report = await getReport();
    const body = {
      place: '강남역',
      content: 'update report',
    };
    return request(app.getHttpServer())
      .patch(`/${report.id}`)
      .send(body)
      .expect(200);
  });

  afterAll(async () => {
    const log = await logsRepo.findOneBy({ topic: '레포트테스트용' });
    if (log) {
      await logsRepo.remove(log);
    }
    await app.close();
  });
});
