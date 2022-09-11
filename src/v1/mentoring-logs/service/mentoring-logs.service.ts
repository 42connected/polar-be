import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplyService } from 'src/v1/cadets/apply/apply.service';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { ChangeStatus } from 'src/v1/interface/mentoring-log/change-status.interface';
import { Repository } from 'typeorm';

export enum MentoringLogStatus {
  Wait = '대기중',
  Approve = '확정',
  Cancel = '취소',
  Done = '완료',
}

@Injectable()
export class MentoringLogsService {
  constructor(
    @InjectRepository(MentoringLogs)
    private mentoringLogsRepository: Repository<MentoringLogs>,
    private applyService: ApplyService,
  ) {}

  async findMentoringLogWithRelations(id: string): Promise<MentoringLogs> {
    try {
      const foundLog: MentoringLogs =
        await this.mentoringLogsRepository.findOne({
          where: { id },
          relations: {
            mentors: true,
            cadets: true,
          },
        });
      return foundLog;
    } catch (err) {
      throw new ConflictException(
        err,
        '멘토링 로그 검색 중 에러가 발생했습니다.',
      );
    }
  }

  validateUser(
    userId: string,
    status: MentoringLogStatus,
    foundLog: MentoringLogs,
  ): void {
    if (status === MentoringLogStatus.Cancel) {
      if (
        userId !== foundLog.mentors.intraId &&
        userId !== foundLog.cadets.intraId
      ) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: '멘토링 로그에 대한 처리 권한이 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      if (userId !== foundLog.mentors.intraId) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: '멘토링 로그에 대한 처리 권한이 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  validateStatus(
    currentStatus: string,
    futureStatus: MentoringLogStatus,
  ): void {
    switch (futureStatus) {
      case MentoringLogStatus.Approve:
        if (currentStatus !== MentoringLogStatus.Wait) {
          throw new BadRequestException(
            '대기중 상태인 멘토링 로그만 확정이 가능합니다.',
          );
        }
        break;
      case MentoringLogStatus.Cancel:
        if (
          currentStatus !== MentoringLogStatus.Wait &&
          currentStatus !== MentoringLogStatus.Approve
        ) {
          throw new BadRequestException(
            '대기중이거나 확정된 멘토링만 취소가 가능합니다.',
          );
        }
        break;
      case MentoringLogStatus.Done:
        if (currentStatus !== MentoringLogStatus.Approve) {
          throw new BadRequestException('확정된 멘토링만 완료가 가능합니다.');
        }
        break;
      case MentoringLogStatus.Wait:
        throw new BadRequestException(
          '멘토링 상태를 대기중으로 변경이 불가능합니다.',
        );
    }
  }

  isValidTimeForMakeDone(log: MentoringLogs): boolean {
    const startMeetingAtIndex = 0;
    const DONE_LIMIT_MIN = 30;
    const now = new Date();
    now.setMinutes(now.getMinutes() - DONE_LIMIT_MIN);
    if (log.meetingAt[startMeetingAtIndex].getTime() > now.getTime()) {
      return false;
    }
    return true;
  }

  compareTime(t1: Date, t2: Date): boolean {
    if (!t1 || !t2) {
      return false;
    }
    if (t1.getTime() === t2.getTime()) {
      return true;
    }
    return false;
  }

  compareTimeStartToEnd(t1: Date[], t2: Date[]): boolean {
    const START_TIME_INDEX = 0;
    const END_TIME_INDEX = 1;

    if (
      this.compareTime(t1?.[START_TIME_INDEX], t2?.[START_TIME_INDEX]) &&
      this.compareTime(t1?.[END_TIME_INDEX], t2?.[END_TIME_INDEX])
    ) {
      return true;
    }
    return false;
  }

  isExistTimeOnLogs(requestMeetingAt: Date[], log: MentoringLogs) {
    if (
      this.compareTimeStartToEnd(requestMeetingAt, log?.requestTime1) ||
      this.compareTimeStartToEnd(requestMeetingAt, log?.requestTime2) ||
      this.compareTimeStartToEnd(requestMeetingAt, log?.requestTime3)
    ) {
      return true;
    }
    return false;
  }

  async changeStatus(infos: ChangeStatus) {
    const foundLog: MentoringLogs = await this.findMentoringLogWithRelations(
      infos.mentoringLogId,
    );
    this.validateUser(infos.userId, infos.status, foundLog);
    this.validateStatus(foundLog.status, infos.status);
    foundLog.status = infos.status;
    if (infos.status === MentoringLogStatus.Cancel) {
      foundLog.rejectMessage = infos.rejectMessage;
    } else if (infos.status === MentoringLogStatus.Approve) {
      if (!this.isExistTimeOnLogs(infos.meetingAt, foundLog)) {
        throw new BadRequestException(
          '해당 시간은 멘토링 로그에 존재하지 않습니다.',
        );
      }
      this.applyService.checkDate(infos.meetingAt[0], infos.meetingAt[1]);
      foundLog.meetingAt = infos.meetingAt;
      foundLog.meetingStart = infos.meetingAt[0];
    } else if (infos.status === MentoringLogStatus.Done) {
      if (!this.isValidTimeForMakeDone(foundLog)) {
        throw new BadRequestException(
          '멘토링 시작 시간 기준 30분 이후부터\n멘토링을 완료할 수 있습니다.',
        );
      }
    }
    try {
      await this.mentoringLogsRepository.save(foundLog);
    } catch (err) {
      throw new ConflictException('멘토링 로그 저장 중 에러가 발생했습니다.');
    }
    return foundLog;
  }
}
