import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailService, MailType } from '../email/service/email.service';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { MentoringLogStatus } from '../mentoring-logs/service/mentoring-logs.service';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(
    @InjectRepository(MentoringLogs)
    private mentoringsLogsRepository: Repository<MentoringLogs>,
    private emailService: EmailService,
  ) {}

  async manageMentoringLogsEveryMinute(): Promise<void> {
    const startIndex = 0;
    const LIMIT_MIN = 10;
    const mentoringLogs = await this.mentoringsLogsRepository.find({
      where: {
        status: '대기중',
      },
    });
    const now = new Date();
    this.logger.log(`${now} => Manage Mentoring Logs`);
    now.setMinutes(now.getMinutes() + LIMIT_MIN);

    mentoringLogs
      .filter(e => {
        const twoDaytoMillseconds = 172800000;
        if (e.createdAt.getTime() + twoDaytoMillseconds <= now.getTime()) {
          e.status = MentoringLogStatus.Cancel;
          e.rejectMessage =
            '48시간 동안 멘토링 상태가 확정으로 바뀌지 않아 자동취소 되었습니다';
          return true;
        }
        if (
          e?.requestTime1?.[startIndex] &&
          e.requestTime1[startIndex].getTime() < now.getTime()
        )
          return true;
        if (
          e?.requestTime2?.[startIndex] &&
          e.requestTime2[startIndex].getTime() < now.getTime()
        )
          return true;
        if (
          e?.requestTime3?.[startIndex] &&
          e.requestTime3[startIndex].getTime() < now.getTime()
        )
          return true;
        return false;
      })
      .forEach(async e => {
        e.status = MentoringLogStatus.Cancel;
        if (!e.rejectMessage) {
          e.rejectMessage =
            '현재 시간 기준 유효하지 않은 멘토링 요청이므로 자동 취소되었습니다';
        }
        this.logger.log(`Mentoring log's time is over => ${e.id}`);

        try {
          await this.mentoringsLogsRepository.save(e);
        } catch {
          this.logger.log(`Can't save mentoring status => ${e.id}`);
        }

        this.logger.log(`Send Mail => ${e.id}`);
        this.emailService
          .sendMessage(e.id, MailType.Cancel)
          .catch(error => this.logger.log(error));
      });
  }
}
