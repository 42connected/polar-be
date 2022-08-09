import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenResponse } from '../interface/token-response.interface';

@Injectable()
export class AuthService {
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
      const result = await fetch(profileUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const profile = await result.json();
      return profile;
    } catch (err) {}
  }
}
