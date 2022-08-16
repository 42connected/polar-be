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

describe('MentorsController (e2e)', () => {
  let app: INestApplication;
  let logRepo: Repository<MentoringLogs>;
  let reportRepo: Repository<Reports>;
  const mentorIntraId = 'm-dada';

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
    logRepo = moduleFixture.get('MentoringLogsRepository');
    reportRepo = moduleFixture.get('ReportsRepository');
    await app.init();
  });

  it('GET /:reportId', async () => {
    const report = await reportRepo.find();
    return request(app.getHttpServer()).get(`/${report[0].id}`).expect(200);
  });

  it('POST /:mentoringLogId', async () => {
    const log: MentoringLogs = await logRepo.findOne({
      where: {
        topic: '테스트용멘토링로그',
        mentors: { intraId: mentorIntraId },
      },
    });
    if (log) {
      const report: Reports = await reportRepo.findOneBy({
        mentoringLogs: {
          id: log.id,
        },
      });
      if (report) await reportRepo.remove(report);
    }
    const body: Partial<UpdateReportDto> = {
      place: '강남역',
      topic: '개발중',
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
    const report = await reportRepo.findOne({
      where: {
        mentors: { intraId: mentorIntraId },
      },
    });
    const body = {
      place: '강남역',
      topic: '개발중',
      content: 'update report',
    };
    return request(app.getHttpServer())
      .patch(`/${report.id}`)
      .send(body)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
