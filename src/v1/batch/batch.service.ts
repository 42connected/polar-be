import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CancelMessageDto } from '../dto/email/send-message.dto';
import { EmailService } from '../email/service/email.service';
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
    let mentorDb: MentoringLogs = null;
    try {
      mentorDb = await this.mentoringsLogsRepository.findOne({
        where: { id: mentoringsId },
      });
    } catch {
      throw new ConflictException();
    }

    if (mentorDb === null) {
      throw new NotFoundException();
    }

    return mentorDb;
  }

  async cancelMeetingAuto(
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

    //엔터티 수정이 안되어 있어 일단 하드코딩으로
    //mentorSlackId와 cadet이메일을 작성함
    //추후에 DB 탐색을 통해서 데이터 가져오게 수정할 예정
    const cancelMessageInfo: CancelMessageDto = {
      mentorSlackId: 'jokang',
      cadetEmail: 'autoba9687@gmail.com',
      rejectMessage: 'test',
    };

    await this.addTimeout(
      millisecondsTime,
      mentoringLogsData,
      cancelMessageInfo,
    );

    return true;
  }

  private async addTimeout(
    milliseconds: number,
    mentoringLogsData: MentoringLogs,
    cancelMessageInfo,
  ): Promise<void> {
    const callback = () => {
      const meetingStatus = mentoringLogsData.status;
      const waitingStatus = '대기중';
      const mentoringId = mentoringLogsData.id;

      if (meetingStatus !== waitingStatus) {
        this.logger.log(
          `autoCancel mentoringsLogs ${mentoringId} after (${milliseconds}) : 실행취소 상태가 '대기중'이 아닙니다`,
        );
        return;
      }

      // const cancelMailPromise = this.emailService
      //   .sendCancelMessageToCadet(cancelMessageInfo)
      //   .then(() => {
      //     this.logger.log(
      //       `autoCancel mentoringsLogs ${mentoringId} 메일 전송 완료`,
      //     );
      //   });

      // cancelMailPromise.catch(error =>
      //   this.logger.log(`autoCancel mentoringsLogs ${mentoringId} ${error}`),
      // );

      const cancelStatus = '취소';
      mentoringLogsData.status = cancelStatus;

      const mentoringLogsUpdatePromise = this.mentoringsLogsRepository
        .save(mentoringLogsData)
        .then(() =>
          this.logger.log(
            `autoCancel mentoringsLogs ${mentoringId} status 대기중 -> 취소 상태변경 완료`,
          ),
        );

      mentoringLogsUpdatePromise.catch(() =>
        this.logger.log(
          `autoCancel mentoringsLogs ${mentoringId} status 대기중 -> 취소 상태변경 실패`,
        ),
      );

      this.deleteTimeout(mentoringId);
    };

    const mentoringId = mentoringLogsData.id;
    const timeout = setTimeout(callback, milliseconds);
    try {
      this.schedulerRegistry.addTimeout(mentoringId, timeout);
    } catch {
      this.deleteTimeout(mentoringId);
      this.schedulerRegistry.addTimeout(mentoringId, timeout);
    }
    this.logger.log(
      `autoCancel mentoringsLogs after ${milliseconds}ms, ${mentoringId} added!`,
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
