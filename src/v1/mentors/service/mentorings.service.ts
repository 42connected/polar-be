import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async getMentoringslists(@Req() req) {
    console.log(req);
    return 'mentorId';
  }
}
