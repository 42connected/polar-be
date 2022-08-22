import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { CadetMentoringInfo } from '../dto/cadet-mentoring-info.interface';
import { CreateApplyDto } from '../dto/cadets/create-apply.dto';
import { JwtUser } from '../interface/jwt-user.interface';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { CadetsService } from './service/cadets.service';
import { ApplyService } from './apply/apply.service';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { JoinCadetDto } from '../dto/cadets/join-cadet-dto';
import { UpdateCadetDto } from '../dto/cadets/update-cadet.dto';
import { BatchService } from '../batch/batch.service';
import { EmailService, MailType } from '../email/service/email.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller()
@ApiTags('cadets API')
export class CadetsController {
  private readonly logger = new Logger(CadetsController.name);

  constructor(
    private cadetsService: CadetsService,
    private applyService: ApplyService,
    private batchSevice: BatchService,
    private emailService: EmailService,
  ) {}

  @Get('test')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'cadet login test API',
    description: '카뎃 로그인 정보 가져오기 test페이지',
  })
  @ApiCreatedResponse({
    description: '카뎃 로그인 정보 받아오기 성공',
    type: String,
  })
  hello(@User() user: JwtUser) {
    console.log('guard test', user);
    return 'hi';
  }

  @Post()
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'updateCadet API',
    description: '카뎃 로그인 정보 생성하기',
  })
  @ApiCreatedResponse({
    description: '카뎃 로그인 정보 생성 성공',
    type: Promise<string>,
  })
  UpdateCadet(@User() user: JwtUser, @Body() updateCadetDto: UpdateCadetDto) {
    return this.cadetsService.updateCadet(user.intraId, updateCadetDto);
  }

  @Get('mentorings')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'getMentoringLogs for cardet API',
    description: '카뎃이 신청한 멘토링로그 정보 가져오기.',
  })
  @ApiCreatedResponse({
    description: '멘토링로그 정보 받아오기 성공',
    type: Promise<CadetMentoringInfo>,
  })
  async getMentoringLogs(@User() user: JwtUser): Promise<CadetMentoringInfo> {
    return await this.cadetsService.getMentoringLogs(user.id);
  }

  @Patch('join')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'cadet join post API',
    description: '카뎃 join api',
  })
  @ApiCreatedResponse({
    description: '카뎃 join 성공',
    type: Promise<void>,
  })
  join(@Body() body: JoinCadetDto, @User() user: JwtUser) {
    const { name } = body;
    return this.cadetsService.saveName('asdfasdf', name);
  }

  @Post('mentorings/apply/:mentorIntraId')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'cadet mentoring apply API',
    description: '멘토링 신청 api',
  })
  @ApiCreatedResponse({
    description: '멘토링 신청 정보 생성 성공',
    type: Promise<boolean>,
  })
  async create(
    @Param('mentorIntraId') mentorId: string,
    @User() user: JwtUser,
    @Body() createApplyDto: CreateApplyDto,
  ): Promise<boolean> {
    let mentoringLogs: MentoringLogs;
    try {
      mentoringLogs = await this.applyService.create(
        user,
        mentorId,
        createApplyDto,
      );

      try {
        this.emailService.sendMessage(mentoringLogs.id, MailType.Reservation);
      } catch {
        this.logger.warn('메일 전송 실패: ReservationToMentor');
      }

      try {
        const twoDaytoMillseconds = 172800000;
        this.batchSevice.addAutoCancel(mentoringLogs.id, twoDaytoMillseconds);
      } catch {
        this.logger.warn('자동 취소 등록 실패: autoCancel after 48hours');
      }

      return true;
    } catch (err) {
      throw err;
    }
  }
}
