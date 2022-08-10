import { HttpService } from '@nestjs/axios';
import { Process, Processor } from '@nestjs/bull';
import { ConflictException } from '@nestjs/common';
import { Job } from 'bull';
import { LoginJob } from '../v1/interface/login-job.interface';

@Processor('login')
export class LoginConsumer {
  constructor(private httpService: HttpService) {}

  @Process()
  async login(job: Job<LoginJob>) {
    try {
      const { accessToken, url } = job.data;
      const profile = (
        await this.httpService.axiosRef.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data;
      return profile;
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 프로필을 받아오는 중 에러가 발생했습니다.',
      );
    }
  }
}
