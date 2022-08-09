import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  SerializeOptions,
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

  cancelMeetingAuto(mentoringsId: string, millisecondsTime: number) {
    if (!mentoringsId) {
      return 'false';
    }

    this.addTimeout(mentoringsId, millisecondsTime);
  }

  async addTimeout(id: string, milliseconds: number) {
    const callback = () => {
      let mentorDb = null;

      try {
        mentorDb = this.mentoringsLogsRepository.findOne({
          where: { id: id },
        });
      } catch {
        throw new ConflictException('예기치 못한 에러가 발생하였습니다');
      }

      if (mentorDb === null) {
        throw new NotFoundException('데이터를 찾을 수 없습니다');
      }

      if (mentorDb.state === '대기중') {
        //예약 취소 슬랙 메세지
        console.log('예약 취소입니다');

        //DB에서 this.mentoringBB state === '취소'
        mentorDb.state === '취소';

        this.logger.warn(
          `autoCancell ${id} executing after (${milliseconds})!`,
        );
      } else {
        this.logger.warn(
          `autoCancell ${id} not executing after (${milliseconds})!`,
        );
      }

      this.deleteTimeout(id);
    };
    const timeout = setTimeout(callback, milliseconds);

    try {
      this.schedulerRegistry.addTimeout(id, timeout);
    } catch {
      this.deleteTimeout(id);
      this.schedulerRegistry.addTimeout(id, timeout);
    }
    this.logger.warn(`autoCancell after ${milliseconds}, ${id} added!`);
  }

  getTimeoutlists() {
    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach(key => this.logger.log(`Timeout: ${key}`));
  }

  deleteTimeout(name: string) {
    this.schedulerRegistry.deleteTimeout(name);
    this.logger.warn(`Timeout ${name} deleted!`);
  }
}
