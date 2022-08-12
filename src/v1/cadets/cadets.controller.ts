import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { CadetMentoringInfo } from '../dto/cadet-mentoring-info.interface';
import { CreateApplyDto } from '../dto/cadets/create-apply.dto';
import { jwtUser } from '../interface/jwt-user.interface';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { CadetsService } from './service/cadets.service';
import { ApplyService } from './apply/apply.service';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { JoinCadetDto } from '../dto/cadets/join-cadet-dto';
import { UpdateCadetDto } from '../dto/cadets/update-cadet.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('cadets API')
export class CadetsController {
  constructor(
    private cadetsService: CadetsService,
    private applyService: ApplyService,
  ) {}

  @Get('test')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiOperation({
    summary: 'cadet login test API',
    description: '카뎃 로그인 정보 가져오기 test페이지',
  })
  @ApiCreatedResponse({
    description: '카뎃 로그인 정보 받아오기 성공',
    type: String,
  })
  hello(@User() user: jwtUser) {
    console.log('guard test', user);
    return 'hi';
  }

  @Post()
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiOperation({
    summary: 'updateCadet API',
    description: '카뎃 로그인 정보 생성하기',
  })
  @ApiCreatedResponse({
    description: '카뎃 로그인 정보 생성 성공',
    type: Promise<string>,
  })
  UpdateCadet(@User() user: jwtUser, @Body() updateCadetDto: UpdateCadetDto) {
    return this.cadetsService.updateCadet(user.intraId, updateCadetDto);
  }

  @Get('mentorings')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiOperation({
    summary: 'getMentoringLogs for cardet API',
    description: '카뎃이 신청한 멘토링로그 정보 가져오기.',
  })
  @ApiCreatedResponse({
    description: '멘토링로그 정보 받아오기 성공',
    type: Promise<CadetMentoringInfo>,
  })
  async getMentoringLogs(@User() user: jwtUser): Promise<CadetMentoringInfo> {
    return await this.cadetsService.getMentoringLogs(user.id);
  }

  @Post('join')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiOperation({
    summary: 'cadet join post API',
    description: '카뎃 join api',
  })
  @ApiCreatedResponse({
    description: '카뎃 join 성공',
    type: Promise<void>,
  })
  join(@Body() body: JoinCadetDto, @User() user: jwtUser) {
    const { name } = body;
    this.cadetsService.saveName(user, name);
  }

  @Post('mentorings/apply/:mentorIntraId')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiOperation({
    summary: 'cadet mentoring apply API',
    description: '멘토링 신청 api',
  })
  @ApiCreatedResponse({
    description: '멘토링 신청 정보 생성 성공',
    type: Promise<boolean>,
  })
  create(
    @Param('mentorIntraId') mentorIntraId: string,
    @User() user: jwtUser,
    @Body() createApplyDto: CreateApplyDto,
  ): Promise<boolean> {
    return this.applyService.create(user, mentorIntraId, createApplyDto);
  }
}
