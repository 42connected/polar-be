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

  async changeStatus(
    userId: string,
    mentoringLogId: string,
    status: MentoringLogStatus,
    meetingAt?: Date[],
    rejectMessage?: string,
  ) {
    const foundLog: MentoringLogs = await this.findMentoringLogWithRelations(
      mentoringLogId,
    );
    this.validateUser(userId, status, foundLog);
    this.validateStatus(foundLog.status, status);
    foundLog.status = status;
    if (status === MentoringLogStatus.Cancel) {
      foundLog.rejectMessage = rejectMessage;
    }
    if (status === MentoringLogStatus.Approve) {
      this.applyService.checkDate(meetingAt[0], meetingAt[1]);
      foundLog.meetingAt = meetingAt;
    }
    try {
      await this.mentoringLogsRepository.save(foundLog);
    } catch (err) {
      throw new ConflictException('멘토링 로그 저장 중 에러가 발생했습니다.');
    }
    return foundLog;
  }
}
