import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { BatchService } from '../batch/batch.service';
import { EmailService, MailType } from '../email/service/email.service';

@Controller()
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
  hello(@User() user: jwtUser) {
    console.log('guard test', user);
    return 'hi';
  }

  @Post()
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  UpdateCadet(@User() user: jwtUser, @Body() updateCadetDto: UpdateCadetDto) {
    return this.cadetsService.updateCadet(user.intraId, updateCadetDto);
  }

  @Get('mentorings')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentoringLogs(@User() user: jwtUser): Promise<CadetMentoringInfo> {
    return await this.cadetsService.getMentoringLogs(user.id);
  }

  @Post('join')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  join(@Body() body: JoinCadetDto, @User() user: jwtUser) {
    const { name } = body;
    this.cadetsService.saveName(user, name);
  }

  @Post('mentorings/apply/:mentorId')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  async create(
    @Param('mentorId') mentorId: string,
    @User() user: jwtUser,
    @Body() createApplyDto: CreateApplyDto,
  ): Promise<MentoringLogs> {
    let mentoringLogs;
    try {
      mentoringLogs = await this.applyService.create(
        user,
        mentorId,
        createApplyDto,
      );

      try {
        this.emailService.sendMessage(
          mentoringLogs.id,
          MailType.ReservationToMentor,
        );
      } catch {
        this.logger.warn('메일 전송 실패: ReservationToMentor');
      }

      try {
        const twoDaytoMillseconds = 172800000;
        this.batchSevice.cancelMeetingAuto(
          mentoringLogs.id,
          twoDaytoMillseconds,
        );
      } catch {
        this.logger.warn('메일 전송 실패: autoCancel after 48hours');
      }

      return mentoringLogs;
    } catch (err) {
      throw err;
    }
  }
}
