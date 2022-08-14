import { Controller, Get } from '@nestjs/common';
import { EmailService, MailType } from '../email/service/email.service';

@Controller()
export class EmailTestController {
  constructor(private emailService: EmailService) {}

  @Get()
  sendMessage() {
    const mentoringLogsId: string = 'a1001654-7247-4160-8839-acfc2d5e62ee';
    const mailType: MailType = MailType.Reservation;
    this.emailService.sendMessage(mentoringLogsId, mailType);
  }
}
