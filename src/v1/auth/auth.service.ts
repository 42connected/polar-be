import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginProducer } from 'src/bull-queue/login-producer';
import { TokenResponse } from '../interface/token-response.interface';

@Injectable()
export class AuthService {
  constructor(private loginProducer: LoginProducer) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.includes(userRole);
  }

  async getAccessToken(code: string): Promise<string> {
    try {
      const tokenUrl = `https://api.intra.42.fr/oauth/token?grant_type=authorization_code&client_id=${process.env.UID_42}&client_secret=${process.env.SECRET_42}&code=${code}&redirect_uri=${process.env.REDIRECT_42}`;
      const response = await fetch(tokenUrl, { method: 'post' });
      const token: TokenResponse = await response.json();
      return token.access_token;
    } catch (err) {
      throw new UnauthorizedException(err); // 에러 메세지?
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
