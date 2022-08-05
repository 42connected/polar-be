import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { jwtUser } from '../dto/jwt-user.interface';
import { UpdateMentorDatailDto } from '../dto/mentors/mentor-detail.dto';
import { Mentors } from '../entities/mentors.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { MentorsService } from './service/mentors.service';
import { MentoringsService } from './service/mentorings.service';
import { UpdateMentoringDto } from '../dto/mentors/update-mentoring.dto';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { MentorMentoringInfo } from '../interface/mentors/mentor-mentoring-info.interface';
import { SearchMentorsService } from './service/search-mentors.service';
import { MentorsList } from '../interface/mentors/mentors-list.interface';

@Controller()
export class MentorsController {
  constructor(
    private readonly mentorsService: MentorsService,
    private readonly mentoringsService: MentoringsService,
    private readonly searchMentorsService: SearchMentorsService,
  ) {}

  @Get('mentorings')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentoringsLists(
    @User() user: jwtUser,
  ): Promise<MentorMentoringInfo> {
    return await this.mentoringsService.getMentoringsLists(user);
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

  @Post()
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  async updateMentorDetails(
    @User() user: jwtUser,
    @Body() body: UpdateMentorDatailDto,
  ) {
    return await this.mentorsService.updateMentorDetails(user.intraId, body);
  }
  
  @Get(':intraId')
  @Roles('mentor', 'cadet')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentorDetails(@Param('intraId') intraId: string): Promise<Mentors> {
    return await this.mentorsService.getMentorDetails(intraId);

  @Get()
  getMentors(
    @Query('keywordId') keywordId?: string,
    @Query('searchText') searchText?: string,
  ): Promise<MentorsList> {
    if (keywordId)
      return this.searchMentorsService.getMentorListByKeyword(
        keywordId,
        searchText,
      );
    if (searchText)
      return this.searchMentorsService.getMentorListBySearch(searchText);
  }
}
