import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { MentoringLogs } from '../../entities/mentoring-logs.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(MentoringLogs)
    private readonly mentoringlogsRepository: Repository<MentoringLogs>,
    @InjectRepository(Mentors)
    private readonly mentorsRepository: Repository<Mentors>,
  ) {}

  async getAvailableTimes(id: string): Promise<string> {
    try {
      const found: Mentors = await this.mentorsRepository.findOne({
        select: { availableTime: true },
        where: { intraId: id },
      });
      if (!found) return '[]';
      return found.availableTime;
    } catch {
      throw new NotFoundException();
    }
  }

  async StringToJson(id: string) {
    const found: string = await this.getAvailableTimes(id);
    return JSON.parse(found);
  }

  async getRequestTimes(mentorIntraId: string): Promise<Date[]> {
    try {
      const found: MentoringLogs[] = await this.mentoringlogsRepository.find({
        select: {
          requestTime1: true,
          requestTime2: true,
          requestTime3: true,
        },
        where: {
          mentors: { intraId: mentorIntraId },
        },
      });
      return await this.makeRequestTimesArray(found);
    } catch {
      throw new NotFoundException();
    }
  }

  async makeRequestTimesArray(mentoringLogs: MentoringLogs[]): Promise<Date[]> {
    const result = [];
    mentoringLogs.forEach(element => {
      result.push(element.requestTime1);
      if (element.requestTime2) result.push(element.requestTime2);
      if (element.requestTime3) result.push(element.requestTime3);
    });
    return result;
  }
}
