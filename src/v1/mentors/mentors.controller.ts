import {
  Body,
  Controller,
  Get,
  Param,
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

@Controller()
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  @Get(':intraId')
  @Roles('mentor', 'cadet')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentorDetails(@Param('intraId') intraId: string): Promise<Mentors> {
    return await this.mentorsService.getMentorDetails(intraId);
  }

  @Post()
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  async postMentorDetails(@Req() req, @Body() body: CreateMentorDatailDto) {
    const jwtUser = req.user;
    return await this.mentorsService.postMentorDetails(jwtUser.intraId, body);
  }
}
