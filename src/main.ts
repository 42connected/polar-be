import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';
import { setupSwagger } from './util/swagger';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './sentry.intercepter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sentry.init({
  //   dsn: process.env.SENTRY_DSN,
  //   debug: true,
  // });
  // app.useGlobalInterceptors(new SentryInterceptor());

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //   }),
  // );

  app.enableCors({
    credentials: true,
    origin: [
      process.env.FRONT_URL,
      process.env.NS_FRONT_URL,
      process.env.LOCALHOST,
    ],
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
  });
  app.use(
    ['/api-docs'],
    expressBasicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PWD },
    }),
  );
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
