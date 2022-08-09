import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable } from '@nestjs/common';
import { ReservationMessageDto } from 'src/v1/dto/slack/send-message.dto';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}
  async sendReservationMessageToMentor(
    reservationMessageDto: ReservationMessageDto,
  ) {
    const {
      mentorEmail,
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
    try {
      const response = await this.mailService.sendMail({
        to: mentorEmail,
        from: '42polar-no-reply@gmail.com',
        subject: 'New mentoring request',
        template: 'ReservationMessage.hbs',
        context: {
          cadetSlackId: cadetSlackId,
          intraProfileUrl: 'https://profile.intra.42.fr/users/' + cadetSlackId,
          commonType: commonType,
          reservationTimeToString: reservationTimeToString,
        },
      });
      return response;
    } catch (error) {
      throw new ConflictException('슬랙 메세지 전송에 실패했습니다');
    }
  }
}
