import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { ApproveMentoringDto } from '../dto/mentoring-logs/approve-mentoring.dto';
import { EmailService, MailType } from '../email/service/email.service';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { JwtUser } from '../interface/jwt-user.interface';
import { MentoringLogsService } from './service/mentoring-logs.service';

@Controller()
export class MentoringLogsController {
  constructor(
    private mentoringLogsService: MentoringLogsService,
    private emailService: EmailService,
  ) {}

  @Patch('approve')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Approve Mentoring Request API',
    description: '멘토링 요청 수락 API',
  })
  async approveMentoring(
    @User() user: JwtUser,
    @Body() body: ApproveMentoringDto,
  ) {
    const log = await this.mentoringLogsService.approve(
      body.mentoringLogId,
      user.intraId,
    );
    this.emailService.sendMessage(log.id, MailType.Approve);
  }
}
