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
import { JwtUser } from '../interface/jwt-user.interface';
import { UpdateMentorDatailDto } from '../dto/mentors/mentor-detail.dto';
import { Mentors } from '../entities/mentors.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { MentorsService } from './service/mentors.service';
import { MentoringsService } from './service/mentorings.service';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { MentorMentoringInfo } from '../interface/mentors/mentor-mentoring-info.interface';
import { JoinMentorDto } from '../dto/mentors/join-mentor-dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from '../dto/pagination.dto';

@Controller()
@ApiTags('mentors API')
export class MentorsController {
  constructor(
    private readonly mentorsService: MentorsService,
    private readonly mentoringsService: MentoringsService,
  ) {}

  @Get('mentorings')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'getMentoringsLists API',
    description: '멘토링 리스트 가져오는 api',
  })
  @ApiCreatedResponse({
    description: '멘토링 리스트 가져오기 성공',
    type: Promise<MentorMentoringInfo>,
  })
  async getMentoringsLists(
    @User() user: JwtUser,
  ): Promise<MentorMentoringInfo> {
    return await this.mentoringsService.getMentoringsLists(user);
  }

  @Get('simplelogs/:mentorIntraId')
  @ApiOperation({
    summary: 'getSimpleLogs API',
    description: '멘토링 로그 pagination',
  })
  async getSimpleLogs(
    @Param('mentorIntraId') mentorIntraId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<[MentoringLogs[], number]> {
    return await this.mentoringsService.getSimpleLogsPagination(
      mentorIntraId,
      paginationDto,
    );
  }

  @Post()
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'updateMentorDetails post API',
    description: '멘토 상세정보입력 api',
  })
  @ApiCreatedResponse({
    description:
      '멘토 상세정보(introduction, isActive, markdownContent) 생성 성공',
    type: Promise<string>,
  })
  async updateMentorDetails(
    @User() user: JwtUser,
    @Body() body: UpdateMentorDatailDto,
  ) {
    return await this.mentorsService.updateMentorDetails(user.intraId, body);
  }

  @Post('join')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'mentor join post API',
    description: '멘토 기본정보(name, availableTime, isActive) 입력 api',
  })
  @ApiCreatedResponse({
    description: '멘토 기본정보 생성 성공',
    type: Promise<void>,
  })
  join(@Body() body: JoinMentorDto, @User() user: JwtUser) {
    this.mentorsService.validateAvailableTime(body.availableTime);
    this.mentorsService.saveInfos(user.intraId, body);
  }

  @Get(':intraId')
  @Roles('mentor', 'cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'getMentorDetails API',
    description: '멘토 세부정보(comments, mentoringLogs) 받아오는 api',
  })
  @ApiCreatedResponse({
    description: '멘토 세부정보 받아오기 성공',
    type: Promise<Mentors>,
  })
  async getMentorDetails(@Param('intraId') intraId: string): Promise<Mentors> {
    return await this.mentorsService.findMentorByIntraId(intraId);
  }
}
