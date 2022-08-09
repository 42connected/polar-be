import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { LoginJob } from '../v1/interface/login-job.interface';

@Processor('login')
export class LoginConsumer {
  @Process()
  async login(job: Job<LoginJob>) {
    const { accessToken, url } = job.data;
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const profile = await result.json();
    return profile;
  }
}
