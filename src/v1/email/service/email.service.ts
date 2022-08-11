import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable } from '@nestjs/common';
import {
  ApproveMessageDto,
  CancelMessageDto,
  ReservationMessageDto,
} from 'src/v1/dto/email/send-message.dto';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}

  ReservationTimeToString(
    reservationTime: Date,
    mentoringTime: number,
  ): string {
    const reservationTimeTmp: string = reservationTime.toDateString();
    const tmp: string[] = reservationTimeTmp.split(' ');
    let mentoringMinute: string;
    if (reservationTime.getMinutes() < 10)
      mentoringMinute = reservationTime.getMinutes() + '0';
    else mentoringMinute = reservationTime.getMinutes().toString();
    const reservationTimeToString =
      tmp[1] +
      ' ' +
      tmp[2] +
      ', ' +
      tmp[3] +
      ' ' +
      reservationTime.getHours() +
      ':' +
      mentoringMinute +
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
      reservationTime1,
      reservationTime2,
      reservationTime3,
      isCommon,
    } = reservationMessageDto;
    let commonType: string;
    if (isCommon) {
      commonType = '공통과정';
    } else {
      commonType = '심화과정';
    }
    const requestTime1: string = this.ReservationTimeToString(
      reservationTime1[0],
      (reservationTime1[1].getTime() - reservationTime1[0].getTime()) / 3600000,
    );

    let requestTime2: string;
    if (reservationTime2) {
      requestTime2 = this.ReservationTimeToString(
        reservationTime2[0],
        (reservationTime2[1].getTime() - reservationTime2[0].getTime()) /
          3600000,
      );
    } else requestTime2 = 'Empty';

    let requestTime3: string;
    if (reservationTime3) {
      requestTime3 = this.ReservationTimeToString(
        reservationTime3[0],
        (reservationTime3[1].getTime() - reservationTime3[0].getTime()) /
          3600000,
      );
    } else requestTime3 = 'Empty';
    try {
      await this.mailService.sendMail({
        to: mentorEmail,
        subject: 'New mentoring request',
        template: 'ReservationMessage.hbs',
        context: {
          cadetSlackId: cadetSlackId,
          intraProfileUrl: 'https://profile.intra.42.fr/users/' + cadetSlackId,
          commonType: commonType,
          requestTime1: requestTime1,
          requestTime2: requestTime2,
          requestTime3: requestTime3,
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

  async getCancelMessageDto(mentoringLogDb: MentoringLogs) {
    //
  }
}
