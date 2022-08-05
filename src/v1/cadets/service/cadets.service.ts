import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CadetMentoringInfo } from 'src/v1/dto/cadet-mentoring-info.interface';
import { CadetMentoringLogs } from 'src/v1/dto/cadet-mentoring-logs.interface';
import { CreateCadetDto } from 'src/v1/dto/cadets/create-cadet.dto';
import { jwtUser } from 'src/v1/dto/jwt-user.interface';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CadetsService {
  constructor(
    @InjectRepository(Cadets) private cadetsRepository: Repository<Cadets>,
  ) {}

  async createUser(user: CreateCadetDto): Promise<jwtUser> {
    const createdUser: Cadets = await this.cadetsRepository.create(user);
    await this.cadetsRepository.save(createdUser);
    return { id: createdUser.id, intraId: createdUser.intraId, role: 'cadet' };
  }

  async findByIntra(intraId: string): Promise<jwtUser> {
    const foundUser: Cadets = await this.cadetsRepository.findOneBy({
      intraId,
    });
    return { id: foundUser?.id, intraId: foundUser?.intraId, role: 'cadet' };
  }

  async getMentoringLogs(id: string): Promise<CadetMentoringInfo> {
    const cadet: Cadets = await this.cadetsRepository.findOne({
      where: { id },
      relations: { mentoringLogs: { mentors: true } },
    });
    if (cadet === null) {
      throw new NotFoundException('존재하지 않는 카뎃입니다.');
    }
    const mentorings: CadetMentoringLogs[] = cadet.mentoringLogs.map(
      mentoring => {
        return {
          id: mentoring.id,
          mentor: {
            intra: mentoring.mentors.intraId,
            name: mentoring.mentors.name,
          },
          createdAt: mentoring.createdAt,
          status: mentoring.status,
          content: mentoring.content,
          meta: {
            isCommon: cadet.isCommon,
            topic: mentoring.topic,
            requestTime: [
              mentoring.requestTime1,
              mentoring.requestTime2,
              mentoring.requestTime3,
            ],
            meetingAt: mentoring.meetingAt,
            rejectMessage: mentoring.rejectMessage,
          },
        };
      },
    );
    return { username: cadet.name, mentorings };
  }
}
