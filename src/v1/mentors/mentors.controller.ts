import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { MentorsService } from './service/mentors.service';
import { MentoringsService } from './service/mentorings.service';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';

@Controller()
export class MentorsController {
  constructor(
    private readonly mentorsService: MentorsService,
    private readonly mentoringsService: MentoringsService,
  ) {}

  @Get()
  async getMentorDetails(@Param('mentorId') mentorId: string) {
    return await this.mentorsService.getMentorDetails(mentorId);
  }

  @Get('metorings')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentoringslists(@Req() req) {
    return await this.mentoringsService.getMentoringslists(req);
  }
}
