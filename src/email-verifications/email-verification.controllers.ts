import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { User } from 'src/v1/decorators/user.decorator';
import { RequestEmailDto } from 'src/v1/dto/email-verifications/email.dto';
import { JwtGuard } from 'src/v1/guards/jwt.guard';
import { RolesGuard } from 'src/v1/guards/role.guard';
import { JwtUser } from 'src/v1/interface/jwt-user.interface';
import { EmailVerificationService } from './email-verifications.service';

@Controller('email-verifications')
export class EmailVerificationController {
  constructor(private emailVerificationService: EmailVerificationService) {}
  @Get(':code')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  verifyEmail(
    @User() user: JwtUser,
    @Param('code') code: string,
  ): Promise<boolean> {
    return this.emailVerificationService.verifyMentorEmail(user.intraId, code);
  }

  @Post()
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
