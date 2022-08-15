import { Controller, Get, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller()
@ApiTags('login API')
export class V1Controller {
  @Get('login')
  @ApiOperation({
    summary: 'login API',
    description: 'intra 로그인',
  })
  @ApiCreatedResponse({
    description: 'login 성공',
    type: Promise<void>,
  })
  login(@Res() res: Response): void {
    const authorizationUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.UID_42}&redirect_uri=${process.env.REDIRECT_42}&response_type=code`;
    res.redirect(authorizationUrl);
  }
}
