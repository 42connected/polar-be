import { Controller, Get } from '@nestjs/common';
import { ReservationMessageDto } from '../dto/email/send-message.dto';
import { EmailService } from '../email/service/email.service';
import { BatchService } from './batch.service';

@Controller()
export class BatchController {
  constructor(
    private batchService: BatchService,
    private emailService: EmailService,
  ) {}

  @Get()
  testCancelMail() {
    this.batchService.cancelMeetingAuto(
      '539aef9d-a5ba-4a2e-b2f9-115ed1f74da2',
      10000,
    );
  }

  @Get('/test')
  sendReservationMessageToMentor() {
    const reservationMessageDto: ReservationMessageDto = {
      mentorEmail: 'cdex6531@gmail.com',
      cadetSlackId: 'jeounpar',
      reservationTime1: [
        new Date('2022-01-01 10:00'),
        new Date('2022-01-01 11:30'),
      ],
      reservationTime2: [
        new Date('2022-01-01 10:00'),
        new Date('2022-01-01 11:30'),
      ],
      isCommon: true,
    };
    this.emailService.sendReservationMessageToMentor(reservationMessageDto);
  }
}
