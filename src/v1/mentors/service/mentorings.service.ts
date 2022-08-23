import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtUser } from 'src/v1/interface/jwt-user.interface';
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

  async getMentoringsLists(user: JwtUser): Promise<MentoringInfoDto> {
    const mentorIntraId = user.intraId;
    let mentorDb = null;

    try {
      mentorDb = await this.mentorsRepository.findOne({
        where: { intraId: mentorIntraId },
        relations: {
          mentoringLogs: { cadets: true },
        },
        order: {
          mentoringLogs: {
            createdAt: 'DESC',
          },
        },
      });
    } catch {
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }

    if (mentorDb === null)
      throw new NotFoundException('데이터를 찾을 수 없습니다');

    const mentoringLogs: MentoringLogsDto[] = mentorDb.mentoringLogs.map(
      mentoring => {
        return {
          id: mentoring.id,
          createdAt: mentoring.createdAt,
          meetingAt: mentoring.meetingAt,
          cadet: {
            name: mentoring.cadets.name,
            intraId: mentoring.cadets.intraId,
            resumeUrl: mentoring.cadets.resumeUrl,
          },
          topic: mentoring.topic,
          status: mentoring.status,
          meta: {
            requestTime: [
              mentoring.requestTime1,
              mentoring.requestTime2,
              mentoring.requestTime3,
            ],
            isCommon: mentoring.cadets.isCommon,
            rejectMessage: mentoring.rejectMessage,
            content: mentoring.content,
          },
        };
      },
    );
    return { intraId: mentorIntraId, mentoringLogs };
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
          },
          where: {
            mentors: { intraId: mentorIntraId },
            status: MentoringLogStatus.Done,
          },
          take: paginationDto.take,
          skip: paginationDto.take * (paginationDto.page - 1),
          order: { createdAt: 'DESC' },
        });
      return simpleLogs;
    } catch (e) {
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }
  }
}
