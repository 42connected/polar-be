import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
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
import { MentoringInfoDto } from '../dto/cadets/mentoring-info.dto';
import { Response } from 'express';

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

  @Post()
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update cadet details',
    description: '카뎃 정보 수정하기',
  })
  UpdateCadet(
    @User() user: JwtUser,
    @Body() updateCadetDto: UpdateCadetDto,
  ): Promise<void> {
    return this.cadetsService.updateCadet(user.intraId, updateCadetDto);
  }

  @Get('mentorings')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: "Get cadet's mentoring logs",
    description: '카뎃이 신청했던 멘토링 로그 정보를 반환합니다.',
  })
  @ApiCreatedResponse({
    description: '멘토링 로그 정보',
    type: MentoringInfoDto,
  })
  async getMentoringLogs(@User() user: JwtUser): Promise<MentoringInfoDto> {
    return await this.cadetsService.getMentoringLogs(user.intraId);
  }

  @Patch('join')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Post join cadet',
    description: '카뎃의 필수 정보를 저장합니다.',
  })
  join(@Body() body: JoinCadetDto, @User() user: JwtUser): Promise<void> {
    const { name } = body;
    return this.cadetsService.saveName(user.intraId, name);
  }

  @Post('mentorings/apply/:mentorIntraId')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Apply mentoring',
    description: '해당 멘토에게 멘토링을 신청합니다.',
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
