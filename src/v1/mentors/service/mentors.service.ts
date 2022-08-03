import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mentors } from 'src/entities/mentors.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MentorsService {
  constructor(
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
  ) {}

  async getMentorDetails(mentorId: string) {
    return 'mentorId';
  }
}
