import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtUser } from 'src/v1/dto/jwt-user.interface';
import { CreateMentorDatailDto } from 'src/v1/dto/mentors/create-mentor-detail.dto';
import { CreateMentorDto } from 'src/v1/dto/mentors/create-mentor.dto';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MentorsService {
  constructor(
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
  ) {}

  async createUser(user: CreateMentorDto): Promise<jwtUser> {
    const createdUser: Mentors = this.mentorsRepository.create(user);
    await this.mentorsRepository.save(createdUser);
    return { id: createdUser.id, intraId: createdUser.intraId, role: 'mentor' };
  }

  async findByIntra(intraId: string): Promise<jwtUser> {
    const foundUser: Mentors = await this.mentorsRepository.findOneBy({
      intraId,
    });
    return { id: foundUser?.id, intraId: foundUser?.intraId, role: 'mentor' };
  }

  async getMentorDetails(intraId: string): Promise<Mentors> {
    const mentorDetails: Mentors = await this.mentorsRepository.findOne({
      where: {
        intraId: intraId,
      },
      relations: {
        mentoringLogs: true,
        comments: true,
      },
    });
    if (mentorDetails === null) {
      throw new NotFoundException(`해당 멘토를 찾을 수 없습니다`);
    }
    return mentorDetails;
  }

  async postMentorDetails(intraId: string, body: CreateMentorDatailDto) {
    const mentorDetails: Mentors = await this.mentorsRepository.findOneBy({
      intraId: intraId,
    });
    if (mentorDetails === null) {
      throw new NotFoundException(`해당 멘토를 찾을 수 없습니다`);
    }
    mentorDetails.availableTime = body.availableTime
      ? body.availableTime
      : mentorDetails.availableTime;
    mentorDetails.introduction = body.introduction
      ? body.introduction
      : mentorDetails.introduction;
    mentorDetails.isActive = body.isActive
      ? body.isActive
      : mentorDetails.isActive;
    mentorDetails.markdownContent = body.markdownContent
      ? body.markdownContent
      : mentorDetails.markdownContent;
    await this.mentorsRepository.save(mentorDetails);
    return { ok: true };
  }
}
