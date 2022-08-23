import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CadetMentoringLogs } from 'src/v1/dto/cadet-mentoring-logs.interface';
import { CreateCadetDto } from 'src/v1/dto/cadets/create-cadet.dto';
import { UpdateCadetDto } from 'src/v1/dto/cadets/update-cadet.dto';
import { JwtUser } from 'src/v1/interface/jwt-user.interface';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Repository } from 'typeorm';
import { MentoringInfoDto } from 'src/v1/dto/cadets/mentoring-info.dto';

@Injectable()
export class CadetsService {
  constructor(
    @InjectRepository(Cadets) private cadetsRepository: Repository<Cadets>,
  ) {}

  async createUser(user: CreateCadetDto): Promise<JwtUser> {
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

  async findByIntra(intraId: string): Promise<JwtUser> {
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

  async findCadetByIntraId(intraId: string): Promise<Cadets> {
    let foundUser: Cadets;
    try {
      foundUser = await this.cadetsRepository.findOneBy({
        intraId,
      });
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 데이터 검색 중 에러가 발생했습니다.',
      );
    }
    if (!foundUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return foundUser;
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

  async getMentoringLogs(id: string): Promise<MentoringInfoDto> {
    let cadet: Cadets;
    try {
      cadet = await this.cadetsRepository.findOne({
        where: { id },
        relations: { mentoringLogs: { mentors: true } },
      });
    } catch (err) {
      throw new ConflictException(
        err,
        '멘토링 데이터 검색 중 에러가 발생했습니다.',
      );
    }
    if (cadet === null) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    const mentorings: CadetMentoringLogs[] = this.formatMentorings(
      cadet.mentoringLogs,
      cadet.isCommon,
    );
    return { username: cadet.name, mentorings };
  }

  async validateInfo(intraId: string): Promise<boolean> {
    try {
      const cadet: Cadets = await this.findCadetByIntraId(intraId);
      if (!cadet.name) {
        return false;
      }
      return true;
    } catch (err) {
      throw new ConflictException(err, '예기치 못한 에러가 발생하였습니다');
    }
  }

  async saveName(intraId: string, name: string): Promise<void> {
    if (name === '') {
      throw new BadRequestException('입력된 이름이 없습니다.');
    }
    const foundUser: Cadets = await this.findCadetByIntraId(intraId);
    try {
      foundUser.name = name;
      await this.cadetsRepository.save(foundUser);
    } catch (err) {
      throw new ConflictException(err, '예기치 못한 에러가 발생하였습니다');
    }
  }

  async updateCadet(cadetIntraId: string, updateCadetDto: UpdateCadetDto) {
    const cadet: Cadets = await this.findCadetByIntraId(cadetIntraId);
    cadet.resumeUrl = updateCadetDto.resumeUrl;
    try {
      await this.cadetsRepository.save(cadet);
    } catch {
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }
  }
}
