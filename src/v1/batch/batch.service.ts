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
import { Batch } from '../entities/batch.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { MentoringLogStatus } from '../mentoring-logs/service/mentoring-logs.service';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(
    @InjectRepository(MentoringLogs)
    private mentoringsLogsRepository: Repository<MentoringLogs>,
    @InjectRepository(Batch)
    private batchRepository: Repository<Batch>,
    private schedulerRegistry: SchedulerRegistry,
    private emailService: EmailService,
  ) {}

  async createBatchItem(logId: string): Promise<Batch> {
    const created: Batch = this.batchRepository.create({
      mentoringLogId: logId,
      timestamp: Date.now().toString(),
    });
    try {
      await this.batchRepository.save(created);
    } catch (err) {
      throw new ConflictException(err, '데이터 저장 중 에러가 발생했습니다.');
    }
    return created;
  }

  async removeBatchItem(logId: string): Promise<void> {
    try {
      await this.batchRepository.delete({ mentoringLogId: logId });
    } catch (err) {
      throw new ConflictException(err, '데이터 삭제 중 에러가 발생했습니다.');
    }
  }

  private async getMentoringLogsDB(
    mentoringsId: string,
  ): Promise<MentoringLogs> {
    let mentoringLogsDb: MentoringLogs = null;
    try {
      mentoringLogsDb = await this.mentoringsLogsRepository.findOne({
        where: { id: mentoringsId },
      });
    } catch {
      throw new ConflictException('데이터 검색 중 에러가 발생했습니다.');
    }
    if (mentoringLogsDb === null) {
      throw new NotFoundException('해당 id의 멘토링 로그를 찾을 수 없습니다.');
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
    const mentoringLogsData: MentoringLogs = await this.getMentoringLogsDB(
      mentoringsId,
    );
    if (mentoringLogsData.status !== MentoringLogStatus.Wait) {
      this.logger.log(
        '멘토링 로그의 상태가 대기중일 경우만 자동 취소 등록이 가능합니다.',
      );
    }
    await this.createBatchItem(mentoringLogsData.id);
    await this.addTimeout(millisecondsTime, mentoringLogsData);
    return true;
  }

  async addTimeout(
    milliseconds: number,
    mentoringLogsData: MentoringLogs,
  ): Promise<void> {
    const { id: mentoringId } = mentoringLogsData;
    const callback = async () => {
      const log: MentoringLogs = await this.mentoringsLogsRepository.findOneBy({
        id: mentoringId,
      });
      if (log.status === MentoringLogStatus.Wait) {
        log.status = MentoringLogStatus.Cancel;
        log.rejectMessage =
          '48시간 동안 멘토링 확정으로 바뀌지 않아 자동취소 되었습니다';
        this.mentoringsLogsRepository
          .save(log)
          .then(() =>
            this.logger.log(
              `autoCancel mentoringsLogs ${log.id} status 대기중 -> 거절 상태변경 완료`,
            ),
          )
          .catch(() =>
            this.logger.log(
              `autoCancel mentoringsLogs ${log.id} status 대기중 -> 거절 상태변경 실패`,
            ),
          );
        this.emailService
          .sendMessage(log.id, MailType.Cancel)
          .then(() => {
            this.logger.log(
              `autoCancel mentoringsLogs ${log.id} 메일 전송 완료`,
            );
          })
          .catch(error =>
            this.logger.log(`autoCancel mentoringsLogs ${log.id} ${error}`),
          );
      }
      this.deleteTimeout(log.id);
      this.removeBatchItem(log.id);
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

  async getBatches(): Promise<Batch[]> {
    try {
      const batches: Batch[] = await this.batchRepository.find();
      return batches;
    } catch (err) {
      throw new ConflictException(err, '데이터 검색 중 에러가 발생했습니다.');
    }
  }

  async registerBatches(): Promise<void> {
    const twoDaytoMillseconds = 172800000;
    const batches: Batch[] = await this.getBatches();
    batches.forEach(async batch => {
      const mentoringLog: MentoringLogs =
        await this.mentoringsLogsRepository.findOneBy({
          id: batch.mentoringLogId,
        });
      const deleteTime: number = +batch.timestamp + twoDaytoMillseconds;
      if (mentoringLog.status !== MentoringLogStatus.Wait) {
        this.removeBatchItem(mentoringLog.id);
      } else if (Date.now() >= deleteTime) {
        mentoringLog.status = MentoringLogStatus.Cancel;
        mentoringLog.rejectMessage =
          '48시간 동안 멘토링 확정으로 바뀌지 않아 자동취소 되었습니다';
        this.mentoringsLogsRepository.save(mentoringLog);
        this.logger.log(
          `autoCancel mentoringsLogs ${mentoringLog.id} status 대기중 -> 거절 상태변경 완료`,
        );
        this.removeBatchItem(mentoringLog.id);
      } else {
        const remainTime: number = deleteTime - Date.now();
        await this.addTimeout(remainTime, mentoringLog);
      }
    });
  }

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
        if (e?.requestTime1?.[startIndex] && e.requestTime1[startIndex] < now)
          return true;
        if (e?.requestTime2?.[startIndex] && e.requestTime2[startIndex] < now)
          return true;
        if (e?.requestTime3?.[startIndex] && e.requestTime3[startIndex] < now)
          return true;
        return false;
      })
      .forEach(async e => {
        e.status = MentoringLogStatus.Cancel;
        e.rejectMessage =
          '선택할 수 있는 멘토링 요청 시간이 존재하지 않아 자동 취소되었습니다';
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
