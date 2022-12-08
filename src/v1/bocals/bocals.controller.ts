import {
  Controller,
  Get,
  UseGuards,
  Query,
  Res,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';

import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { BocalsService } from './service/bocals.service';
import { DataRoomService } from './service/data-room.service';
import { PaginationReportDto } from '../dto/reports/pagination-report.dto';
import { GetDataRoomDto } from './dto/get-data-room.dto';
import { REPORT_STATUS } from '../reports/ReportStatus';
import { GetDataRoom } from './decorators/get-data-room.decorator';

@ApiTags('bocals API')
@Controller()
export class BocalsController {
  constructor(
    private readonly bocalsService: BocalsService,
    private readonly dataRoomService: DataRoomService,
  ) {}

  @ApiOperation({
    summary: 'Download report',
    description:
      'body의 reportIds 배열을 이용하여 레포트를 찾아서 엑셀 파일로 다운받음',
  })
  @Post('data-room/excel')
  @Roles('bocal')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  async getMentoringExcelFile(
    @Body('reportIds') reportIds: string[],
    @Res({ passthrough: true }) response,
  ): Promise<void> {
    if (typeof reportIds === 'string') {
      reportIds = [reportIds];
    }
    return await this.bocalsService.createMentoringExcelFile(
      reportIds,
      response,
    );
  }

  @ApiOperation({
    summary: 'getAllRports API',
    description:
      '모든 보고서를 pagination해서 반환. 날짜, 멘토, 오름차순 정렬 가능함',
  })
  @Get('data-room')
  @GetDataRoom('bocal')
  async getReportPagination(
    @Query() getDataRoomDto: GetDataRoomDto,
  ): Promise<PaginationReportDto> {
    return await this.dataRoomService.getReportPagination(getDataRoomDto);
  }
}
