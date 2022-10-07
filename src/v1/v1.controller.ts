import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Login API')
export class V1Controller {
  @Get('login')
  @ApiOperation({
    summary: '42 OAuth login',
    description: '42 인트라 로그인 화면으로 리다이렉트',
  })
  @ApiCreatedResponse({
    description: '42 OAuth 콜백 uri로 리다이렉트',
  })
  login(): string {
    return `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.UID_42}&redirect_uri=${process.env.REDIRECT_42}&response_type=code`;
  }
}
