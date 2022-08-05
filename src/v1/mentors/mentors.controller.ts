import {
  Body,
  Controller,
  Get,
  Param,
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
import { SearchMentorsService } from './service/search-mentors.service';
import { MentorsList } from '../interface/mentors/mentors-list.interface';

@Controller()
export class MentorsController {
  constructor(
    private readonly mentorsService: MentorsService,
    private readonly searchMentorsService: SearchMentorsService,
  ) {}

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
