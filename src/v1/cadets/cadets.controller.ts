import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { CadetsService } from './service/cadets.service';

@Controller()
export class CadetsController {
  constructor(private cadetsService: CadetsService) {}

  @Get('test')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  hello(@User() user) {
    console.log('guard test', user);
    return 'hi';
  }

  @Get('mentorings')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentoringLogs(@User() user) {
    const logs: MentoringLogs[] = await this.cadetsService.getMentoringLogs(
      user.id,
    );
    return logs;
  }
}
