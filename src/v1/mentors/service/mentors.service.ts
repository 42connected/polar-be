import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mentors } from 'src/entities/mentors.entity';
import {
  EditMentorDetailsDto,
  ReturnEditMentorDetails,
  ReturnMentorDetails,
} from 'src/v1/mentors/interface/mentors.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MentorsService {
  constructor(
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
  ) {}

  async getMentorDetails(intraId: string): Promise<ReturnMentorDetails> {
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

  async postMentorDetails(
    intraId: string,
    req: EditMentorDetailsDto,
  ): Promise<ReturnEditMentorDetails> {
    const mentorDetails: Mentors = await this.mentorsRepository.findOneBy({
      intraId: intraId,
    });
    if (mentorDetails === null) {
      throw new NotFoundException(`해당 멘토를 찾을 수 없습니다`);
    }
    mentorDetails.availableTime = req.availableTime
      ? req.availableTime
      : mentorDetails.availableTime;
    mentorDetails.introduction = req.introduction
      ? req.introduction
      : mentorDetails.introduction;
    mentorDetails.isActive = req.isActive
      ? req.isActive
      : mentorDetails.isActive;
    mentorDetails.markdownContent = req.markdownContent
      ? req.markdownContent
      : mentorDetails.markdownContent;
    await this.mentorsRepository.save(mentorDetails);
    return { ok: true };
  }
}
