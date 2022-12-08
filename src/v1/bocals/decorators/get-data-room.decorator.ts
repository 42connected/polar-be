import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { JwtGuard } from 'src/v1/guards/jwt.guard';
import { RolesGuard } from 'src/v1/guards/role.guard';
import { REPORT_STATUS } from 'src/v1/reports/ReportStatus';

export function GetDataRoom(role: string) {
  return applyDecorators(
    Roles(role),
    UseGuards(JwtGuard, RolesGuard),
    ApiBearerAuth('access-token'),
    ApiQuery({
      name: 'status',
      description: '보고서 상태 조회',
      required: false,
      enum: REPORT_STATUS,
    }),
    ApiQuery({
      name: 'mentorIntra',
      description: '멘토 인트라넷 아이디로 조회',
      required: false,
      type: String,
    }),
    ApiQuery({
      name: 'take',
      description: '페이지당 데이터 수',
      required: true,
      type: Number,
    }),
    ApiQuery({
      name: 'page',
      description: '페이지 번호',
      required: true,
      type: Number,
    }),
    ApiQuery({
      name: 'sort',
      description: '정렬 기준',
      required: false,
      type: String,
    }),
    ApiQuery({
      name: 'order',
      description: '정렬 방식',
      required: false,
      type: String,
    }),
    ApiQuery({
      name: 'startDate',
      description: '시작 날짜',
      required: false,
      type: String,
    }),
    ApiQuery({
      name: 'endDate',
      description: '끝 날짜',
      required: false,
      type: String,
    }),
  );
}
