import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { LoginConsumer } from './login-consumer';
import { LoginProducer } from './login-producer';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
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
  ],
  providers: [LoginConsumer, LoginProducer],
  exports: [LoginProducer],
})
export class BullQueueModule {}
