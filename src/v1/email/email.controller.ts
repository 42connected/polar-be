import { Controller, Get } from '@nestjs/common';
import { ReservationMessageDto } from '../dto/slack/send-message.dto';
import { EmailService } from './service/email.service';

@Controller()
export class EmailController {
  constructor(private emailService: EmailService) {}
  @Get()
  sendEmail() {
    const reservationdMessageDto: ReservationMessageDto = {
      mentorEmail: 'cdex6531@gmail.com',
      cadetSlackId: 'jeounpar',
      reservationTime: new Date('2022-08-08 13:30'),
      mentoringTime: 1,
      isCommon: true,
    };
    const response = this.emailService.sendReservationMessageToMentor(
      reservationdMessageDto,
    );
    return response;
  }
}
