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
import { User } from '../decorators/user.decorator';
import { jwtUser } from '../dto/jwt-user.interface';
import { CreateMentorDatailDto } from '../dto/mentors/create-mentor-detail.dto';
import { Mentors } from '../entities/mentors.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { MentorsService } from './service/mentors.service';
import { MentoringsService } from './service/mentorings.service';
import { UpdateMentoringDto } from '../dto/mentors/update-mentoring.dto';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { MentorMentoringInfo } from '../dto/mentor-mentoring-info.interface';

@Controller()
export class MentorsController {
  constructor(
    private readonly mentorsService: MentorsService,
    private readonly mentoringsService: MentoringsService,
  ) {}

  @Post()
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  async postMentorDetails(
    @User() user: jwtUser,
    @Body() body: CreateMentorDatailDto,
  ) {
    return await this.mentorsService.postMentorDetails(user.intraId, body);
  }

  @Get('mentorings')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentoringsLists(@Req() req): Promise<MentorMentoringInfo> {
    return await this.mentoringsService.getMentoringsLists(req);
  }

  @Patch('mentorings')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  async setMeetingAt(@Body() body: UpdateMentoringDto): Promise<MentoringLogs> {
    return await this.mentoringsService.setMeetingAt(body);
  }

  @Get(':intraId')
  @Roles('mentor', 'cadet')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentorDetails(@Param('intraId') intraId: string): Promise<Mentors> {
    return await this.mentorsService.getMentorDetails(intraId);
  }
}
