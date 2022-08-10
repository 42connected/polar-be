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
import { CadetsService } from 'src/v1/cadets/service/cadets.service';

describe('CadetsController (e2e)', () => {
  let app: INestApplication;
  let cadetsService: CadetsService;

  beforeEach(async () => {
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
    cadetsService = moduleFixture.get(CadetsService);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  // it('/test (GET)', () => {
  //   return request(app.getHttpServer()).get('/test').expect(200).expect('hi');
  // });

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/')
      .send({ resumeUrl: 'test.com' })
      .expect(201);
  });

  it('/mentorings (GET)', () => {
    // const result = request(app.getHttpServer()).get('/mentorings').expect(200);
    // console.log(result);
    return request(app.getHttpServer()).get('/mentorings').expect(200);
  });

  it('/join (POST)', async () => {
    // request(app.getHttpServer())
    //   .post('/join')
    //   .send({ name: 'asdf' })
    //   .expect(201);
    // const user = await cadetsService.findCadetByIntraId('nakkim');
    // console.log(user);
    return request(app.getHttpServer())
      .post('/join')
      .send({ name: 'test' })
      .expect(201);
  });

  afterAll(async () => {
    // await app.close();
    await Promise.all([app.close()]);
  });
});
