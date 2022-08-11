import { Controller, Get, UseGuards, Query, Res } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { BocalsService } from './service/bocals.service';

@Controller()
export class BocalsController {
  constructor(private readonly bocalsService: BocalsService) {}

  @Get('dataroom')
  // @Roles('bocal')
  // @UseGuards(JwtGuard, RolesGuard)
  async getMentoringExcelFile(
    @Query('mentoringLogId') mentoringLogsId: string[],
    @Res({ passthrough: true }) res,
  ) {
    if (typeof mentoringLogsId === 'string')
      mentoringLogsId = [mentoringLogsId];
    await this.bocalsService.createMentoringExcelFile(mentoringLogsId, res);
  }
}
