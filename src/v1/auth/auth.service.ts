import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginProducer } from 'src/bull-queue/login-producer';
import { TokenResponse } from '../interface/token-response.interface';
import fetch from 'node-fetch';

@Injectable()
export class AuthService {
  constructor(private loginProducer: LoginProducer) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.includes(userRole);
  }

  async getAccessToken(code: string): Promise<string> {
    const tokenUrl = `https://api.intra.42.fr/oauth/token?grant_type=authorization_code&client_id=${process.env.UID_42}&client_secret=${process.env.SECRET_42}&code=${code}&redirect_uri=${process.env.REDIRECT_42}`;
    let res;
    try {
      res = await fetch(tokenUrl, { method: 'post' });
    } catch (err) {
      throw new ConflictException(err, 'fetch 작업 중 에러가 발생했습니다.');
    }
    console.log(res);
    if (res.status >= 400) {
      throw new UnauthorizedException('Access Token을 받아올 수 없습니다.');
    }
    try {
      const data: TokenResponse = await res.json();
      return data.access_token;
    } catch (err) {
      throw new ConflictException(
        err,
        '응답에서 데이터를 얻어 오는 중 에러가 발생했습니다.',
      );
    }
  }

  async getProfile(accessToken: string) {
    try {
      const profileUrl = 'https://api.intra.42.fr/v2/me';
      return await this.loginProducer.addJob(profileUrl, accessToken);
    } catch (err) {
      throw new ConflictException(err, '42 api 호출 중 에러가 발생했습니다.');
    }
  }
}
