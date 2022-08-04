import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { jwtUser } from '../dto/jwt-user.interface';
import { UpdateMentorDatailDto } from '../dto/mentors/mentor-detail.dto';
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
  async updateMentorDetails(
    @User() user: jwtUser,
    @Body() body: UpdateMentorDatailDto,
  ) {
    console.log(body);
    return await this.mentorsService.updateMentorDetails(user.intraId, body);
  }
}
