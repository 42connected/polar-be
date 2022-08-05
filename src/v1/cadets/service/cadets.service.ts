import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CadetMentoringInfo } from 'src/v1/dto/cadet-mentoring-info.interface';
import { CadetMentoringLogs } from 'src/v1/dto/cadet-mentoring-logs.interface';
import { CreateCadetDto } from 'src/v1/dto/cadets/create-cadet.dto';
import { jwtUser } from 'src/v1/dto/jwt-user.interface';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CadetsService {
  constructor(
    @InjectRepository(Cadets) private cadetsRepository: Repository<Cadets>,
  ) {}

  async createUser(user: CreateCadetDto): Promise<jwtUser> {
    try {
      const createdUser: Cadets = await this.cadetsRepository.create(user);
      await this.cadetsRepository.save(createdUser);
      return {
        id: createdUser.id,
        intraId: createdUser.intraId,
        role: 'cadet',
      };
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 데이터 생성 중 에러가 발생했습니다.',
      );
    }
  }

  async findByIntra(intraId: string): Promise<jwtUser> {
    try {
      const foundUser: Cadets = await this.cadetsRepository.findOneBy({
        intraId,
      });
      return { id: foundUser?.id, intraId: foundUser?.intraId, role: 'cadet' };
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 데이터 검색 중 에러가 발생했습니다.',
      );
    }
  }

  formatMentorings(
    logs: MentoringLogs[],
    isCommon: boolean,
  ): CadetMentoringLogs[] {
    return logs.map(mentoring => {
      return {
        id: mentoring.id,
        mentor: {
          intraId: mentoring.mentors.intraId,
          name: mentoring.mentors.name,
        },
        createdAt: mentoring.createdAt,
        status: mentoring.status,
        content: mentoring.content,
        meta: {
          isCommon,
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
    });
  }

  async getMentoringLogs(id: string): Promise<CadetMentoringInfo> {
    try {
      const cadet: Cadets = await this.cadetsRepository.findOne({
        where: { id },
        relations: { mentoringLogs: { mentors: true } },
      });
      if (cadet === null) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      const mentorings: CadetMentoringLogs[] = this.formatMentorings(
        cadet.mentoringLogs,
        cadet.isCommon,
      );
      return { username: cadet.name, mentorings };
    } catch (err) {
      throw new ConflictException(
        err,
        '멘토링 데이터 검색 중 에러가 발생했습니다.',
      );
    }
  }
}
