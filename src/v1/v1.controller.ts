import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class V1Controller {
  @Get('login')
  login(@Res() res: Response): void {
    const authorizationUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.UID_42}&redirect_uri=${process.env.REDIRECT_42}&response_type=code`;
    res.redirect(authorizationUrl);
  }
}
