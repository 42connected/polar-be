import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMentorDto } from 'src/v1/dto/create-mentor.dto';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MentorsService {
  constructor(
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
  ) {}

  createUser(user: CreateMentorDto) {
    console.log('Create mentor', user);
    return { id: 1, username: 'nakkim' };
  }

  findByIntra(intraId: string) {
    // 찾아서 없으면
    return null;
  }
  async getMentorDetails(mentorId: string) {
    return 'mentorId';
  }
}
