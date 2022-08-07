import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CadetsService } from './v1/cadets/service/cadets.service';
import { jwtUser } from './v1/dto/jwt-user.interface';
import { MentorsService } from './v1/mentors/service/mentors.service';

@Injectable()
export class ValidateInfoMiddleware implements NestMiddleware {
  constructor(
    private mentorsService: MentorsService,
    private cadetsService: CadetsService,
    private jwtService: JwtService,
  ) {}

  async use(req: any, res: Response, next: () => void): Promise<void> {
    const jwt = req.headers['authorization'];
    if (jwt === undefined) {
      return next();
    }
    const user: jwtUser = this.jwtService.verify(jwt.substring(7));
    if (user.role === 'mentor') {
      if ((await this.mentorsService.validateInfo(user.intraId)) === false) {
        return res.redirect('join');
      }
    } else if (user.role === 'cadet') {
      if ((await this.cadetsService.validateInfo(user.intraId)) === false) {
        return res.redirect('join');
      }
    }
    next();
  }
}
