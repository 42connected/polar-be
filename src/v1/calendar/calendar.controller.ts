import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { CalendarService } from './service/calendar.service';

@ApiTags('calendar API')
@Controller()
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @ApiOperation({
    summary: 'getRequestTimes API',
    description:
      '멘토님의 인트라 아이디로 다른 카뎃들이 해당 멘토님에 예약한 시간 정보들을 배열로 가져옴',
  })
  @Roles('cadet', 'mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/request-times/:mentorIntraId')
  getRequestTimes(
    @Param('mentorIntraId') mentorIntraId: string,
  ): Promise<Date[]> {
    return this.calendarService.getRequestTimes(mentorIntraId);
  }

  @ApiOperation({
    summary: 'getAvailabeTimes API',
    description: '해당 멘토님의 가능한 시간 목록을 가져옴',
  })
  @Roles('cadet', 'mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/availabe-times/:mentorIntraId')
  getAvailabeTimes(
    @Param('mentorIntraId') mentorIntraId: string,
  ): Promise<Date[][]> {
    return this.calendarService.StringToJson(mentorIntraId);
  }
}
