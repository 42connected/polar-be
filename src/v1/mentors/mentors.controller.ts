import { Body, Controller, Get, Param, Post } from '@nestjs/common';
// import {
//   EditMentorDetailsDto,
//   ReturnEditMentorDetails,
//   ReturnMentorDetails,
// } from './interface/mentors.interface';
import { MentorsService } from './service/mentors.service';

@Controller()
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  @Get(':intraId')
  async getMentorDetails(
    @Param('intraId') intraId: string,
  ){
    return await this.mentorsService.getMentorDetails(intraId);
  }

  // FIXME: [임시] 멘토 ID param으로 받음 -> JWT
  @Post(':intraId')
  async postMentorDetails(
    @Param('intraId') intraId: string,
    @Body() req
  ) {
    return await this.mentorsService.postMentorDetails(intraId, req);
  }
}
