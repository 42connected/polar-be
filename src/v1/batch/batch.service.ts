import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailService, MailType } from '../email/service/email.service';
import { MentoringLogs } from '../entities/mentoring-logs.entity';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(
    @InjectRepository(MentoringLogs)
    private mentoringsLogsRepository: Repository<MentoringLogs>,
    private schedulerRegistry: SchedulerRegistry,
    private emailService: EmailService,
  ) {}

  private async getMentoringLogsDB(
    mentoringsId: string,
  ): Promise<MentoringLogs> {
    let mentoringLogsDb: MentoringLogs = null;
    try {
      mentoringLogsDb = await this.mentoringsLogsRepository.findOne({
        where: { id: mentoringsId },
      });
    } catch {
      throw new ConflictException();
    }

    if (mentoringLogsDb === null) {
      throw new NotFoundException();
    }

    return mentoringLogsDb;
  }

  async addAutoCancel(
    mentoringsId: string,
    millisecondsTime: number,
  ): Promise<boolean> {
    if (!mentoringsId) {
      return false;
    }
    let mentoringLogsData: MentoringLogs = null;
    try {
      mentoringLogsData = await this.getMentoringLogsDB(mentoringsId);
    } catch {
      this.logger.log('DB에서 정보를 읽어오는데 실패했습니다');
      return false;
    }
    if (mentoringLogsData.status !== '대기중') {
      this.logger.log(
        '멘토링 로그의 상태가 대기중일 경우만 자동 취소 등록이 가능합니다.',
      );
      // TODO: 로그를 예외로 변경
      // throw new BadRequestException(
      //   '멘토링 로그의 상태가 대기중일 경우만 자동 취소 등록이 가능합니다.',
      // );
    }
    await this.addTimeout(millisecondsTime, mentoringLogsData);

    return true;
  }

  private async addTimeout(
    milliseconds: number,
    mentoringLogsData: MentoringLogs,
  ): Promise<void> {
    const { id: mentoringId } = mentoringLogsData;
    const callback = () => {
      this.emailService
        .sendMessage(mentoringId, MailType.Cancel)
        .then(() => {
          this.logger.log(
            `autoCancel mentoringsLogs ${mentoringId} 메일 전송 완료`,
          );
        })
        .catch(error =>
          this.logger.log(`autoCancel mentoringsLogs ${mentoringId} ${error}`),
        );

      mentoringLogsData.status = '취소';
      mentoringLogsData.rejectMessage =
        '48시간 동안 멘토링 확정으로 바뀌지 않아 자동취소 되었습니다';

      this.mentoringsLogsRepository
        .save(mentoringLogsData)
        .then(() =>
          this.logger.log(
            `autoCancel mentoringsLogs ${mentoringId} status 대기중 -> 거절 상태변경 완료`,
          ),
        )
        .catch(() =>
          this.logger.log(
            `autoCancel mentoringsLogs ${mentoringId} status 대기중 -> 거절 상태변경 실패`,
          ),
        );

      this.deleteTimeout(mentoringId);
    };
    const timeout = setTimeout(callback, milliseconds);
    const millisecondsToHours = milliseconds / 3600000;
    try {
      this.schedulerRegistry.addTimeout(mentoringId, timeout);
    } catch {
      this.deleteTimeout(mentoringId);
      this.schedulerRegistry.addTimeout(mentoringId, timeout);
    }
    this.logger.log(
      `autoCancel mentoringsLogs after ${millisecondsToHours}hours, ${mentoringId} added!`,
    );
  }

  getTimeoutlists() {
    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach(name => this.logger.log(`autoCancel: ${name}`));
  }

  private deleteTimeout(uuid: string) {
    this.schedulerRegistry.deleteTimeout(uuid);
    this.logger.log(`autoCancel mentoringsLogs ${uuid} deleted!`);
  }
}
