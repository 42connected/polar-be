import { Controller, Get, Param, Query } from '@nestjs/common';
import { MentorsService } from './service/mentors.service';
import { SearchMentorsService } from './service/search-mentors.service';
import { MentorsList } from '../dto/mentors/mentors.dto';

@Controller()
export class MentorsController {
  constructor(
    private readonly mentorsService: MentorsService,
    private readonly searchMentorsService: SearchMentorsService,
  ) {}

  @Get('/:mentorId')
  async getMentorDetails(@Param('mentorId') mentorId: string) {
    return await this.mentorsService.getMentorDetails(mentorId);
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
