import { Injectable, NotFoundException } from '@nestjs/common';
import { MentoringLogs } from '../../entities/mentoring-logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplyDto } from '../../dto/cadets/create-apply.dto';
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
  requestTime1: Date[];
  requestTime2: Date[];
  requestTime3: Date[];
  reports: Reports;
}

@Injectable()
export class ApplyService {
  constructor(
    @InjectRepository(MentoringLogs)
    private readonly mentoringlogsRepository: Repository<MentoringLogs>,
    @InjectRepository(Mentors)
    private readonly mentorsRepository: Repository<Mentors>,
  ) {}

  async create(cadetId, mentorId, createApplyDto: CreateApplyDto) {
    const arrayApplys: ArrayApply[] = [];
    const findmentor = await this.mentorsRepository.findOne({
      where: { id: mentorId },
    });
    if (!findmentor) throw new NotFoundException(`${mentorId} not found.`);
    arrayApplys[0].cadets = cadetId;
    arrayApplys[0].mentors = findmentor;
    arrayApplys[0].createdAt = new Date();
    arrayApplys[0].meetingAt = null;
    arrayApplys[0].topic = createApplyDto.topic;
    arrayApplys[0].content = createApplyDto.content;
    arrayApplys[0].status = '대기중';
    arrayApplys[0].rejectMessage = null;
    arrayApplys[0].reportStatus = '대기중';
    arrayApplys[0].requestTime1 = createApplyDto.requestTime1;
    arrayApplys[0].requestTime2 = createApplyDto.requestTime2;
    arrayApplys[0].requestTime3 = createApplyDto.requestTime3;

    await this.mentoringlogsRepository.save(arrayApplys);
    return arrayApplys;
  }

  findAll() {
    return this.mentoringlogsRepository.find({});
  }
}
