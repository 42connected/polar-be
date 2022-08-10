import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class LoginProducer {
  constructor(@InjectQueue('login') private loginQueue: Queue) {}

  async addJob(url: string, accessToken: string) {
    const job = await this.loginQueue.add(
      { url, accessToken },
      { attempts: 10, backoff: 1000 },
    );
    return await job.finished();
  }
}
