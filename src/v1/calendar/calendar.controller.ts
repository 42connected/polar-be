import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { CalendarService } from './service/calendar.service';

@Controller()
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Roles('cadet', 'mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/request-times/:mentorIntraId')
  getRequestTimes(
    @Param('mentorIntraId') mentorIntraId: string,
  ): Promise<Date[]> {
    return this.calendarService.getRequestTimes(mentorIntraId);
  }

  @Roles('cadet', 'mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/availabe-times/:mentorIntraId')
  getAvailabeTimes(
    @Param('mentorIntraId') mentorIntraId: string,
  ): Promise<Date[][]> {
    return this.calendarService.StringToJson(mentorIntraId);
  }
}
