import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { CreateMentorDatailDto } from '../dto/mentors/create-mentor-detail.dto';
import { Mentors } from '../entities/mentors.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { MentorsService } from './service/mentors.service';
import { MentoringsService } from './service/mentorings.service';
import { UpdateMentoringDto } from '../dto/mentors/update-mentoring.dto';

@Controller()
export class MentorsController {
  constructor(
    private readonly mentorsService: MentorsService,
    private readonly mentoringsService: MentoringsService,
  ) {}

  @Post()
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  async postMentorDetails(@Req() req, @Body() body: CreateMentorDatailDto) {
    const jwtUser = req.user;
    return await this.mentorsService.postMentorDetails(jwtUser.intraId, body);
  }

  // cadet -> mentor로 바꿀 것
  @Get('mentorings')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentoringsLists(@Req() req) {
    return await this.mentoringsService.getMentoringsLists(req);
  }

  @Patch('mentorings')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  async setMeetingAt(@Req() req, @Body() body: UpdateMentoringDto) {
    return await this.mentoringsService.setMeetingAt(req, body);
  }

  @Get(':intraId')
  @Roles('mentor', 'cadet')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentorDetails(@Param('intraId') intraId: string): Promise<Mentors> {
    return await this.mentorsService.getMentorDetails(intraId);
  }
}
