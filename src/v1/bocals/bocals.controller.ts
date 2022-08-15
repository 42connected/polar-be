import { Controller, Get, UseGuards, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { GetDataRoomDto } from '../dto/bocals/get-data-room.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { Reports } from '../entities/reports.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { BocalsService } from './service/bocals.service';
import { DataroomService } from './service/data-room.service';

@ApiTags('bocals API')
@Controller()
export class BocalsController {
  constructor(
    private readonly bocalsService: BocalsService,
    private readonly dataroomService: DataroomService,
  ) {}

  @ApiOperation({
    summary: 'getMentoringExcelFile API',
    description: 'mentoringLogId를 이용해 해당 멘토링로그 엑셀 파일을 다운받음',
  })
  @Get('data-room/excel')
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

  @Get('data-room')
  // @Roles('bocal')
  // @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  async getReportPagination(
    @Query() getDataroomDto: GetDataRoomDto,
  ): Promise<[Reports[], number]> {
    return await this.dataroomService.getReportPagination(getDataroomDto);
  }
}
