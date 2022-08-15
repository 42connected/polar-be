import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { ApproveMessage } from 'src/v1/interface/email/approve-message.interface';
import { CancelMessage } from 'src/v1/interface/email/cancel-message.interface';
import { ReservationMessage } from 'src/v1/interface/email/reservation-message.interface';
import { Repository } from 'typeorm';

export enum MailType {
  Reservation = 1,
  Approve = 2,
  Cancel = 3,
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private mailService: MailerService,
    @InjectRepository(MentoringLogs)
    private mentoringsLogsRepository: Repository<MentoringLogs>,
  ) {}

  async sendMessage(
    mentoringLogsId: string,
    mailType: MailType,
  ): Promise<boolean> {
    let messageDto: ReservationMessage | ApproveMessage | CancelMessage = null;
    const mailTypeString: string = this.stringifyMailType(mailType);
    try {
      messageDto = await this.getMessageDto(mentoringLogsId, mailType);
    } catch (err) {
      this.logger.warn(`${mailTypeString} 이메일 전송 실패 DB Error : ${err}`);
      return false;
    }

    if (messageDto === null) {
      this.logger.warn(
        `해당하는 MailTyped으로 MessageDto를 만들 수 없습니다 : Check your MailType`,
      );
      return false;
    }

    const messageForm: ISendMailOptions = await this.getMailMessageForm(
      messageDto,
      mailType,
    );

    if (messageForm === null) {
      this.logger.warn(
        `해당하는 MailMessageForm이 없습니다 : Check your MailType`,
      );
      return false;
    }

    let mailSendState = false;
    for (let i = 0; i < 2 && mailSendState === false; i++) {
      try {
        mailSendState = await this.sendMailMessage(
          messageDto.mentorEmail,
          messageDto.cadetEmail,
          messageForm,
        );
      } catch (err) {
        this.logger.warn(
          `${mailTypeString} 이메일 전송 실패 Mail Error : ${err}`,
        );
      }
    }

    if (mailSendState === true) {
      this.logger.log(`${mailTypeString} 이메일 전송 성공`);
    } else {
      return false;
    }
  }

  private stringifyMailType(mailType: MailType): string {
    switch (mailType) {
      case MailType.Reservation: {
        return '예약';
      }
      case MailType.Approve: {
        return '승인';
      }
      case MailType.Cancel: {
        return '취소';
      }
      default: {
        return 'undefind mailtype';
      }
    }
  }

  private async sendMailMessage(
    mentorEmail: string,
    cadetEmail: string,
    messageForm: ISendMailOptions,
  ): Promise<boolean> {
    try {
      messageForm.to = cadetEmail;
      await this.mailService.sendMail(messageForm);
      messageForm.to = mentorEmail;
      await this.mailService.sendMail(messageForm);
      return true;
    } catch (error) {
      throw new ConflictException('이메일 전송에 실패했습니다');
    }
  }

  private async getMailMessageForm(
    messageDto: any,
    mailType: MailType,
  ): Promise<ISendMailOptions> {
    switch (mailType) {
      case MailType.Reservation: {
        const commonType: string = messageDto.isCommon
          ? '공통과정'
          : '심화과정';
        const requestTime1: string = await this.reserveTimeToString(
          messageDto.reservationTime1[0],
          this.getMentoringHours(
            messageDto.reservationTime1[0],
            messageDto.reservationTime1[1],
          ),
        );
        const requestTime2: string = await this.reserveTimeToString(
          messageDto.reservationTime2[0],
          this.getMentoringHours(
            messageDto.reservationTime2[0],
            messageDto.reservationTime2[1],
          ),
        );
        const requestTime3: string = await this.reserveTimeToString(
          messageDto.reservationTime3[0],
          this.getMentoringHours(
            messageDto.reservationTime3[0],
            messageDto.reservationTime3[1],
          ),
        );
        /* reservation2, 3의 멘토링 시간이 0일 때 '' 전송 */
        return {
          subject: 'New mentoring request',
          template: 'ReservationMessage.hbs',
          context: {
            mentorSlackId: messageDto.mentorSlackId,
            cadetSlackId: messageDto.cadetSlackId,
            intraProfileUrl:
              'https://profile.intra.42.fr/users/' + messageDto.cadetSlackId,
            commonType: commonType,
            requestTime1: requestTime1,
            requestTime2: requestTime2,
            requestTime3: requestTime3,
          },
        };
      }
      case MailType.Approve: {
        console.log(messageDto.meetingAt.length);
        const reservationTimeToString = await this.reserveTimeToString(
          messageDto.meetingAt[0],
          this.getMentoringHours(
            messageDto.meetingAt[0],
            messageDto.meetingAt[1],
          ),
        );
        /* meetingAt의 멘토링 시간이 0일 때 '' 전송 */
        return {
          subject: 'Mentoring Approved',
          template: 'ApproveMessage.hbs',
          context: {
            cadetSlackId: messageDto.cadetSlackId,
            mentorSlackId: messageDto.mentorSlackId,
            reservationTimeToString: reservationTimeToString,
          },
        };
      }
      case MailType.Cancel: {
        return {
          subject: 'Mentoring canceled',
          template: 'CancelMessage.hbs',
          context: {
            cadetSlackId: messageDto.cadetSlackId,
            mentorSlackId: messageDto.mentorSlackId,
            rejectMessage: messageDto.rejectMessage,
          },
        };
      }
      default: {
        return null;
      }
    }
  }

  private async getMessageDto(
    mentoringsLogsId: string,
    mailType: MailType,
  ): Promise<ReservationMessage | ApproveMessage | CancelMessage> {
    let mentoringsLogsInfoDb: MentoringLogs = null;
    try {
      mentoringsLogsInfoDb = await this.getMentoringLogsAllRealtions(
        mentoringsLogsId,
      );
    } catch (err) {
      throw err;
    }
    if (!mentoringsLogsInfoDb.mentors) {
      throw new NotFoundException('mentoringLogs 테이블에 mentors이 없습니다');
    }
    if (!mentoringsLogsInfoDb.cadets) {
      throw new NotFoundException('mentoringLogs 테이블에 cadets가 없습니다');
    }
    if (!mentoringsLogsInfoDb.mentors.email) {
      throw new NotFoundException('mentor email을 찾을 수 없습니다');
    }
    if (!mentoringsLogsInfoDb.cadets.email) {
      throw new NotFoundException('cadets email을 찾을 수 없습니다');
    }

    this.vaildateDbData(mentoringsLogsInfoDb, mailType);

    switch (mailType) {
      case MailType.Reservation: {
        const reservationMessage: ReservationMessage = {
          mentorEmail: mentoringsLogsInfoDb.mentors.email,
          mentorSlackId: mentoringsLogsInfoDb.cadets.intraId,
          cadetEmail: mentoringsLogsInfoDb.cadets.email,
          cadetSlackId: mentoringsLogsInfoDb.cadets.intraId,
          reservationTime1: mentoringsLogsInfoDb.requestTime1,
          reservationTime2: mentoringsLogsInfoDb.requestTime2,
          reservationTime3: mentoringsLogsInfoDb.requestTime3,
          isCommon: mentoringsLogsInfoDb.cadets.isCommon,
        };
        return reservationMessage;
      }
      case MailType.Approve: {
        const approveMessage: ApproveMessage = {
          mentorEmail: mentoringsLogsInfoDb.mentors.email,
          mentorSlackId: mentoringsLogsInfoDb.mentors.intraId,
          cadetEmail: mentoringsLogsInfoDb.cadets.email,
          cadetSlackId: mentoringsLogsInfoDb.cadets.intraId,
          meetingAt: mentoringsLogsInfoDb.meetingAt,
        };
        return approveMessage;
      }
      case MailType.Cancel: {
        const cancelMessage: CancelMessage = {
          mentorEmail: mentoringsLogsInfoDb.mentors.email,
          mentorSlackId: mentoringsLogsInfoDb.mentors.intraId,
          cadetEmail: mentoringsLogsInfoDb.cadets.email,
          cadetSlackId: mentoringsLogsInfoDb.cadets.intraId,
          rejectMessage: mentoringsLogsInfoDb.rejectMessage,
        };
        return cancelMessage;
      }
      default: {
        return null;
      }
    }
  }

  private async getMentoringLogsAllRealtions(
    mentoringsId: string,
  ): Promise<MentoringLogs> {
    let mentoringLogsDb: MentoringLogs = null;
    try {
      mentoringLogsDb = await this.mentoringsLogsRepository.findOne({
        where: { id: mentoringsId },
        relations: {
          cadets: true,
          mentors: true,
        },
      });
    } catch {
      throw new ConflictException();
    }

    if (mentoringLogsDb === null) {
      throw new NotFoundException();
    }

    return mentoringLogsDb;
  }

  private getMentoringHours(startTime: Date, endTime: Date): number {
    const millisecondToHour = 3600000;

    const mentoringTimeHours =
      (endTime.getTime() - startTime.getTime()) / millisecondToHour;

    return mentoringTimeHours;
  }

  private async reserveTimeToString(
    reservationTime: Date,
    mentoringTime: number,
  ): Promise<string> {
    if (mentoringTime === 0) {
      return '';
    }

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

  private vaildateDbData(
    mentoringsLogsInfoDb: MentoringLogs,
    mailType: MailType,
  ) {
    switch (mailType) {
      case MailType.Reservation: {
        if (!mentoringsLogsInfoDb.requestTime1) {
          throw new NotFoundException('요청시간을 1개도 찾을 수 없습니다');
        }
        /* requestTime2,3은 널이나 빈 배열이 될 수 있음 */
        /* 0000-00-00 00:00은 예외처리할 데이터 */
        if (!mentoringsLogsInfoDb.requestTime2) {
          mentoringsLogsInfoDb.requestTime2 = [
            new Date(0, 0, 0, 0, 0, 0, 0),
            new Date(0, 0, 0, 0, 0, 0),
          ];
        }
        if (!mentoringsLogsInfoDb.requestTime3) {
          mentoringsLogsInfoDb.requestTime3 = [
            new Date(0, 0, 0, 0, 0, 0, 0),
            new Date(0, 0, 0, 0, 0, 0),
          ];
        }
        if (mentoringsLogsInfoDb.requestTime1.length !== 2) {
          throw new NotFoundException('올바른 요청시간 형식이 아닙니다');
        }
        /* requestTime2,3은 널이나 빈 배열이 될 수 있음 */
        /* 0000-00-00 00:00은 예외처리할 데이터 */
        if (mentoringsLogsInfoDb.requestTime2.length < 2) {
          mentoringsLogsInfoDb.requestTime2 = [
            new Date(0, 0, 0, 0, 0, 0, 0),
            new Date(0, 0, 0, 0, 0, 0),
          ];
        }
        if (mentoringsLogsInfoDb.requestTime3.length < 2) {
          mentoringsLogsInfoDb.requestTime3 = [
            new Date(0, 0, 0, 0, 0, 0, 0),
            new Date(0, 0, 0, 0, 0, 0),
          ];
        }
        mentoringsLogsInfoDb.requestTime1.forEach(function (value) {
          if (value === null) {
            throw new NotFoundException(
              '올바른 데이터 형식이 아닙니다 : requestTime1',
            );
          }
        });
        mentoringsLogsInfoDb.requestTime2.forEach(function (value) {
          if (value === null) {
            throw new NotFoundException(
              '올바른 데이터 형식이 아닙니다 : requestTime2',
            );
          }
        });
        mentoringsLogsInfoDb.requestTime3.forEach(function (value) {
          if (value === null) {
            throw new NotFoundException(
              '올바른 데이터 형식이 아닙니다 : requestTime3',
            );
          }
        });

        break;
      }
      case MailType.Approve: {
        if (!mentoringsLogsInfoDb.meetingAt) {
          throw new NotFoundException(
            '예약확정시간(meetingAt)을 찾을 수 없습니다',
          );
        }
        if (mentoringsLogsInfoDb.meetingAt.length !== 2) {
          throw new NotFoundException(
            '예약확정시간(meetingAt)을 찾을 수 없습니다',
          );
        }
        mentoringsLogsInfoDb.meetingAt.forEach(function (value) {
          if (value === null) {
            throw new NotFoundException(
              '올바른 데이터 형식이 아닙니다 : meetingAt',
            );
          }
        });

        break;
      }
    }
  }
}
