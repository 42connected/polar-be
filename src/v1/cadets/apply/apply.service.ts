import { Injectable, NotFoundException } from '@nestjs/common';
import { MentoringLogs } from '../../entities/mentoring-logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplyDto } from '../../dto/create-apply.dto';
import { Cadets } from '../../entities/cadets.entity';
import { Mentors } from '../../entities/mentors.entity';
import { Reports } from '../../entities/reports.entity';

export class ArrayApply {
  mentors: Mentors;
  cadets: Cadets;
  createdAt: Date;
  meetingAt: Date;
  topic: string;
  content: string;
  status: string;
  rejectMessage: string;
  reportStatus: string;
  requestTime1: Date;
  requestTime2: Date;
  requestTime3: Date;
  reports: Reports;
}

@Injectable()
export class ApplyService {
  private readonly arrayApplys: ArrayApply[] = [];

  constructor(
    @InjectRepository(MentoringLogs)
    private readonly mentoringlogsRepository: Repository<MentoringLogs>,
    @InjectRepository(Mentors)
    private readonly mentorsRepository: Repository<Mentors>,
  ) {}
  /*
  async foundMentor(mentorId: string) :Mentors{
    const findmentor = await this.mentorsRepository.findOne({
      where: { id: mentorId },
    });
    if (!findmentor) throw new NotFoundException(`${mentorId} not found.`);
    return findmentor;
  }
*/
  async create(cadetId, MentorId, createApplyDto: CreateApplyDto) {
    const findmentor = await this.mentorsRepository.findOne({
      where: { id: MentorId },
    });
    if (!findmentor) throw new NotFoundException(`${MentorId} not found.`);
    this.arrayApplys[0].cadets = cadetId;
    this.arrayApplys[0].mentors = findmentor;
    this.arrayApplys[0].createdAt = new Date();
    this.arrayApplys[0].meetingAt = null;
    this.arrayApplys[0].topic = createApplyDto.topic;
    this.arrayApplys[0].content = createApplyDto.content;
    this.arrayApplys[0].status = '대기중';
    this.arrayApplys[0].rejectMessage = null;
    this.arrayApplys[0].reportStatus = '대기중';
    this.arrayApplys[0].requestTime1 = createApplyDto.requestTime1;
    this.arrayApplys[0].requestTime2 = createApplyDto.requestTime2;
    this.arrayApplys[0].requestTime3 = createApplyDto.requestTime3;

    await this.mentoringlogsRepository.save(this.arrayApplys);
    return this.arrayApplys;
    //return this.foundMentor(MentorId);
  }

  findAll() {
    //return 'hello';
    return this.mentoringlogsRepository.find({});
  }
}
