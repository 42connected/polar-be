import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { User } from 'src/v1/decorators/user.decorator';
import { RequestEmailDto } from 'src/v1/dto/email-verifications/email.dto';
import { JwtGuard } from 'src/v1/guards/jwt.guard';
import { RolesGuard } from 'src/v1/guards/role.guard';
import { JwtUser } from 'src/v1/interface/jwt-user.interface';
import { EmailVerificationService } from './email-verifications.service';

@ApiTags('email-verification API')
@Controller()
export class EmailVerificationController {
  constructor(private emailVerificationService: EmailVerificationService) {}
  @Post(':code')
  @ApiOperation({
    summary: 'verifyMentorEmail API',
    description: '멘토님에게 전송된 이메일 코드로 사용자 인증하는 api',
  })
  @ApiBearerAuth('access-token')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  verifyEmail(
    @User() user: JwtUser,
    @Param('code') code: string,
  ): Promise<boolean> {
    return this.emailVerificationService.verifyMentorEmail(user.intraId, code);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'requestChangingEmail API',
    description: '멘토님에게 인증 코드를 메일로 발송하는 api',
  })
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  requestChangingEmail(
    @User() user: JwtUser,
    @Body() req: RequestEmailDto,
  ): Promise<boolean> {
    return this.emailVerificationService.requestChangingEmail(
      user.intraId,
      req,
    );
  }
}
