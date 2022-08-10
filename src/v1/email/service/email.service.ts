import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable } from '@nestjs/common';
import {
  ApproveMessageDto,
  CancelMessageDto,
  ReservationMessageDto,
} from 'src/v1/dto/email/send-message.dto';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}

  ReservationTimeToString(
    reservationTime: Date,
    mentoringTime: number,
  ): string {
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
    return reservationTimeToString;
  }

  async sendReservationMessageToMentor(
    reservationMessageDto: ReservationMessageDto,
  ): Promise<boolean> {
    const {
      mentorEmail,
      cadetSlackId,
      reservationTime,
      mentoringTime,
      isCommon,
    } = reservationMessageDto;
    let commonType: string;
    if (isCommon) {
      commonType = '공통과정';
    } else {
      commonType = '심화과정';
    }
    const reservationTimeToString = this.ReservationTimeToString(
      reservationTime,
      mentoringTime,
    );
    try {
      await this.mailService.sendMail({
        to: mentorEmail,
        subject: 'New mentoring request',
        template: 'ReservationMessage.hbs',
        context: {
          cadetSlackId: cadetSlackId,
          intraProfileUrl: 'https://profile.intra.42.fr/users/' + cadetSlackId,
          commonType: commonType,
          reservationTimeToString: reservationTimeToString,
        },
      });
      return true;
    } catch (error) {
      throw new ConflictException('이메일 전송에 실패했습니다');
    }
  }

  async sendApproveMessageToCadet(
    approveMessageDto: ApproveMessageDto,
  ): Promise<boolean> {
    const { mentorSlackId, cadetEmail, reservationTime, mentoringTime } =
      approveMessageDto;
    const reservationTimeToString = this.ReservationTimeToString(
      reservationTime,
      mentoringTime,
    );
    try {
      await this.mailService.sendMail({
        to: cadetEmail,
        subject: 'New mentoring request',
        template: 'ApproveMessage.hbs',
        context: {
          mentorSlackId: mentorSlackId,
          reservationTimeToString: reservationTimeToString,
        },
      });
      return true;
    } catch (error) {
      throw new ConflictException('이메일 전송에 실패했습니다');
    }
  }

  async sendCancelMessageToCadet(
    cancelMessageDto: CancelMessageDto,
  ): Promise<boolean> {
    const { mentorSlackId, cadetEmail } = cancelMessageDto;
    try {
      await this.mailService.sendMail({
        to: cadetEmail,
        subject: 'New mentoring request',
        template: 'CancelMessage.hbs',
        context: {
          mentorSlackId: mentorSlackId,
        },
      });
      return true;
    } catch (error) {
      throw new ConflictException('이메일 전송에 실패했습니다');
    }
  }
}
