import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtGuard } from 'src/v1/guards/jwt.guard';
import { MentorsModule } from 'src/v1/mentors/mentors.module';
import { JwtStrategy } from 'src/v1/strategies/jwt.strategy';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import 'dotenv/config';
import { AuthModule } from 'src/v1/auth/auth.module';
import { BullQueueModule } from 'src/bull-queue/bull-queue.module';
import { AvailableTimeDto } from 'src/v1/dto/available-time.dto';
import { UpdateMentorDatailDto } from 'src/v1/dto/mentors/mentor-detail.dto';
import { JoinMentorDto } from 'src/v1/dto/mentors/join-mentor-dto';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

describe('MentorsController (e2e)', () => {
  let app: INestApplication;

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
        MentorsModule,
        AuthModule,
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
          req.user = { intraId: 'm-tedkim', role: 'mentor' };
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
    await app.init();
  });

  it('GET /mentorings', () => {
    return request(app.getHttpServer())
      .get('/mentorings?take=2&page=1')
      .expect(200);
  });

  it('GET /simplelogs/:mentorIntraId', () => {
    return request(app.getHttpServer())
      .get('/simplelogs/m-engeng?take=10&page=1')
      .expect(200);
  });

  it('PATCH /join', () => {
    const availableTime: AvailableTimeDto = {
      startHour: 10,
      startMinute: 30,
      endHour: 15,
      endMinute: 0,
    };
    const body: JoinMentorDto = {
      name: '테스트',
      isActive: true,
      availableTime: [[availableTime], [], [], [], [availableTime], [], []],
      slackId: 'm-tedkim',
    };
    return request(app.getHttpServer()).patch('/join').send(body).expect(200);
  });

  it('GET /:intraId', () => {
    return request(app.getHttpServer()).get('/m-engeng').expect(200);
  });

  it('PATCH /:intraId', () => {
    const availableTime: AvailableTimeDto = {
      startHour: 11,
      startMinute: 30,
      endHour: 14,
      endMinute: 0,
    };
    const body: UpdateMentorDatailDto = {
      availableTime: [
        [availableTime],
        [],
        [availableTime],
        [],
        [availableTime],
        [],
        [],
      ],
    };
    return request(app.getHttpServer())
      .patch('/m-tedkim')
      .send(body)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
