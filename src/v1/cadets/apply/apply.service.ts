import { Injectable, NotFoundException } from '@nestjs/common';
import { MentoringLogs } from '../../entities/mentoring-logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplyDto } from '../../dto/cadets/create-apply.dto';
import { Cadets } from '../../entities/cadets.entity';
import { Mentors } from '../../entities/mentors.entity';
import { jwtUser } from 'src/v1/dto/jwt-user.interface';

@Injectable()
export class ApplyService {
  constructor(
    @InjectRepository(MentoringLogs)
    private readonly mentoringlogsRepository: Repository<MentoringLogs>,
    @InjectRepository(Mentors)
    private readonly mentorsRepository: Repository<Mentors>,
    @InjectRepository(Cadets)
    private readonly cadetsRepository: Repository<Cadets>,
  ) {}

  async create(
    cadet: jwtUser,
    mentorId: string,
    createApplyDto: CreateApplyDto,
  ): Promise<MentoringLogs> {
    const findmentor: Mentors = await this.mentorsRepository.findOne({
      where: { id: mentorId },
    });
    if (!findmentor) throw new NotFoundException(`${mentorId} not found.`);
    const findcadet: Cadets = await this.cadetsRepository.findOne({
      where: { id: cadet.id },
    });
    if (!findcadet) throw new NotFoundException(`${cadet.id} not found.`);
    const tmpRepo = this.mentoringlogsRepository.create({
      cadets: findcadet,
      mentors: findmentor,
      createdAt: new Date(),
      meetingAt: null,
      topic: createApplyDto.topic,
      content: createApplyDto.content,
      status: '대기중',
      rejectMessage: null,
      reportStatus: '대기중',
      requestTime1: createApplyDto.requestTime1,
      requestTime2: createApplyDto.requestTime2,
      requestTime3: createApplyDto.requestTime3,
    });
    const updateRepo = await this.mentoringlogsRepository.save(tmpRepo);
    return updateRepo;
  }
}
