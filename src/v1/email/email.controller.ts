import { Controller, Get } from '@nestjs/common';
import { EmailService } from './service/email.service';

@Controller()
export class EmailController {
  constructor(private emailService: EmailService) {}
  @Get()
  sendEmail() {
    const response = this.emailService.sendEmail();
    return response;
  }
}
