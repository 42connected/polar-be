import { Controller, Get, Res } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

@Controller()
@ApiTags('v1 login API')
export class V1Controller {
  @Get('login')
  @ApiOperation({
    summary: 'login API',
    description: 'login api',
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
