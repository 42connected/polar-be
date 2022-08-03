import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FortyTwoGuard } from 'src/v1/guards/forty-two.guard';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Get()
  hello() {
    console.log('hi');
  }

  @UseGuards(FortyTwoGuard)
  @Get('/oauth/callback')
  createJwt(@Req() req) {
    const { user } = req;
    const jwt = this.jwtService.sign({
      id: user.id,
      username: user.name,
    });
    return jwt;
  }
}
