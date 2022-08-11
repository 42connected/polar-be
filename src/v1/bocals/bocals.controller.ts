import { Controller, Get, UseGuards, Query, Res } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { BocalsService, MentoringInfo } from './service/bocals.service';

@Controller()
export class BocalsController {
  constructor(private readonly bocalsService: BocalsService) {}

  @Get('dataroom')
  @Roles('bocal')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentoringExcelFile(
    @Query('reportId') reportsId: string[],
    @Res({ passthrough: true }) res,
  ) {
    reportsId;
    const test: MentoringInfo[] = [
      {
        mentorName: 'test',
        mentorCompany: 'string',
        mentorDuty: 'string',
        date: 'string',
        place: 'string',
        isCommon: true,
        startTime: 'string',
        endTime: 'string',
        totalHour: 0,
        money: 0,
        catetName: 'string',
      },
      {
        mentorName: 'test',
        mentorCompany: 'string',
        mentorDuty: 'string',
        date: 'string',
        place: 'string',
        isCommon: false,
        startTime: 'string',
        endTime: 'string',
        totalHour: 0,
        money: 0,
        catetName: 'string',
      },
    ];
    await this.bocalsService.createMentoringExcelFile(test, res);
  }
}
