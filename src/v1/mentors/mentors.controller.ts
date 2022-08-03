import { Controller, Get, Param } from '@nestjs/common';
import { MentorsService } from './service/mentors.service';

@Controller()
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  @Get()
  async getMentorDetails(@Param('mentorId') mentorId: string) {
    return await this.mentorsService.getMentorDetails(mentorId);
  }
}
