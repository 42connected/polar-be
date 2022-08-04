import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  matchRoles(roles: string[], userRole: string) {
    return roles.includes(userRole);
  }
}
