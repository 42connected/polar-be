import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMentorDto } from 'src/v1/dto/mentors/create-mentor.dto';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MentorsService {
  constructor(
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
  ) {}

  async createUser(user: CreateMentorDto) {
    const createdUser = await this.mentorsRepository.create(user);
    await this.mentorsRepository.save(createdUser);
    return { id: createdUser.id, intraId: createdUser.intraId, role: 'mentor' };
  }

  async findByIntra(intraId: string) {
    const foundUser = await this.mentorsRepository.findOneBy({ intraId });
    return { id: foundUser?.id, intraId: foundUser?.intraId, role: 'mentor' };
  }
  async getMentorDetails(mentorId: string) {
    return 'mentorId';
  }
}
