import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}
  async sendEmail() {
    const response = await this.mailService.sendMail({
      to: 'cdex6531@gmail.com',
      from: '42polar-no-reply@gmail.com',
      subject: 'Test',
      template: 'send-email.hbs',
      context: {
        name: 'park',
        code: '1234',
      },
    });
    return response;
  }
}
