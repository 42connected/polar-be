import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LoginProducer } from 'src/bull-queue/login-producer';
import { TokenResponse } from '../interface/token-response.interface';
import fetch from 'node-fetch';
import { AuthResponse } from '../dto/auth-response.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private loginProducer: LoginProducer) {}

  matchRoles(roles: string[], userRole: string) {
    if (!roles.includes(userRole)) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }
    return true;
  }

  setCookies(res: Response, infos: AuthResponse): void {
    const maxAge = 60 * 60 * 24;
    res.cookie('info_join', infos.user.join, { maxAge });
    res.cookie('user_role', infos.user.role, { maxAge });
    res.cookie('intra_id', infos.user.intraId, { maxAge });
    res.cookie('access_token', infos.jwt, { maxAge });
  }

  async getAccessToken(code: string): Promise<string> {
    const tokenUrl = `https://api.intra.42.fr/oauth/token?grant_type=authorization_code&client_id=${process.env.UID_42}&client_secret=${process.env.SECRET_42}&code=${code}&redirect_uri=${process.env.REDIRECT_42}`;
    let res;
    try {
      res = await fetch(tokenUrl, { method: 'post' });
    } catch (err) {
      throw new ConflictException(err, 'fetch 작업 중 에러가 발생했습니다.');
    }
    if (res.status >= 400) {
      throw new ConflictException('Access Token을 받아올 수 없습니다.');
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
