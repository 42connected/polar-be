import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApproveMessageDto } from 'src/v1/dto/email/approve-message.dto';
import { CancelMessageDto } from 'src/v1/dto/email/cancel-message.dto';
import { ReservationMessageDto } from 'src/v1/dto/email/reservation-message.dto';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
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
    let messageDto:
      | ReservationMessageDto
      | ApproveMessageDto
      | CancelMessageDto = null;
    const mailTypeString: string = this.stringifyMailType(mailType);
    try {
      messageDto = await this.getMessageDto(mentoringLogsId, mailType);
    } catch (err) {
      this.logger.warn(`${mailTypeString} 이메일 전송 실패 DB Error : ${err}`);
      return false;
    }

    if (messageDto === null) {
      this.logger.warn(`해당하는 MessageDto가 없습니다 : Check your MailType`);
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
      messageForm.to = mentorEmail;
      await this.mailService.sendMail(messageForm);
      messageForm.to = cadetEmail;
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
        let requestTime2: string;
        if (messageDto.reservationTime2) {
          requestTime2 = await this.reserveTimeToString(
            messageDto.reservationTime2[0],
            this.getMentoringHours(
              messageDto.reservationTime2[0],
              messageDto.reservationTime2[1],
            ),
          );
        } else requestTime2 = 'Empty';
        let requestTime3: string;
        if (messageDto.reservationTime3) {
          requestTime3 = await this.reserveTimeToString(
            messageDto.reservationTime3[0],
            this.getMentoringHours(
              messageDto.reservationTime3[0],
              messageDto.reservationTime3[1],
            ),
          );
        } else requestTime3 = 'Empty';
        return {
          subject: 'New mentoring request',
          template: 'ReservationMessage.hbs',
          context: {
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
        const reservationTimeToString = await this.reserveTimeToString(
          messageDto.meetingAt[0],
          this.getMentoringHours(
            messageDto.meetingAt[0],
            messageDto.meetingAt[1],
          ),
        );
        return {
          subject: 'Mentoring Approved',
          template: 'ApproveMessage.hbs',
          context: {
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
    mailtype: MailType,
  ): Promise<ReservationMessageDto | ApproveMessageDto | CancelMessageDto> {
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
    switch (mailtype) {
      case MailType.Reservation: {
        if (!mentoringsLogsInfoDb.mentors.email) {
          throw new NotFoundException('mentor email을 찾을 수 없습니다');
        }
        const reservationMessageDto: ReservationMessageDto = {
          mentorEmail: mentoringsLogsInfoDb.mentors.email,
          mentorSlackId: mentoringsLogsInfoDb.cadets.intraId,
          cadetEmail: mentoringsLogsInfoDb.cadets.email,
          cadetSlackId: mentoringsLogsInfoDb.cadets.intraId,
          reservationTime1: mentoringsLogsInfoDb.requestTime1,
          reservationTime2: mentoringsLogsInfoDb.requestTime2,
          reservationTime3: mentoringsLogsInfoDb.requestTime3,
          isCommon: mentoringsLogsInfoDb.cadets.isCommon,
        };
        return reservationMessageDto;
      }
      case MailType.Approve: {
        const approveMessageDto: ApproveMessageDto = {
          mentorEmail: mentoringsLogsInfoDb.mentors.email,
          mentorSlackId: mentoringsLogsInfoDb.cadets.intraId,
          cadetEmail: mentoringsLogsInfoDb.cadets.email,
          cadetSlackId: mentoringsLogsInfoDb.cadets.intraId,
          meetingAt: mentoringsLogsInfoDb.meetingAt,
        };
        return approveMessageDto;
      }
      case MailType.Cancel: {
        const cancelMessageDto: CancelMessageDto = {
          mentorEmail: mentoringsLogsInfoDb.mentors.email,
          mentorSlackId: mentoringsLogsInfoDb.cadets.intraId,
          cadetEmail: mentoringsLogsInfoDb.cadets.email,
          cadetSlackId: mentoringsLogsInfoDb.cadets.intraId,
          rejectMessage: mentoringsLogsInfoDb.rejectMessage,
        };
        return cancelMessageDto;
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

  private getMentoringHours(startTime: Date, endTime: Date) {
    const millisecondToHour = 3600000;

    const mentoringTimeHours =
      (endTime.getTime() - startTime.getTime()) / millisecondToHour;

    return mentoringTimeHours;
  }

  private async reserveTimeToString(
    reservationTime: Date,
    mentoringTime: number,
  ): Promise<string> {
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
}
