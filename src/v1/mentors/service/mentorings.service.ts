import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/v1/dto/pagination.dto';
import { MentoringLogStatus } from 'src/v1/mentoring-logs/service/mentoring-logs.service';
import { MentoringInfoDto } from 'src/v1/dto/mentors/mentoring-info.dto';
import { MentoringLogsDto } from 'src/v1/dto/mentors/mentoring-logs.dto';
import { SimpleLogDto } from '../../dto/mentoring-logs/simple-log.dto';

@Injectable()
export class MentoringsService {
  constructor(
    @InjectRepository(MentoringLogs)
    private mentoringsLogsRepository: Repository<MentoringLogs>,
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
  ) {}

  formatMentoringLog(log: MentoringLogs): MentoringLogsDto {
    return {
      id: log.id,
      createdAt: log.createdAt,
      meetingAt: log.meetingAt,
      cadet: {
        name: log.cadets.name,
        intraId: log.cadets.intraId,
        resumeUrl: log.cadets.resumeUrl,
        isCommon: log.cadets.isCommon,
      },
      topic: log.topic,
      status: log.status,
      report: {
        id: log.reports ? log.reports.id : null,
        status: log.reports ? log.reports.status : null,
      },
      meta: {
        requestTime: [log.requestTime1, log.requestTime2, log.requestTime3],
        rejectMessage: log.rejectMessage,
        content: log.content,
      },
    };
  }

  async getMentoringsLists(
    intraId: string,
    pagination: PaginationDto,
  ): Promise<MentoringInfoDto> {
    const MENTORING_LOG_INDEX = 0;
    const MENTORING_COUNT_INDEX = 1;

    let result: [MentoringLogs[], number];
    try {
      result = await this.mentoringsLogsRepository.findAndCount({
        relations: { cadets: true, reports: true },
        where: {
          mentors: { intraId },
        },
        take: pagination.take,
        skip: pagination.take * (pagination.page - 1),
        order: { createdAt: 'DESC' },
      });
    } catch {
      throw new ConflictException('데이터 검색 중 에러가 발생했습니다.');
    }
    const logs: MentoringLogsDto[] = result[MENTORING_LOG_INDEX].map(log => {
      return this.formatMentoringLog(log);
    });
    return { logs, total: result[MENTORING_COUNT_INDEX] };
  }

  async getSimpleLogsPagination(
    mentorIntraId: string,
    paginationDto: PaginationDto,
  ): Promise<[SimpleLogDto[], number]> {
    try {
      const simpleLogs: [SimpleLogDto[], number] =
        await this.mentoringsLogsRepository.findAndCount({
          select: {
            id: true,
            createdAt: true,
            meetingAt: true,
            topic: true,
            status: true,
            meetingStart: true,
          },
          where: {
            mentors: { intraId: mentorIntraId },
            status: MentoringLogStatus.Done,
          },
          take: paginationDto.take,
          skip: paginationDto.take * (paginationDto.page - 1),
          order: { meetingStart: 'DESC' },
        });
      return simpleLogs;
    } catch (e) {
      throw new ConflictException(e, '예기치 못한 에러가 발생하였습니다');
    }
  }
}
