import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/v1/decorators/user.decorator';
import { RequestEmailDto } from 'src/v1/dto/email-verifications/email.dto';
import { JwtGuard } from 'src/v1/guards/jwt.guard';
import { JwtUser } from 'src/v1/interface/jwt-user.interface';
import { EmailVerificationService } from './email-verifications.service';

@Controller('email-verifications')
export class EmailVerificationController {
  constructor(private emailVerificationService: EmailVerificationService) {}
  @Get(':intraId')
  async verifyEmail(
    @Param('intraId') intraId: string,
    @Query('code') code: string,
  ) {
    return await this.emailVerificationService.verifyMentorEmail(intraId, code);
  }

  @Post('mentors')
  @UseGuards(JwtGuard)
  requestChangingEmail(@User() user: JwtUser, @Body() req: RequestEmailDto) {
    return this.emailVerificationService.requestChangingEmail(
      user.intraId,
      req,
    );
  }
}
