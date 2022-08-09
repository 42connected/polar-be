import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ReservationMessageDto } from 'src/v1/dto/slack/send-message.dto';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}
  async sendEmail(reservationMessageDto: ReservationMessageDto) {
    const {
      mentorSlackId,
      cadetSlackId,
      reservationTime,
      mentoringTime,
      isCommon,
    } = reservationMessageDto;
    const reservationTimeTmp: string = reservationTime.toDateString();
    const tmp = reservationTimeTmp.split(' ');
    const reservationTimeToString =
      tmp[1] +
      ' ' +
      tmp[2] +
      ', ' +
      tmp[3] +
      ' ' +
      reservationTime.getHours() +
      ':' +
      reservationTime.getMinutes() +
      ' for ' +
      mentoringTime +
      ' hours';
    let commonType: string;
    if (isCommon) {
      commonType = '공통과정';
    } else {
      commonType = '심화과정';
    }
		try{
    const response = await this.mailService.sendMail({
      to: 'cdex6531@gmail.com',
      from: '42polar-no-reply@gmail.com',
      subject: 'Test',
      template: 'ReservationMessage.hbs',
      context: {
        username: 'park',
        code: '1234',
      },
    });
	} catch {}
    return response;
  }
}
