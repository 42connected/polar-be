import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { BullQueueModule } from 'src/bull-queue/bull-queue.module';
import { JwtStrategy } from 'src/v1/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from 'src/v1/guards/jwt.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { MentoringLogsModule } from 'src/v1/mentoring-logs/mentoring-logs.module';
import { Repository } from 'typeorm';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { ApproveMentoringDto } from 'src/v1/dto/mentoring-logs/approve-mentoring.dto';
import { RejectMentoringDto } from 'src/v1/dto/mentoring-logs/reject-mentoring.dto';
import { CompleteMentoringDto } from 'src/v1/dto/mentoring-logs/complete-mentoring.dto';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

describe('MentoringLogsController (e2e)', () => {
  let app: INestApplication;
  let mentoringLogsRepo: Repository<MentoringLogs>;
  let mentorsRepo: Repository<Mentors>;
  let cadetsRepo: Repository<Cadets>;

  const createMentoringLog = async (
    mentorIntraId: string,
    cadetIntraId: string,
    status: string,
  ): Promise<MentoringLogs> => {
    const mentors = await mentorsRepo.findOneBy({
      intraId: mentorIntraId,
    });
    const cadets = await cadetsRepo.findOneBy({ intraId: cadetIntraId });
    const mentoringLogsData: Partial<MentoringLogs> = {
      mentors,
      cadets,
      topic: '멘토링로그테스트용',
      content: 'test',
      status,
      requestTime1: [
        new Date('2022-08-18T10:00:00Z'),
        new Date('2022-08-18T11:30:00Z'),
      ],
    };
    const log = mentoringLogsRepo.create(mentoringLogsData);
    await mentoringLogsRepo.save(log);
    return log;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        BullQueueModule,
        ScheduleModule.forRoot(),
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
        MailerModule.forRootAsync({
          useFactory: () => ({
            transport: {
              host: 'smtp.gmail.com',
              port: parseInt(process.env.EMAIL_PORT, 10),
              auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
              },
            },
            template: {
              dir: './templates',
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          }),
        }),
        MentoringLogsModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideGuard(JwtGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { intraId: 'm-dada', role: 'mentor' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    mentoringLogsRepo = moduleFixture.get<Repository<MentoringLogs>>(
      'MentoringLogsRepository',
    );
    mentorsRepo = moduleFixture.get<Repository<Mentors>>('MentorsRepository');
    cadetsRepo = moduleFixture.get<Repository<Cadets>>('CadetsRepository');
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
    await app.init();
  });

  afterEach(async () => {
    const found = await mentoringLogsRepo.findOneBy({
      topic: '멘토링로그테스트용',
    });
    if (found) {
      await mentoringLogsRepo.remove(found);
    }
  });

  it('PATCH /approve', async () => {
    const log = await createMentoringLog('m-dada', 'nakkim', '대기중');
    const body: ApproveMentoringDto = {
      mentoringLogId: log.id,
      meetingAt: [
        new Date('2022-08-18T10:00:00Z'),
        new Date('2022-08-18T11:30:00Z'),
      ],
    };
    return request(app.getHttpServer())
      .patch('/approve')
      .send(body)
      .expect(200);
  });

  it('PATCH /reject', async () => {
    const log = await createMentoringLog('m-dada', 'nakkim', '대기중');
    const body: RejectMentoringDto = {
      mentoringLogId: log.id,
      rejectMessage: '테스트중',
    };
    return request(app.getHttpServer()).patch('/reject').send(body).expect(200);
  });

  it('PATCH /done', async () => {
    const log = await createMentoringLog('m-dada', 'nakkim', '확정');
    const body: CompleteMentoringDto = {
      mentoringLogId: log.id,
    };
    return request(app.getHttpServer()).patch('/done').send(body).expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
