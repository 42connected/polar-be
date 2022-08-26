import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CadetsModule } from 'src/v1/cadets/cadets.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from 'src/v1/auth/auth.module';
import { BullQueueModule } from 'src/bull-queue/bull-queue.module';
import { JwtStrategy } from 'src/v1/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from 'src/v1/guards/jwt.guard';
import { MentorsService } from 'src/v1/mentors/service/mentors.service';
import { CreateApplyDto } from 'src/v1/dto/cadets/create-apply.dto';
import { BatchModule } from 'src/v1/batch/batch.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from 'src/v1/email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Repository } from 'typeorm';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';

describe('CadetsController (e2e)', () => {
  let app: INestApplication;
  let mentorsService: MentorsService;
  let mentoringLogsRepo: Repository<MentoringLogs>;

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
        CadetsModule,
        AuthModule,
        BatchModule,
        EmailModule,
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
      ],
      providers: [JwtStrategy],
    })
      .overrideGuard(JwtGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { intraId: 'nakkim', role: 'cadet' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    mentorsService = moduleFixture.get<MentorsService>(MentorsService);
    mentoringLogsRepo = moduleFixture.get<Repository<MentoringLogs>>(
      'MentoringLogsRepository',
    );
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

  it('POST /', () => {
    return request(app.getHttpServer())
      .post('/')
      .send({ resumeUrl: 'test.com' })
      .expect(201);
  });

  it('GET /mentorings', () => {
    return request(app.getHttpServer()).get('/mentorings').expect(200);
  });

  it('PATCH /join', () => {
    return request(app.getHttpServer())
      .patch('/join')
      .send({ name: '김나경' })
      .expect(200);
  });

  it('POST /mentorings/apply/:mentorIntraId', async () => {
    const testLogs = await mentoringLogsRepo.find({
      where: {
        topic: 'test',
      },
    });
    if (testLogs) await mentoringLogsRepo.remove(testLogs);
    const apply: Partial<CreateApplyDto> = {
      topic: 'test',
      content: '테스트중',
      requestTime1: [
        new Date('2022-08-12T08:00:00Z'),
        new Date('2022-08-12T10:00:00Z'),
      ],
    };
    const mentor = await mentorsService.findByIntra('m-engeng');
    return request(app.getHttpServer())
      .post(`/mentorings/apply/${mentor.intraId}`)
      .send(apply)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
