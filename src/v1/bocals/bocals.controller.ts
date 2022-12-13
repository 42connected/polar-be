import {
  Controller,
  Get,
  UseGuards,
  Query,
  Res,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { GetDataRoomDto } from '../dto/bocals/get-data-room.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { BocalsService } from './service/bocals.service';
import { DataRoomService } from './service/data-room.service';
import { PaginationReportDto } from '../dto/reports/pagination-report.dto';
import { ReportIdDto } from '../dto/bocals/patch-report-status.dto';

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
  @Roles('bocal')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  async getReportPagination(
    @Query() getDataRoomDto: GetDataRoomDto,
  ): Promise<PaginationReportDto> {
    return await this.dataRoomService.getReportPagination(getDataRoomDto);
  }

  @ApiOperation({
    summary: 'patchReportStatusToEdit API',
    description: '선택한 보고서 상태를 작성완료 -> 수정기간 상태로 변경',
  })
  @Roles('bocal')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Patch('data-room/reports/edit')
  async patchReportStatusToEdit(@Body() reportIdDto: ReportIdDto) {
    return this.bocalsService.patchReportStatusToEdit(reportIdDto.id);
  }

  @Roles('bocal')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Patch('data-room/reports/done')
  async patchReportStatusToDone(@Body() reportIdDto: ReportIdDto) {
    return this.bocalsService.patchReportStatusToDone(reportIdDto.id);
  }

  @Roles('bocal')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Patch('data-room/reports/all/edit')
  async patchAllReportStatusToEdit() {
    return this.bocalsService.patchAllReportStatusToEdit();
  }

  @Roles('bocal')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Patch('data-room/reports/all/done')
  async patchAllReportStatusToDone() {
    return this.bocalsService.patchAllReportStatusToDone();
  }
}
