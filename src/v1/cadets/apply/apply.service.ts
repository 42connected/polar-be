import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { MentoringLogs } from '../../entities/mentoring-logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplyDto } from '../../dto/cadets/create-apply.dto';
import { Cadets } from '../../entities/cadets.entity';
import { Mentors } from '../../entities/mentors.entity';
import { jwtUser } from 'src/v1/interface/jwt-user.interface';

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
    let findmentor: Mentors;
    let findcadet: Cadets;
    let tmpRepo: MentoringLogs;
    let updateRepo: MentoringLogs;
    try {
      findmentor = await this.mentorsRepository.findOne({
        where: { id: mentorId },
      });
    } catch {
      throw new ConflictException('값을 가져오는 도중 오류가 발생했습니다.');
    }
    if (!findmentor) throw new NotFoundException(`${mentorId} not found.`);
    try {
      findcadet = await this.cadetsRepository.findOne({
        where: { id: cadet.id },
      });
    } catch {
      throw new ConflictException('값을 가져오는 도중 오류가 발생했습니다.');
    }
    if (!findcadet) throw new NotFoundException(`${cadet.id} here not found.`);
    try {
      tmpRepo = this.mentoringlogsRepository.create({
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
    } catch {
      throw new ConflictException(
        '값을 repository에 생성하는 도중 오류가 발생했습니다.',
      );
    }
    try {
      updateRepo = await this.mentoringlogsRepository.save(tmpRepo);
    } catch {
      throw new ConflictException(
        '값을 repository에 저장하는 도중 오류가 발생했습니다.',
      );
    }
    return updateRepo;
  }
}
