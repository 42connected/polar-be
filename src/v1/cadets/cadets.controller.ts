import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { CadetsService } from './service/cadets.service';

@Controller()
export class CadetsController {
  constructor(private cadetsService: CadetsService) {}

  @Get('test')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  hello(@Req() req) {
    console.log('guard test', req.user);
    return 'hi';
  }

  @Get('mentorings')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentoringLogs(@Req() req) {
    const logs = await this.cadetsService.getMentoringLogs(req.user.id);
    return logs;
  }
}
