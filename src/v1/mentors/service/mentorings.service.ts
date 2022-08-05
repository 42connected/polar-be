import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MentorMentoringInfo } from 'src/v1/dto/mentor-mentoring-info.interface';
import { MentorMentoringLogs } from 'src/v1/dto/mentor-mentoring-logs.interface';
import { UpdateMentoringDto } from 'src/v1/dto/mentors/update-mentoring.dto';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MentoringsService {
  constructor(
    @InjectRepository(MentoringLogs)
    private mentoringsLogsRepository: Repository<MentoringLogs>,
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
    @InjectRepository(Cadets) private cadetsRepository: Repository<Cadets>,
  ) {}

  async getMentoringsLists(@Req() req): Promise<MentorMentoringInfo> {
    const mentorIntraId = req.user.intraId;
    let mentorDb;

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
      throw new NotFoundException('mentorings data not found');
    }

    const mentorings: MentorMentoringLogs[] = mentorDb.mentoringLogs.map(
      mentoring => {
        return {
          id: mentoring.id,
          createdAt: mentoring.createdAt,
          meetingAt: mentoring.meetingAt,
          cadet: {
            name: mentoring.cadets.name,
            intra: mentoring.cadets.intraId,
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
    return { intra: mentorIntraId, mentorings };
  }

  async setMeetingAt(body: UpdateMentoringDto): Promise<MentoringLogs> {
    const mentoringsData = await this.mentoringsLogsRepository.findOne({
      where: { id: body.id },
    });

    if (!mentoringsData) {
      throw new NotFoundException('mentorings data not found');
    }

    mentoringsData.status = body.status;
    if (body.meetingAt) mentoringsData.meetingAt = body.meetingAt;
    if (body.rejectMessage) mentoringsData.rejectMessage = body.rejectMessage;

    return this.mentoringsLogsRepository.save(mentoringsData);
  }
}
