import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getKSTDate } from 'src/util/utils';
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

  /**
   * 멘토링 로그와 리퀘스트 타임 인덱스로 해당 인덱스의 Date[]를 가져옴.
   * @param logs 멘토링 로그
   * @param index 리퀘스트 타임 인덱스
   * @returns 멘토링 로그 리퀘스트 타임[인덱스] OR NULL
   */
  getRequestTimeOrNull(logs: MentoringLogs, index: number): Date[] {
    switch (index) {
      case 0:
        return logs.requestTime1;
      case 1:
        return logs.requestTime2;
      case 2:
        return logs.requestTime3;
      default:
        return null;
    }
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
      foundLog.meetingAt = [];
    } else if (infos.status === MentoringLogStatus.Approve) {
      const requestedTime = this.getRequestTimeOrNull(
        foundLog,
        infos.meetingAtIndex,
      );
      if (!requestedTime) {
        throw new BadRequestException(
          '해당 시간은 멘토링 로그에 존재하지 않습니다.',
        );
      }
      this.applyService.checkDate(
        getKSTDate(requestedTime[0]),
        getKSTDate(requestedTime[1]),
      );
      foundLog.meetingAt = requestedTime;
      foundLog.meetingStart = requestedTime[0];
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
