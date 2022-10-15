import {
  Body,
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  Patch,
  BadRequestException,
  Inject,
  CACHE_MANAGER,
  CacheTTL,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { JwtUser } from '../interface/jwt-user.interface';
import { UpdateMentorDatailDto } from '../dto/mentors/mentor-detail.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { MentorsService } from './service/mentors.service';
import { MentoringsService } from './service/mentorings.service';
import { JoinMentorDto } from '../dto/mentors/join-mentor-dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from '../dto/pagination.dto';
import { MentoringInfoDto } from '../dto/mentors/mentoring-info.dto';
import { LogPaginationDto } from '../dto/mentoring-logs/log-pagination.dto';
import { MentorDto } from '../dto/mentors/mentor.dto';
import { KeywordsService } from '../categories/service/keywords.service';
import { Cache } from 'cache-manager';

@Controller()
@ApiTags('mentors API')
export class MentorsController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mentorsService: MentorsService,
    private readonly mentoringsService: MentoringsService,
    private readonly keywordsService: KeywordsService,
  ) {}

  @Get('mentorings')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get mentoring logs',
    description: '로그인된 멘토의 멘토링 로그와 인트라 아이디를 반환합니다.',
  })
  @ApiQuery({
    name: 'take',
    type: Number,
    description: '한 페이지에 띄울 멘토링 로그 정보의 수',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: '선택한 페이지(1페이지, 2페이지, ...)',
  })
  @ApiCreatedResponse({
    description: '멘토 인트라 아이디, 멘토링 로그',
    type: MentoringInfoDto,
  })
  async getMentoringsLists(
    @User() user: JwtUser,
    @Query() pagination: PaginationDto,
  ): Promise<MentoringInfoDto> {
    return await this.mentoringsService.getMentoringsLists(
      user.intraId,
      pagination,
    );
  }

  @Get('simplelogs/:mentorIntraId')
  @CacheTTL(60)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get mentoring simple log',
    description: '멘토링 로그 pagination',
  })
  @ApiQuery({
    name: 'take',
    type: Number,
    description: '한 페이지에 띄울 멘토링 로그 정보의 수',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: '선택한 페이지(1페이지, 2페이지, ...)',
  })
  @ApiCreatedResponse({
    description: '멘토링 로그 정보 심플 버전의 배열',
    type: LogPaginationDto,
  })
  async getSimpleLogs(
    @Param('mentorIntraId') mentorIntraId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<LogPaginationDto> {
    const result = await this.mentoringsService.getSimpleLogsPagination(
      mentorIntraId,
      paginationDto,
    );
    return { logs: result[0], total: result[1] };
  }

  @Patch('join')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Post join mentor',
    description:
      '멘토 필수정보(이름, 이메일, 슬랙아이디, 가능시간, 멘토링 가능 상태, 회사, 직급)를 받아서 저장합니다.',
  })
  async join(
    @Body() body: JoinMentorDto,
    @User() user: JwtUser,
  ): Promise<boolean> {
    await this.mentorsService.updateMentorDetails(user.intraId, body);
    await this.cacheManager.del(`/api/v1/mentors/${user.intraId}`);
    return true;
  }

  @Get('/:intraId/keywords')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get mentor keywords',
    description: '해당 멘토의 키워드를 반환합니다.',
  })
  @ApiCreatedResponse({
    description: '멘토 키워드',
    type: String,
    isArray: true,
  })
  async getKeywords(@Param('intraId') intraId: string): Promise<string[]> {
    return this.keywordsService.getMentorKeywordsTunned(intraId);
  }

  @Patch(':intraId/keywords')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update mentor details',
    description: '멘토 키워드를 수정합니다.',
  })
  async updateMentorKeywords(
    @User() user: JwtUser,
    @Param('intraId') intraId: string,
    @Body('keywords') keywords: string[],
  ): Promise<boolean> {
    if (user.intraId !== intraId) {
      throw new BadRequestException('수정 권한이 없습니다.');
    }
    const mentor = await this.mentorsService.findByIntra(intraId);
    await this.keywordsService.deleteAllKeywords(mentor);
    const keywordIds = await this.keywordsService.getKeywordIds(keywords);
    keywordIds.forEach(async id => {
      await this.keywordsService.saveMentorKeyword(mentor, id);
    });
    const cacheKey = `/api/v1/mentors/${intraId}/keywords`;
    await this.cacheManager.del(cacheKey);
    return true;
  }

  @Patch(':intraId')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update mentor details',
    description: '멘토 정보를 수정합니다.',
  })
  async updateMentorDetails(
    @User() user: JwtUser,
    @Param('intraId') intraId: string,
    @Body() body: UpdateMentorDatailDto,
  ): Promise<boolean> {
    if (user.intraId !== intraId) {
      throw new BadRequestException('수정 권한이 없습니다.');
    }
    await this.mentorsService.updateMentorDetails(user.intraId, body);
    const cacheKey = `/api/v1/mentors/${user.intraId}`;
    await this.cacheManager.del(cacheKey);
    return true;
  }

  @Get(':intraId')
  @UseInterceptors(CacheInterceptor)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get mentor details',
    description: '멘토에 대한 모든 정보를 반환합니다.',
  })
  @ApiCreatedResponse({
    description: '멘토 정보',
    type: MentorDto,
  })
  async getMentorDetails(
    @Param('intraId') intraId: string,
  ): Promise<MentorDto> {
    return this.mentorsService.findMentorByIntraId(intraId);
  }
}
