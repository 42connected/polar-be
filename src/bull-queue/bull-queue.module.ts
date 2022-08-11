import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { LoginConsumer } from './login-consumer';
import { LoginProducer } from './login-producer';
import 'dotenv/config';

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
        removeOnFail: 10,
      },
      limiter: {
        max: 2,
        duration: 1000,
      },
      settings: {
        maxStalledCount: 1,
      },
    }),
    BullModule.registerQueue({ name: 'login-queue' }),
  ],
  providers: [LoginConsumer, LoginProducer],
  exports: [LoginProducer],
})
export class BullQueueModule {}
