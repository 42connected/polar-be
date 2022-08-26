import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CadetsService } from '../cadets/service/cadets.service';
import { JwtUser } from '../interface/jwt-user.interface';
import { MentorsService } from '../mentors/service/mentors.service';

@Injectable()
export class ValidateInfoMiddleware implements NestMiddleware {
  constructor(
    private mentorsService: MentorsService,
    private cadetsService: CadetsService,
    private jwtService: JwtService,
  ) {}

  async use(req: any, res: Response, next: () => void): Promise<void> {
    const jwt = req.headers['authorization'];
    if (jwt === undefined || !jwt.startsWith('Bearer')) {
      return next();
    }
    const user: JwtUser = this.jwtService.verify(jwt.substring(7));
    if (user.role === 'mentor') {
      if ((await this.mentorsService.validateInfo(user.intraId)) === false) {
        return res.redirect(`${process.env.FRONT_URL}/mentors/join`);
      }
    } else if (user.role === 'cadet') {
      if ((await this.cadetsService.validateInfo(user.intraId)) === false) {
        return res.redirect(`${process.env.FRONT_URL}/cadets/join`);
      }
    }
    next();
  }
}
