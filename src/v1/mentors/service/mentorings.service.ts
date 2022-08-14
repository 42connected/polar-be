import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtUser } from 'src/v1/interface/jwt-user.interface';
import { MentorMentoringInfo } from 'src/v1/interface/mentors/mentor-mentoring-info.interface';
import { UpdateMentoringDto } from 'src/v1/dto/mentors/update-mentoring.dto';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Repository } from 'typeorm';
import { MentorMentoringLogs } from 'src/v1/interface/mentors/mentor-mentoring-logs.interface';
import { PaginationDto } from 'src/v1/dto/pagination.dto';

@Injectable()
export class MentoringsService {
  constructor(
    @InjectRepository(MentoringLogs)
    private mentoringsLogsRepository: Repository<MentoringLogs>,
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
  ) {}

  async getMentoringsLists(user: jwtUser): Promise<MentorMentoringInfo> {
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

    const mentoringLogs: MentorMentoringLogs[] = mentorDb.mentoringLogs.map(
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
          reportStatus: mentoring.reportStatus,
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

  async setMeetingAt(body: UpdateMentoringDto): Promise<MentoringLogs> {
    let mentoringsData = null;

    try {
      mentoringsData = await this.mentoringsLogsRepository.findOne({
        where: { id: body.id },
      });
    } catch {
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }

    if (mentoringsData === null) {
      throw new NotFoundException('데이터를 찾을 수 없습니다');
    }

    mentoringsData.status = body.status;
    if (body.meetingAt) mentoringsData.meetingAt = body.meetingAt;
    if (body.rejectMessage) mentoringsData.rejectMessage = body.rejectMessage;

    try {
      return await this.mentoringsLogsRepository.save(mentoringsData);
    } catch {
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }
  }

  async getSimpleLogsPagination(
    mentorIntraId: string,
    paginationDto: PaginationDto,
  ): Promise<[MentoringLogs[], number]> {
    try {
      const simpleLogs = await this.mentoringsLogsRepository.findAndCount({
        select: {
          id: true,
          createdAt: true,
          meetingAt: true,
          topic: true,
          status: true,
        },
        where: {
          mentors: { intraId: mentorIntraId },
          status: '완료',
        },
        take: paginationDto.take,
        skip: paginationDto.take * (paginationDto.page - 1),
        order: { createdAt: 'DESC' },
      });
      return simpleLogs;
    } catch (e) {
      console.log(e);
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }
  }
}
