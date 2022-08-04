import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';

@Controller()
export class CadetsController {
  @Get('test')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  hello(@Req() req) {
    console.log('guard test', req.user);
    return 'hi';
  }
}
