import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class LoginProducer {
  constructor(@InjectQueue('login-queue') private loginQueue: Queue) {}

  async addJob(url: string, accessToken: string) {
    console.log(`Left Jobs: ${await this.loginQueue.count()}`);
    const job = await this.loginQueue.add(
      'get-profile',
      { url, accessToken },
      { attempts: 10, backoff: 1000 },
    );
    console.log(`Job(${job.id}) created.`);
    return await job.finished();
  }
}
