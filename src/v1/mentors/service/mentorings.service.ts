import {
  ConflictException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtUser } from 'src/v1/interface/jwt-user.interface';
import { MentorMentoringInfo } from 'src/v1/interface/mentors/mentor-mentoring-info.interface';
import { UpdateMentoringDto } from 'src/v1/dto/mentors/update-mentoring.dto';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Repository } from 'typeorm';
import { MentorMentoringLogs } from 'src/v1/interface/mentors/mentor-mentoring-logs.interface';

@Injectable()
export class MentoringsService {
  constructor(
    @InjectRepository(MentoringLogs)
    private mentoringsLogsRepository: Repository<MentoringLogs>,
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
    @InjectRepository(Cadets) private cadetsRepository: Repository<Cadets>,
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
}
