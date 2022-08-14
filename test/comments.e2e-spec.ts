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
import { JwtStrategy } from 'src/v1/strategies/jwt.strategy';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Repository } from 'typeorm';
import { Mentors } from 'src/v1/entities/mentors.entity';

describe('CommentsController', () => {
  let app: INestApplication;
  let mentorsRepo: Repository<Mentors>;
  const mentorIntraId = 'm-dada';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
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
      ],
      providers: [JwtStrategy],
    })
      .overrideGuard(JwtGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { intraId: 'jojoo', role: 'cadet' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    mentorsRepo = moduleFixture.get<Repository<Mentors>>('MentorsRepository');
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

  it('GET /:mentorIntraId', () => {
    return request(app.getHttpServer())
      .get(`/${mentorIntraId}?take=10&page=1`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
