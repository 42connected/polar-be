import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MentoringLogs } from '../entities/mentoring-logs.entity';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectRepository(MentoringLogs)
    private mentoringsLogsRepository: Repository<MentoringLogs>,
  ) {}

  async cancelMeetingAuto(
    mentoringsId: string,
    millisecondsTime: number,
  ): Promise<boolean> {
    if (!mentoringsId) {
      return false;
    }

    const result: boolean = await this.addTimeout(
      mentoringsId,
      millisecondsTime,
    );
    if (result === true) return true;
    return false;
  }

  async addTimeout(uuid: string, milliseconds: number): Promise<boolean> {
    let mentorDb = null;
    try {
      mentorDb = await this.mentoringsLogsRepository.findOne({
        where: { id: uuid },
      });
    } catch {
      this.logger.log(
        `autoCancel mentoringsLogs ${uuid} 데이터를 찾을 수 없습니다`,
      );
      return false;
    }

    if (mentorDb === null) {
      this.logger.log(
        `autoCancel mentoringsLogs ${uuid} 데이터를 찾을 수 없습니다`,
      );
      return false;
    }

    const callback = () => {
      const waitingStatus = '대기중';
      const cancelStatus = '취소';

      if (mentorDb.status === waitingStatus) {
        //슬랙 api -> 메일 api로 변경예정
        // const canceldMessageDto: CancelMessageDto = {
        //   mentorSlackId: 'jokang',
        //   cadetSlackId: 'jokang',
        // };

        // try {
        //   this.slackService.sendCanceldMessageToCadet(canceldMessageDto);
        // } catch {
        //   this.logger.log(`autoCancel ${uuid} 슬랙 API 실패`);
        //   return;
        // }

        mentorDb.status = cancelStatus;
        try {
          this.mentoringsLogsRepository.save(mentorDb);
        } catch {
          this.logger.log(
            `autoCancel mentoringsLogs ${uuid} status 업데이트 실패`,
          );
          return;
        }

        this.logger.log(
          `autoCancel mentoringsLogs ${uuid} after (${milliseconds}) : 실행완료 `,
        );
      } else {
        this.logger.log(
          `autoCancel mentoringsLogs ${uuid} after (${milliseconds}) : 실행취소 상태가 '대기중'이 아닙니다`,
        );
      }

      this.deleteTimeout(uuid);
    };

    const timeout = setTimeout(callback, milliseconds);
    try {
      this.schedulerRegistry.addTimeout(uuid, timeout);
    } catch {
      this.deleteTimeout(uuid);
      this.schedulerRegistry.addTimeout(uuid, timeout);
    }
    this.logger.log(
      `autoCancel mentoringsLogs after ${milliseconds}, ${uuid} added!`,
    );
  }

  getTimeoutlists() {
    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach(name => this.logger.log(`autoCancel: ${name}`));
  }

  deleteTimeout(uuid: string) {
    this.schedulerRegistry.deleteTimeout(uuid);
    this.logger.log(`autoCancel mentoringsLogs ${uuid} deleted!`);
  }
}
