import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { LoginConsumer } from './login-consumer';
import { LoginProducer } from './login-producer';
import 'dotenv/config';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 100,
      },
      limiter: {
        max: 2,
        duration: 1000,
      },
    }),
    BullModule.registerQueue({ name: 'login' }),
    HttpModule,
  ],
  providers: [LoginConsumer, LoginProducer],
  exports: [LoginProducer],
})
export class BullQueueModule {}
