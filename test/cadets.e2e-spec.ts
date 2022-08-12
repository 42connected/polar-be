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

describe('CadetsController (e2e)', () => {
  let app: INestApplication;
  let mentorsService: MentorsService;

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
        CadetsModule,
        AuthModule,
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
    mentorsService = moduleFixture.get(MentorsService);
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

  // const result: AxiosResponse = {
  //   data: '이게리턴값?',
  //   status: 201,
  //   statusText: '여기뭘적든상관없는듯',
  //   headers: {},
  //   config: {},
  // };
  // // jest.spyOn(httpService, 'post').mockImplementationOnce(() => of(result));
  // jest.spyOn(cadetsService, 'findCadetByIntraId').mockImplementationOnce(() => of(result));
  // const expectedGpaString = 'ok';
  // const response = await request(app.getHttpServer()).post('/').expect(201);
  // console.log(response.text);
  // expect(response.text).toEqual(expectedGpaString);

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/')
      .send({ resumeUrl: 'test.com' })
      .expect(201);
  });

  it('/mentorings (GET)', () => {
    return request(app.getHttpServer()).get('/mentorings').expect(200);
  });

  it('/join (POST)', () => {
    return request(app.getHttpServer())
      .post('/join')
      .send({ name: 'test' })
      .expect(201);
  });

  it('/mentorings/apply/:mentorId (POST)', async () => {
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
      .post(`/mentorings/apply/${mentor.id}`)
      .send(apply)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
