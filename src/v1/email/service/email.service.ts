import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ApproveMessageDto,
  CancelMessageDto,
  ReservationMessageDto,
} from 'src/v1/dto/email/send-message.dto';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Repository } from 'typeorm';

export enum MailType {
  ReservationToMentor = 1,
  ApproveToCadet = 2,
  CancelToCadet = 3,
  AutoCancelToCadet = 4,
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private mailService: MailerService,
    @InjectRepository(MentoringLogs)
    private mentoringsLogsRepository: Repository<MentoringLogs>,
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
    @InjectRepository(Cadets) private cadetsRepository: Repository<Cadets>,
  ) {}

  async sendMessage(
    mentoringLogsId: string,
    mailType: MailType,
  ): Promise<boolean> {
    let messageDto = null;
    const mailTypeString: string = this.stringifyMailType(mailType);
    try {
      messageDto = await this.getMessageDto(mentoringLogsId, mailType);
    } catch (err) {
      this.logger.warn(`${mailTypeString} 이메일 전송 실패 DB Error : ${err}`);
      return false;
    }

    if (messageDto === null) {
      this.logger.warn(`해당하는 MessageDto가 없습니다 : Check you MailType`);
      return false;
    }

    const messageForm: ISendMailOptions = await this.getMailMessageForm(
      messageDto,
      mailType,
    );

    if (messageForm === null) {
      this.logger.warn(
        `해당하는 MailMessageForm이 없습니다 : Check you MailType`,
      );
      return false;
    }

    let mailSendState = false;
    for (let i = 0; i < 2 && mailSendState === false; i++) {
      try {
        mailSendState = await this.sendMailMessage(messageForm);
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
    let mailTypeString: string;

    switch (mailType) {
      case MailType.ApproveToCadet: {
        mailTypeString = '카뎃에게 승인';
        break;
      }
      case MailType.ReservationToMentor: {
        mailTypeString = '멘토에게 예약';
        break;
      }
      case MailType.CancelToCadet: {
        mailTypeString = '카뎃에게 취소';
        break;
      }
      case MailType.AutoCancelToCadet: {
        mailTypeString = '카뎃에게 자동취소';
        break;
      }
      default: {
        mailTypeString = 'undefind mailtype';
        break;
      }
    }

    return mailTypeString;
  }

  private async sendMailMessage(
    messageForm: ISendMailOptions,
  ): Promise<boolean> {
    try {
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
    const messageForm: ISendMailOptions = null;

    switch (mailType) {
      case MailType.ReservationToMentor: {
        const commonType: string = messageDto.isCommon
          ? '공통과정'
          : '심화과정';

        const requestTime1: string = await this.reserveTimeToString(
          messageDto.reservationTime1[0],
          this.getMetoingHours(
            messageDto.reservationTime1[0],
            messageDto.reservationTime1[1],
          ),
        );

        let requestTime2: string;
        if (messageDto.reservationTime2) {
          requestTime2 = await this.reserveTimeToString(
            messageDto.reservationTime2[0],
            this.getMetoingHours(
              messageDto.reservationTime2[0],
              messageDto.reservationTime2[1],
            ),
          );
        } else requestTime2 = 'Empty';

        let requestTime3: string;
        if (messageDto.reservationTime3) {
          const mentoringTime3 = (requestTime3 = await this.reserveTimeToString(
            messageDto.reservationTime3[0],
            this.getMetoingHours(
              messageDto.reservationTime3[0],
              messageDto.reservationTime3[1],
            ),
          ));
        } else requestTime3 = 'Empty';

        return {
          to: messageDto.mentorEmail,
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
      case MailType.ApproveToCadet: {
        const reservationTimeToString = await this.reserveTimeToString(
          messageDto.meetingAt[0],
          this.getMetoingHours(
            messageDto.meetingAt[0],
            messageDto.meetingAt[1],
          ),
        );

        return {
          to: messageDto.cadetEmail,
          subject: 'New mentoring request',
          template: 'ApproveMessage.hbs',
          context: {
            mentorSlackId: messageDto.mentorSlackId,
            reservationTimeToString: reservationTimeToString,
          },
        };
      }
      case MailType.CancelToCadet: {
        return {
          to: messageDto.cadetEmail,
          subject: 'New mentoring request',
          template: 'CancelMessage.hbs',
          context: {
            mentorSlackId: messageDto.mentorSlackId,
            rejectMessage: messageDto.rejectMessage,
          },
        };
      }
      case MailType.AutoCancelToCadet: {
        return {
          to: messageDto.cadetEmail,
          subject: 'New mentoring request',
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
  ): Promise<any> {
    let mentoringsLogsInfoDb = null;
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

    const cadetEmailForm = '@student.42seoul.kr';

    const cadetEmail = mentoringsLogsInfoDb.cadets.email
      ? mentoringsLogsInfoDb.cadets.email
      : mentoringsLogsInfoDb.cadets.intraId + cadetEmailForm;

    switch (mailtype) {
      case MailType.ReservationToMentor: {
        if (!mentoringsLogsInfoDb.mentors.email)
          throw new NotFoundException('mentor email을 찾을 수 없습니다');

        const reservationMessageDto: ReservationMessageDto = {
          mentorEmail: mentoringsLogsInfoDb.mentors.email,
          cadetSlackId: mentoringsLogsInfoDb.cadets.intraId,
          reservationTime1: mentoringsLogsInfoDb.requestTime1,
          reservationTime2: mentoringsLogsInfoDb.requestTime2,
          reservationTime3: mentoringsLogsInfoDb.requestTime3,
          isCommon: mentoringsLogsInfoDb.cadets.isCommon,
        };

        return reservationMessageDto;
      }
      case MailType.ApproveToCadet: {
        const approveMessageDto: ApproveMessageDto = {
          mentorSlackId: mentoringsLogsInfoDb.mentors.intraId,
          cadetEmail: cadetEmail,
          meetingAt: mentoringsLogsInfoDb.meetingAt,
        };

        return approveMessageDto;
      }
      case MailType.CancelToCadet: {
        const cancelMessageDto: CancelMessageDto = {
          mentorSlackId: mentoringsLogsInfoDb.mentors.intraId,
          cadetEmail: cadetEmail,
          rejectMessage: mentoringsLogsInfoDb.rejectMessage,
        };
        return cancelMessageDto;
      }
      case MailType.AutoCancelToCadet: {
        const autoCancelRejectMessage =
          '48시간 동안 멘토링 확정으로 바뀌지 않아 자동취소 되었습니다';

        const cancelMessageDto: CancelMessageDto = {
          mentorSlackId: mentoringsLogsInfoDb.mentors.intraId,
          cadetEmail: cadetEmail,
          rejectMessage: autoCancelRejectMessage,
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

  private getMetoingHours(startTime: Date, endTime: Date) {
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
