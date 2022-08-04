import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FortyTwoGuard } from 'src/v1/guards/forty-two.guard';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @UseGuards(FortyTwoGuard)
  @Get('/oauth/callback')
  createJwt(@Req() req) {
    const { user } = req;
    const jwt = this.jwtService.sign({
      sub: user.id,
      username: user.name,
      role: user.role,
    });
    return jwt;
  }
}
