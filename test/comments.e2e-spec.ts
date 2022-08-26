import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { JwtGuard } from 'src/v1/guards/jwt.guard';
import { JwtStrategy } from 'src/v1/strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from 'src/v1/comments/comments.module';
import { AuthModule } from 'src/v1/auth/auth.module';
import { BullQueueModule } from 'src/bull-queue/bull-queue.module';
import { CreateCommentDto } from 'src/v1/dto/comment/comment.dto';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Comments } from 'src/v1/entities/comments.entity';

describe('CommentsController (e2e)', () => {
  let app: INestApplication;
  let commentsRepo: Repository<Comments>;
  const mentorIntraId = 'm-engeng';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
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
        AuthModule,
        BullQueueModule,
        CommentsModule,
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
    commentsRepo =
      moduleFixture.get<Repository<Comments>>('CommentsRepository');
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

  it('POST /:mentorIntraId', () => {
    const body: CreateCommentDto = {
      content: '테스트',
    };
    return request(app.getHttpServer())
      .post(`/${mentorIntraId}`)
      .send(body)
      .expect(201);
  });

  // it('PATCH /:commentId', () => {
  // })

  it('DELETE /:commentId', async () => {
    const target = await commentsRepo.findOneBy({ content: '테스트' });
    return request(app.getHttpServer()).delete(`/${target.id}`).expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
