import {
  Controller,
  Get,
  UseGuards,
  Query,
  Res,
  Post,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { GetDataRoomDto } from '../dto/bocals/get-data-room.dto';
import { Reports } from '../entities/reports.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { BocalsService } from './service/bocals.service';
import { DataRoomService } from './service/data-room.service';

@ApiTags('bocals API')
@Controller()
export class BocalsController {
  constructor(
    private readonly bocalsService: BocalsService,
    private readonly dataRoomService: DataRoomService,
  ) {}

  @ApiOperation({
    summary: 'getMentoringExcelFile API',
    description: 'mentoringLogId를 이용해 해당 멘토링로그 엑셀 파일을 다운받음',
  })
  @Post('data-room/excel')
  @Roles('bocal')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentoringExcelFile(
    @Body('mentoringLogId') mentoringLogsId: string[],
    @Res({ passthrough: true }) response,
  ): Promise<void> {
    if (typeof mentoringLogsId === 'string') {
      mentoringLogsId = [mentoringLogsId];
    }
    return await this.bocalsService.createMentoringExcelFile(
      mentoringLogsId,
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
  ): Promise<[Reports[], number]> {
    return await this.dataRoomService.getReportPagination(getDataRoomDto);
  }
}
