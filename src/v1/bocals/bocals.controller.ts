import { Controller, Get, UseGuards, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { BocalsService } from './service/bocals.service';

@ApiTags('bocals API')
@Controller()
export class BocalsController {
  constructor(private readonly bocalsService: BocalsService) {}

  @ApiOperation({
    summary: 'getMentoringExcelFile API',
    description: 'mentoringLogId를 이용해 해당 멘토링로그 엑셀 파일을 다운받음',
  })
  @Get('dataroom/excel')
  @Roles('bocal')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentoringExcelFile(
    @Query('mentoringLogId') mentoringLogsId: string[],
    @Res({ passthrough: true }) res,
  ) {
    if (typeof mentoringLogsId === 'string')
      mentoringLogsId = [mentoringLogsId];
    await this.bocalsService.createMentoringExcelFile(mentoringLogsId, res);
  }
}
