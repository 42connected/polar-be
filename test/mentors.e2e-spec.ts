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
      ],
      providers: [JwtStrategy],
    })
      .overrideGuard(JwtGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { intraId: 'm-engeng', role: 'mentor' };
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

  it('GET /', () => {
    return request(app.getHttpServer())
      .get('/?searchText=m-engeng')
      .expect(200);
  });

  it('GET /mentorings', () => {
    return request(app.getHttpServer()).get('/mentorings').expect(200);
  });

  it('POST /', () => {
    const availableTime: AvailableTimeDto = {
      start_hour: 8,
      start_minute: 30,
      end_hour: 10,
      end_minute: 0,
    };
    const body: Partial<UpdateMentorDatailDto> = {
      availableTime: [[availableTime], [], [], [], [availableTime], [], []],
      introduction: '테스트중',
    };
    return request(app.getHttpServer()).post('/').send(body).expect(201);
  });

  it('POST /join', () => {
    const availableTime: AvailableTimeDto = {
      start_hour: 8,
      start_minute: 30,
      end_hour: 10,
      end_minute: 0,
    };
    const body: JoinMentorDto = {
      name: '테스트',
      availableTime: [[availableTime], [], [], [], [availableTime], [], []],
    };
    return request(app.getHttpServer()).post('/join').send(body).expect(201);
  });

  it('GET /:intraId', () => {
    return request(app.getHttpServer()).get('/m-engeng').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
